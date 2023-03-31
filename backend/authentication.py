from flask import request, session, Blueprint
from passlib.hash import pbkdf2_sha256 as sha256
from Models.models import  Student, StudentCourseSpecification
from pydantic import parse_obj_as
from typing import List

from db_connection import database

# creating Blueprint
# The url's whose prefix starts with authentication, comes to this Blueprint
authentication = Blueprint("authentication", __name__, url_prefix="/authentication/")

# code to take in user details and add user to database
@authentication.route("/get_details/student", methods=["POST"])
def get_details():
	if not session.get("user"):
		return "Not logged in"

	stud = Student(**session["user"])
	req = request.json
	stud.update_metadata(**req)
	database.studentOperations.update(session["user"], stud.dict())
	session["user"] = stud.dict()
	return "User added successfully"

# code to signup user
@authentication.route("/signup/student", methods=["POST"])
def signup():
	# check if user already exists
	email = request.form.get("email")
	if database.studentOperations.check_email(email):
		return "Email already exists"
	if database.studentOperations.check_username(request.form.get("username")):
		return "Username already exists"
	
	# actually ask user for profile information and add user to database
	# !!! redirect to profile page details

	user_dict = request.form.to_dict()
	user_dict["password"] = sha256.encrypt(user_dict["password"])
	user = Student(**user_dict) # For pydantic check
	
	database.studentOperations.add_user(user_dict)

	return "User Added successfully"

# code to login user
@authentication.route("/login/student", methods=["POST"])
def login():
	# check if user session exists
	if session.get("user"):
		return "Already logged in"
	
	# get user from database from the email provided
	email = request.form.get("email")
	_user = database.studentOperations.get_user(email)

	# check if user exists
	if _user:
		# check if password is correct
		if sha256.verify(request.form.get("password"), _user["password"]):
			stud = Student(**database.studentOperations.get_user(email))
			session["user"] = stud.__dict__
			return "Logged in successfully"
		else:
			return "Incorrect password"

	# user does not exist
	# !!! redirect to signup page
	return "User does not exist"

# code to logout user
@authentication.route("/logout/", methods=["GET"])
def logout():
	# check if user session exists
	if session.get("user"):
		session.pop("user")
		return "Logged out successfully"

	# !!! redirect to login page
	return "Already logged out"