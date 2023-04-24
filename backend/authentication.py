from flask import request, session, Blueprint
from passlib.hash import pbkdf2_sha256 as sha256
from Models.models import  Student
import gridfs
import os
from werkzeug.utils import secure_filename
from db_connection import database
import io
import PIL.Image as Image
import base64
from functools import wraps
from flask import redirect, url_for

folder = os.path.join('uploads_server') # Assigns upload path to variable
os.makedirs(folder, exist_ok=True)

def login_required(allowed_roles):
	def wrapper(f):
		@wraps(f)
		def decorated_function(*args, **kwargs):
			if 'user' not in session :
				return {"message": "redirect to Home Page"}
			if 'role' not in session["user"] :
				return {"message": "Error Occurred while handling role in session! Please report"}
			if session["user"]["role"] not in allowed_roles :
				return {"message": "You are not allowed to access this route"}
			return f(*args, **kwargs)
		return decorated_function
	return wrapper

# creating Blueprint
# The url's whose prefix starts with authentication, comes to this Blueprint
authentication = Blueprint("authentication", __name__, url_prefix="/authentication/")

fs = gridfs.GridFS(database.cluster, collection="student_profile_pictures")

# code to take in user details and add user to database
@authentication.route("/get_details/student", methods=["POST","GET"])
@login_required(["student"])
def get_details():
	if request.method == "POST":
		if not session.get("user"):
			return "Not logged in"

		stud = Student(**session["user"])
		req = request.json
		stud.update_metadata(**req)
		database.studentOperations.update(session["user"]["email"], stud.dict())
		session["user"] = stud.dict()
		return "User added successfully"
	
	elif request.method == "GET":
		
		###!!! TO BE CHANGED AFTER LOGIN
		response = database.studentOperations.get_user_by_username('gp101')
		# print('respomse:', resp)
		# session['user'] = Student(**database.studentOperations.get_user_by_username('gp121')).dict()
		stud = Student(**response)
		# print("ok1")
		session["user"] = stud.dict()
		session["user"]["role"] = "student"

		if not session.get("user"):
			return "Not logged in"
		
		response = session['user'].copy()
		response['photo'] = get_profile_picture()
		return response

@authentication.route("/get_profile_picture/", methods=["POST"])
@login_required(["admin", "student"])
def get_profile_picture():
	file_contents = fs.get(session["user"]['photo_url']).read()
	image = Image.open(io.BytesIO(file_contents))
	img_byte_arr = io.BytesIO()
	image.save(img_byte_arr, format='PNG')
	return base64.encodebytes(img_byte_arr.getvalue()).decode('ascii')

# code to signup user
@authentication.route("/signup/student", methods=["POST"])
def signup():
	# check if user already exists
	email = request.form.get("email")
	if database.studentOperations.check_email(email):
		return "Email already exists"
	if database.studentOperations.check_username(request.form.get("username")):
		return "Username already exists"

	user_dict = request.form.to_dict()
	file = request.files["photo"]
	file_name = email #+ '-' + file.filename
	file_contents = file.read()

	user_dict["photo_url"] = fs.put(file_contents, _id = file_name)
	user_dict["password"] = sha256.encrypt(user_dict["password"])
	user = Student(**user_dict, type="student") # For pydantic check
	
	database.studentOperations.add_user(user.dict())
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
			session["user"] = stud.dict()
			session["user"]["role"] = "student"
			return "Logged in successfully"
		else:
			return "Incorrect password"

	# user does not exist
	# !!! redirect to signup page
	return "User does not exist"

# code to logout user
@authentication.route("/logout/", methods=["GET"])
@login_required(["admin","student"])
def logout():
	# check if user session exists
	if session.get("user"):
		session.pop("user")
		return "Logged out successfully"

	# !!! redirect to login page
	return "Already logged out"