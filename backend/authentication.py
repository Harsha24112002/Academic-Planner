from flask import request, session, Blueprint
from passlib.hash import pbkdf2_sha256 as sha256
from Models.models import  Student, Admin
import gridfs
from db_connection import database
import io
import PIL.Image as Image
import base64
from functools import wraps
from flask import redirect, url_for
import random as random
import string as string
from email_service.sender import send_email

cache = {}

def login_required(allowed_roles):
	def wrapper(f):
		@wraps(f)
		def decorated_function(*args, **kwargs):
			# print(f, " session here : ", session)
			if 'user' not in session :
				return {
					"status" : "error",
					"message": "redirect to Home Page, Login to Access",
				}, 401 #Unauthorized
			if 'role' not in session["user"] :
				return {
					"status" : "error",
					"message": "An unexpected error occurred! Please try again later. Report if this occurs continously",
				}, 500 #Internal Error
			if session["user"]["role"] not in allowed_roles :
				return {
					"status" : "error",
					"message": "You are not allowed to access this route"
				}, 403 #Forbidden
			return f(*args, **kwargs)
		return decorated_function
	return wrapper

# creating Blueprint
# The url's whose prefix starts with authentication, comes to this Blueprint
authentication = Blueprint("authentication", __name__, url_prefix="/authentication/")
photo_fs = gridfs.GridFS(database.cluster, collection="student_profile_pictures")


@authentication.route("/edit_profile_photo/student", methods=["POST"])
@login_required(["student"])
def edit_profile_photo():
	file = request.files["photo"]
	file_name = session["user"]["email"] #+ '-' + file.filename
	file_contents = file.read()
	file = photo_fs.get(file_name)

	# Delete the existing chunks
	req = {}
	photo_fs.delete(file_name)
	req['photo_url']  = photo_fs.put(file_contents, _id = file_name)
 
	# photo_fs.update(file_contents, _id = file_name)
	# req['photo_url'] = photo_fs.get( _id = file_name)
	database.studentOperations.update(session["user"]["email"], req)
 
	return req["photo_url"]
 
	

# code to take in user details and add user to database
@authentication.route("/get_details/student", methods=["POST","GET"])
@login_required(["student"])
def get_details():
	print("get_details/student : ", session["user"]["email"])
	if request.method == "POST":
		if not session.get("user"):
			return "Not logged in"

		stud = Student(**session["user"])
		req = request.json
		print(req)

  
		
		stud.update_metadata(**req)
		database.studentOperations.update(session["user"]["email"], stud.dict())
		session["user"] = stud.dict()
		return "User added successfully"
	
	elif request.method == "GET":

		###!!! TO BE CHANGED AFTER LOGIN
		response = database.studentOperations.get_user(session['user']['email'])
		# session['user'] = Student(**database.studentOperations.get_user_by_username('gp121')).dict()
		stud = Student(**response)
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
	file_contents = photo_fs.get(session["user"]['photo_url']).read()
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
		return {
			"status" : "error",
			"message" : "Email already exists",			
		}, 400 #Bad request
	if database.studentOperations.check_username(request.form.get("username")):
		return { 
			"status" : "error",
			"message" : "Username already exists"
		}, 409 # Conflict

	# if email.split('@')[1] != database.cluster['database']['domain_name']:
	# 	return "Email not from IITH domain"
	try:
		user_dict = request.form.to_dict()
		try:
			file = request.files["photo"]
			file_name = email #+ '-' + file.filename
			file_contents = file.read()
			user_dict["photo_url"] = photo_fs.put(file_contents, _id = file_name)
		except Exception as e:
			pass
		user_dict["password"] = sha256.hash(user_dict["password"])
		user = Student(**user_dict, type="student") # For pydantic check
		# user = None
		database.studentOperations.add_user(user.dict())
		return {
			"status" : "success",
			"message" : "User Added successfully"
		}, 200 #OK
	
	except:
		return {
			"status" : "error",
			"message" : "Unexpected error occured while reading contents of response. Please insert proper data"
		}, 500 #Internal Server Error


# code to get otp, new password
@authentication.route("/student/forgot_password/new_details", methods=["POST"])
def get_new_details():

	# print details from request
	print(request.form)

	email = request.form.get("email")
	otp = cache[email]
	form_otp = request.form.get("otp")

	print(f'otp: {otp} email: {email}')
	form_otp = request.form.get("otp")
	form_password = request.form.get("password")
	
	print(f'otp : {otp} form_otp : {form_otp}')

	# check if otp is correct
	if otp != form_otp:
		return {
			"status" : "error",
			"message" : "Incorrect OTP"
		}, 400
	
	# update the password in database
	# get user with email
	_user = database.studentOperations.get_user(email)
	# update password
	_user["password"] = sha256.encrypt(form_password)
	# update user in database

	try:
		database.studentOperations.update(email, _user)
		return {
			"status" : "success",
			"message" : "Password updated successfully"
		}, 200
	
	except:
		return {
			"status" : "error",
			"message" : "An unexpected error occurred! Please try again later. Report if this occurs continously"
		}, 500

# code to reset password
@authentication.route("/student/forgot_password", methods=["POST"])
def reset_password():
	# from email_util import send_email

	email = request.form.get("email")
	# check if user exists
	if not database.studentOperations.check_email(email):
		return {
			"status" : "error",
			"message" : "Email does not exist"
		}, 400

	else:
		# generate a random string of length 6
		otp = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 6))
		# send otp to email
		# if successful then ask for otp, new password and confirm password
		# else return error
		try:
			send_email(email, "OTP for password reset", 
	     			f'Your OTP for password reset is {otp}\nIt is valid for 10 minutes')
			print(f'Mail sent to {email}')
			cache[f'{email}'] = otp
			# session['user']['otp'] = otp
			# return get_new_details(email, otp)

			return {
				"status" : "success",
				"message" : "OTP sent successfully"
			}, 200

		except:
			return {
				"status" : "error",
				"message" : "Error sending email"
			}, 500
		# update password in database

# code to login users
@authentication.route("/login/<string:role>", methods=["POST"])
def login(role):
	# check if user session exists
	if session.get("user"):
		return { 
			"status" : "success",
			"message" : "Already logged in" 
		}, 200 #OK
	
	# get user from database from the email provided
	email = request.form.get("email")
	if role == "student" :
		dbOperations = database.studentOperations
	elif role == "admin" :
		dbOperations = database.adminOperations
	else :
		return {
			"status" : "error",
			"message" : "No such access available"
		}, 400 # Bad request

	_user = dbOperations.get_user(email)

	# check if user exists
	if _user:
		# check if password is correct
		if role == "admin":
			user = Admin(**dbOperations.get_user(email))
			session["user"] = user.dict()
			session["user"]["role"] = role
			session.modified = True

			# if cache contains email, remove the entry from cache
			if cache.get(email):
				cache.pop(email)
    
			return {
				"status" : "success",
				"message" : "Logged in Successfully",
			}, 200 #OK

		if sha256.verify(request.form.get("password"), _user["password"]):
			user = Student(**dbOperations.get_user(email))
			session["user"] = user.dict()
			session["user"]["role"] = role
			session.modified = True
			# stud = Student(**database.studentOperations.get_user(email))
			# session["user"] = stud.dict()
			# session["user"]["role"] = "student"

			# if cache contains email, remove the entry from cache
			if cache.get(email):
				cache.pop(email)
				
			return {
				"status" : "success",
				"message" : "Logged in Successfully",
			}, 200 #OK
		else:
			return {
				"status" : "error",
				"message" : "Incorrect password"
			}, 401 #UnAuthorized
	
	# user does not exist
	# !!! redirect to signup page
	return {
		"status" : "error",
		"message" : "User does not exist"
	}, 404 #NotFound

# code to logout user
@authentication.route("/logout/", methods=["GET"])
@login_required(["admin","student"])
def logout():
	# check if user session exists
	if session.get("user"):
		session.pop("user")
		return { 
			"status" : "success",
			"message" : "Logged out successfully" 
		}, 200 #OK

	# !!! redirect to login page
	return {  # code flow must not reach here, since @login_required() checks whether session has "user"
		"status" : "error",
		"message" : "Already Logged Out" 
	}, 500 #server error