import pymongo
from config import configurations

# getting the database configurations
host = configurations['database']['host']
username = configurations['database']['username']
password = configurations['database']['password']
dbname = configurations['database']['dbname']

# connecting to the database

if host == 'localhost':
	# connect to local database
	client = pymongo.MongoClient(host, 27017)
else:
	# connect to remote database
	client = pymongo.MongoClient(f"mongodb+srv://{username}:{password}@{dbname}.a2wanoh.mongodb.net/?retryWrites=true&w=majority")

# !!! future work: add a try catch block to handle exceptions related to database connection

# getting the database
cluster = client[dbname]

# getting the collection
collection = cluster["users"]

# add user to the database
def add_user(user):
	collection.insert_one(user)

# check if a user if present in the database using email
def check_email(email):
	if collection.find_one({"email": email}):
		return True
	return False

# check if a user if present in the database using username
def check_username(username):
	if collection.find_one({"username": username}):
		return True
	return False

# get user from the database using email
def get_user(email):
	return collection.find_one({"email": email})

# get user from the database using username
def get_user_by_username(username):
	return collection.find_one({"username": username})