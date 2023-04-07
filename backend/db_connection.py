import pymongo
from config import configurations
from Models.models import StudentCourseSpecification

# !!! Add try catch block to handle errors while operating with Database
# from pymongo.errors import BulkWriteError

class Database:
    def __init__(self):
        # getting the database configurations
        self.host = configurations['database']['host']
        self.username = configurations['database']['username']
        self.password = configurations['database']['password']
        self.dbname = configurations['database']['dbname']
        self.client = None
        
        # connecting to the database
        if self.host == 'localhost':
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
        
        # Student collection
        self.studentOperations = StudentDBOperations(student_col)
        self.adminOperations = AdminDBOperations(course_col,path_col)

    # code to check if remote mongo server is accessible
    def test_connection(self):
        try:
            self.cluster.command("ping")
            print("Successfully connected to MongoDB server!")
        except Exception as e:
            print("Error connecting to MongoDB: " + str(e))
            exit()

class StudentDBOperations():
    def __init__(self,collection) -> None:
        self.collection = collection
        
    def add_user(self,user):
        self.collection.insert_one(user)

    # check if a user if present in the database using email
    def check_email(self,email):
        if self.collection.find_one({"email": email}):
            return True
        return False

    # check if a user if present in the database using username
    def check_username(self,username):
        if self.collection.find_one({"username": username}):
            return True
        return False

    # get user from the database using email
    def get_user(self,email):
        return self.collection.find_one({"email": email})

    # get user from the database using username
    def get_user_by_username(self,username):
        return self.collection.find_one({"username": username})

    def update(self,email,newvalues):
        new_q = {"$set" : newvalues}       
        x = self.collection.update_one({"email":email}, new_q)
        print(x.modified_count)

    def add_course(self, id, course_dict):
        self.collection.update_one(
            { "id" : id }, 
            { "$addToSet" : { "course_list" : course_dict }}
        )
        # !!! add try cache block and return the error message
        # return "Internal Server Error! Please Try Later"
        return "Success"

    def delete_course(self, id, course_id):
        self.collection.update_one(
            { "id" : id },
            { "$pull" : { "course_list" : { "course_id" : course_id }}}
        )
        # !!! add try cache block and return the error message
        # return "Internal Server Error! Please Try Later"
        return "Success"

    # def update_course_status(self, id, course_id, status):
    #     self.collection.update_one(
    #         { "id" : id , "course_list.course_id" },
    #         { "$set" : { "course_list.$[course].status" : status }},
    #         { arrayFilters: [
    #             { "course.course_id" : course_id }
    #         ]}
    #     )

    def add_notes(self, student_id, course_id, notes):
        self.collection.update_one(
            {"id" : student_id, "course_list.course_id" : course_id},
            { "$set" : {"course_list.$.note" : notes.note}}
        )

    def delete_notes(self, student_id, course_id):
        self.collection.update_one(
            {"id" : student_id, "course_list.course_id" : course_id},
            { "$pull" : {"course_list.$.notes" : None}}
        )

class AdminDBOperations:
    def __init__(self,courseCollection,pathCollection) -> None:
        self.courseCollection = courseCollection
        self.pathCollection = pathCollection
    
    def add_course(self,courseDetails):
        try:
            if not self.check_course(courseDetails["course_id"]):
                self.courseCollection.insert_one(courseDetails)
                return "Success"
            else:
                return "Course already found in DB"
        except Exception as e:
            return e
        
    def update_course(self,courseDetails):
        if self.check_course(courseDetails["course_id"]):
            self.courseCollection.update_one(
                { "course_id":courseDetails["course_id"]},
                {"$set":courseDetails}
            )
            return "Updated"
        else:
            return "Course Not Found in DataBase"

    def get_course_by_id(self,course_id):
        course = self.courseCollection.find_one({"course_id":course_id})
        return course

    def check_course(self,course_id):
        try:
            if self.courseCollection.find_one({"course_id":course_id}):
                return True
            else:
                return False
        except Exception as e:
            return e 
        
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