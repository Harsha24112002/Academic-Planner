from flask import Flask, Blueprint
import authentication
import admin
from maps.maps import maps
from flask_cors import CORS
from flask_session import Session
from flask_mail import Mail, Message
from config import configurations
app = Flask(__name__)
app.secret_key = "random-secret-key"
CORS(app,supports_credentials=True)

# The url's whose prefix starts with authentication, goes to this authentication.py
app.register_blueprint(authentication.authentication)
app.register_blueprint(maps)
app.register_blueprint(admin.admin)

app.config['MAIL_SERVER'] = configurations["mail"]["MAIL_SERVER"]
app.config['MAIL_PORT'] = configurations["mail"]["MAIL_PORT"]
app.config['MAIL_USE_TLS'] = configurations['mail']['MAIL_USE_TLS']
app.config['MAIL_USE_SSL'] = configurations['mail']['MAIL_USE_SSL']
app.config['MAIL_USERNAME'] = configurations['mail']['MAIL_USERNAME']
app.config['MAIL_PASSWORD'] = configurations['mail']['MAIL_PASSWORD']
app.config['MAIL_DEFAULT_SENDER'] =  configurations['mail']['MAIL_DEFAULT_SENDER']

# Configure session to use filesystem
app.config['SESSION_TYPE'] = configurations["session"]["SESSION_TYPE"]

# Configure the session to use cookies
app.config['SESSION_COOKIE_NAME'] = configurations["session"]['SESSION_COOKIE_NAME']
app.config['SESSION_COOKIE_SECURE'] = configurations["session"]["SESSION_COOKIE_SECURE"]  # ensure the cookie is sent over HTTPS only
app.config['SESSION_COOKIE_HTTPONLY'] = configurations["session"]["SESSION_COOKIE_HTTPONLY"]
app.config['SESSION_COOKIE_SAMESITE'] = configurations["session"]['SESSION_COOKIE_SAMESITE'] # allow cross-site requests

mail = Mail(app)
Session(app)

# test route
@app.route('/')
def home():
	# test response
	return {'status': 200, 'message': 'Welcome to the backend of Academic Planner'}


if __name__ == '__main__':
	app.run(debug=True)