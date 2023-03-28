import pymongo
from config import configurations

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
            self.client = pymongo.MongoClient(f"mongodb+srv://{self.username}:{self.password}@{self.dbname}.a2wanoh.mongodb.net/?retryWrites=true&w=majority")
        
        # getting the database cluster
        self.cluster = self.client[self.dbname]
        
        # test the database connection
        self.test_connection()

        # getting the collection from cluster
        self.collection = self.cluster[configurations['database']['collection']]

    # code to check if remote mongo server is accessible
    def test_connection(self):
        try:
            self.cluster.command("ping")
            print("Successfully connected to MongoDB server!")
        except Exception as e:
            print("Error connecting to MongoDB: " + str(e))
            exit()

    # add user to the database
    def add_user(self, user):
        self.collection.insert_one(user)

    # check if a user if present in the database using email
    def check_email(self, email):
        return bool(self.collection.find_one({"email": email}))

    # check if a user if present in the database using username
    def check_username(self, username):
        return bool(self.collection.find_one({"username": username}))

    # get user from the database using email
    def get_user_by_email(self, email):
        return self.collection.find_one({"email": email})

    # get user from the database using username
    def get_user_by_username(self, username):
        return self.collection.find_one({"username": username})
