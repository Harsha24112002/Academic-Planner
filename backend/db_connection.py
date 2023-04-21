import pymongo
from config import configurations

# !!! Add try catch block to handle errors while operating with Database
# from pymongo.errors import BulkWriteError

class Database:
    _instance = None
    def __new__(cls,*args,**kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls,*args,**kwargs)
        return cls._instance
    
    def __init__(self):
        # getting the database configurations
        self.host = configurations['database']['host']
        self.username = configurations['database']['username']
        self.password = configurations['database']['password']
        self.dbname = configurations['database']['dbname']

        if not hasattr(self,"client"):
            # connecting to the database
            if self.host == 'localhost' or self.host == None:
                # connect to local database
                self.client = pymongo.MongoClient(self.host, 27017)
            else:
                # connect to remote database
                self.client = pymongo.MongoClient(f"mongodb+srv://{self.username}:{self.password}@{self.dbname}.*******.mongodb.net/?retryWrites=true&w=majority")
        
            # getting the database cluster
            self.cluster = self.client[self.dbname]
            
            # test the database connection
            self.test_connection()
        
            #collections
            student_col = self.cluster[configurations["database"]["student_collection"]]
            course_col = self.cluster[configurations["database"]["course_collection"]]
            path_col = self.cluster[configurations["database"]["path_collection"]]
            admin_col = self.cluster[configurations["database"]["admin_collection"]]
            
            # Student collection
            self.studentOperations = StudentDBOperations(student_col)
            self.courseOperations = CourseDBOperations(course_col)
            self.pathOperations = PathDBOperations(path_col)
            self.adminOperations = AdminDBOperations(admin_col)

    # code to check if remote mongo server is accessible
    def test_connection(self):
        try:
            self.cluster.command("ping")
            print("Successfully connected to MongoDB server!")
        except Exception as e:
            print("Error connecting to MongoDB: " + str(e))
            exit()

class UserDBOperations:
    def __init__(self, user_collection) -> None:
        self.user_collection = user_collection

    def add_user(self,user):
        self.user_collection.insert_one(user)

    # check if a user if present in the database using email
    def check_email(self,email):
        if self.user_collection.find_one({"email": email}):
            return True
        return False

    # check if a user if present in the database using username
    def check_username(self,username):
        if self.user_collection.find_one({"username": username}):
            return True
        return False

    # get user from the database using email
    def get_user(self,email):
        return self.user_collection.find_one({"email": email})

    # get user from the database using username
    def get_user_by_username(self,username):
        return self.user_collection.find_one({"username": username})

    def update(self,email,newvalues):
        new_q = {"$set" : newvalues}       
        self.user_collection.update_one({"email":email}, new_q)
        return "Success"

class CourseDBOperations:
    def __init__(self,course_collection) -> None:
        self.course_collection = course_collection
        
    def get_course_details(self,query):
        course_details = self.course_collection.find_one({"course_id":query})
        print(course_details)
        return course_details
    
    def get_courses(self,query):
        pattern = '.*'+str(query)+'.*'
        courses = self.course_collection.find({"course_id": {"$regex": pattern, "$options":"i"}})
        course_ids = [[course["course_id"],course["course_name"]] for course in courses]
        courses = self.course_collection.find({"course_name": {"$regex": pattern,"$options":"i"}})
        course_ids.extend([[course["course_id"],course["course_name"]] for course in courses])
        return course_ids
        
    def get_prerequisites_of_course(self, course_id):
        course_details = self.course_collection.find_one({ "course_id" : course_id })

        if course_details == None :
            return None
        return course_details["course_prerequisites"] 
    
    def find_cycles(self, course, visited=set()):
        visited.add(course)
        pipeline = [
            {
                '$match': {
                    'course_id': course
                }
            },
            {
                '$lookup': {
                    'from' : 'course_collection',
                    'localField': 'course_prerequisites',
                    'foreignField': 'course_id',
                    'as': 'prerequisite_courses'
                }
            }
        ]
        try:
            for doc in self.course_collection.aggregate(pipeline):
                for prerequisite in doc.get('prerequisite_courses', []):
                    if prerequisite['course_id'] in visited:
                        return True  # cycle detected!
                    elif self.find_cycles(prerequisite['course_id'], visited):
                        return True
                visited.remove(course)
                return False
        except Exception as e:
            print(e)
            return False
    
        

    def add_course(self,courseDetails):
        try:
            if not self.check_course(courseDetails["course_id"]):
                self.course_collection.insert_one(courseDetails)
                
                if self.find_cycles(courseDetails["course_id"]):
                    try:
                        self.course_collection.delete_one({"course_id":courseDetails["course_id"]})
                        return f"Cycle detected in course prerequisites: {courseDetails}"
                    except Exception as e:
                        return f"{e}"
                return "Success"
            else:
                return "Course already found in DB"
        except Exception as e:
            return e
        
    def update_course(self,courseDetails):
        if self.check_course(courseDetails["course_id"]):
            before_change = self.get_course_by_id(courseDetails["course_id"])
            self.course_collection.update_one(
                { "course_id":courseDetails["course_id"]},
                {"$set":courseDetails}
            )
            if self.find_cycles(courseDetails["course_id"]):
                    try:
                        self.course_collection.update_one({"course_id":courseDetails["course_id"]},{"$set":before_change})
                        return f"Cycle detected in course prerequisites: {courseDetails}"
                    except Exception as e:
                        return f"{e}"
            return "Updated"
        else:
            return "Course Not Found in DataBase"

    def get_course_by_id(self,course_id):
        course = self.course_collection.find_one({"course_id":course_id})
        return course

    def check_course(self,course_id):
        try:
            if self.course_collection.find_one({"course_id":course_id}):
                return True
            else:
                return False
        except Exception as e:
            return e 
    
class StudentDBOperations(UserDBOperations):
    def __init__(self,student_collection) -> None:
        super().__init__(student_collection)
    
    def add_course(self,email, course_dict):
        if self.user_collection.find_one({"email":email})["course_list"] is None:
            self.user_collection.update_one(
                {"email":email},
                {"$set" : {"course_list" : [course_dict]}}
            )
        else:
            self.user_collection.update_one(
                { "email" : email }, 
                { "$addToSet" : { "course_list" : course_dict }}
            )
        # !!! add try cache block and return the error message
        # return "Internal Server Error! Please Try Later"
        return "Success"

    def delete_course(self, id, course_id):
        self.user_collection.update_one(
            { "id" : id },
            { "$pull" : { "course_list" : { "course_id" : course_id }}}
        )
        # !!! add try cache block and return the error message
        # return "Internal Server Error! Please Try Later"
        return "Success"

    # def update_course_status(self, id, course_id, status):
    #     self.user_collection.update_one(
    #         { "id" : id , "course_list.course_id" },
    #         { "$set" : { "course_list.$[course].status" : status }},
    #         { arrayFilters: [
    #             { "course.course_id" : course_id }
    #         ]}
    #     )

    def update_course_status(self, id, course_id, status):

        # !!! add try and cache blocks for error handling

        # update the student collection course details
        # !!! nothing to do with id as it is session id?
        filter = {"id": id, "course_list.course_id": course_id}
        update = {"$set": {"course_list.$.course_status": status}}
        result = self.user_collection.update_one(filter, update)

        return "Success" if result.modified_count == 1 else "Failed"

    def add_notes(self, email, course_id, notes):
        self.user_collection.update_one(
            {"email" : email, "course_list.course_id" : course_id},
            { "$set" : {"course_list.$.note" : notes.note}}
        )
        return "Success"

    def delete_notes(self, email, course_id):
        self.user_collection.update_one(
            {"email" : email, "course_list.course_id" : course_id},
            { "$set" : {"course_list.$.note" : None}}
        )
        return "Success"
   
class AdminDBOperations(UserDBOperations):
    def __init__(self, user_collection) -> None:
        super().__init__(user_collection)
 
class PathDBOperations:
    def __init__(self,pathCollection) -> None:
        self.pathCollection = pathCollection

    def check_path(self,pathName):
        try:
            if self.pathCollection.find_one({"name":pathName}):
                return True
            else:
                return False
        except Exception as e:
            return e 
        
    def add_path(self,pathDetails):
        try:
            if not self.check_path(pathDetails["name"]):
                self.pathCollection.insert_one(pathDetails)
                return "Success"
            else:
                return "Path already exists"
        except Exception as e:
            return e
        
    def remove_path(self,pathName):
        try:
            if self.check_path(pathName):
                self.pathCollection.delete_one({"name" : pathName})
                return "Success"
            else:
                return "Path doesn't exists"
        except Exception as e:
            return e
    
    def get_path_by_name(self,pathName):
        try:
            if self.check_path(pathName):
                return self.pathCollection.find_one({"name" : pathName})
            else:
                return "Path doesn't exists"
        except Exception as e:
            return e
    
    def update_path(self,name,pathDetails):
        try:
            if self.check_path(name):
                self.pathCollection.update_one(
                    {"name" : name},
                    {"$set" : pathDetails}
                )
                return "Success"
            else:
                return "Path doesn't exists"
        except Exception as e:
            return e
        

database = Database()