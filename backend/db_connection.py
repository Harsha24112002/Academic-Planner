import pymongo
from config import configurations

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
        
        # Student collection
        self.studentOperations = StudentDBOperations(self.cluster[configurations["database"]["student_collection"]])
        

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

database = Database()