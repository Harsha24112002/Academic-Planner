from flask import request, session, Blueprint, redirect
from passlib.hash import pbkdf2_sha256 as sha256
from Models.models import User

from db_connection import *
import json

# creating Blueprint
# The url's whose prefix starts with authentication, comes to this Blueprint
authentication = Blueprint("authentication", __name__, url_prefix="/authentication")

# code to take in user details and add user to database
@authentication.route("/get_details/", methods=["POST"])
def get_details():
	user = User()
	user.update_metadata(
		request.form.get("first_name"),
		request.form.get("last_name"),
		request.form.get("username"),
		request.form.get("password"),
		request.form.get("email"),
		request.form.get("photo_url"),
		request.form.get("id")
	)

	json_format = json.dumps(user)
	add_user(json_format)
	return "User added successfully"

# code to signup user
@authentication.route("/signup/", methods=["POST"])
def signup():

	# create a normal dictionary from the form data
	_user = {
		"username": request.form.get("username"),
		"email": request.form.get("email"),
		"password": sha256.encrypt(request.form.get("password"))
	}

	# check if user already exists
	if check_email(_user["email"]) or check_username(_user["username"]):
		return "User already exists"

	# actually ask user for profile information and add user to database
	# !!! redirect to profile page details

	# user = User()
	# user.update_metadata(
	# 	request.form.get("first_name"),
	# 	request.form.get("last_name"),
	# 	request.form.get("username"),
	# 	request.form.get("password"),
	# 	request.form.get("email"),
	# 	request.form.get("photo_url"),
	# 	request.form.get("id")
	# )

	# json_format_user = None
	# json.dump(user, json_format_user)
	# add_user(json_format_user)

	add_user(_user)

	return "User Added successfully"

# code to login user
@authentication.route("/login/", methods=["POST"])
def login():
	# get user from database from the email provided
	email = request.form.get("email")
	_user = get_user(email)

	# check if user session exists
	if session.get(email):
		return "Already logged in"
	
	# check if user exists
	if _user:
		# check if password is correct
		if sha256.verify(request.form.get("password"), _user["password"]):
			session[email] = email
			return "Logged in successfully"
		else:
			return "Incorrect password"

	# user does not exist
	# !!! redirect to signup page
	return "User does not exist"

# code to logout user
@authentication.route("/logout/", methods=["GET"])
def logout():
	# get user from database from the email provided
	email = request.form.get("email")

	# check if user session exists
	if session.get(email):
		session.pop(email)
		return "Logged out successfully"

	# !!! redirect to login page
	return "Already logged out"