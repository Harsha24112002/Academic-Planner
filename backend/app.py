from flask import Flask
from flask_cors import CORS
import pymongo

app = Flask(__name__)
CORS(app)

# testing DB connection
client = pymongo.MongoClient("mongodb+srv://cs19btech11039:testingdatabase@testdb.a2wanoh.mongodb.net/?retryWrites=true&w=majority")
db = client['test']

@app.route('/')
def hello_world():
	return 'Hello World'  


@app.route('/page')
def page():
	return 'Welcome to page'


def create_entry():
	new_entry = {"name": "GG", "age": 25, "city": "Bangalore"}
	result = db.users.insert_one(new_entry)
	return f"New entry created with ID {result.inserted_id}"

@app.route('/accessdb')
def accessdb():
	try:
		db.command("ping")
		print(create_entry())
		return "Successfully connected to MongoDB!"
	except Exception as e:
		return "Error connecting to MongoDB: " + str(e)