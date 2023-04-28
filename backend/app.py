from flask import Flask, Blueprint
import authentication
import admin
from maps.maps import maps
from flask_cors import CORS
from flask_session import Session
from flask_mail import Mail, Message

app = Flask(__name__)
app.secret_key = "random-secret-key"
CORS(app,supports_credentials=True)

# The url's whose prefix starts with authentication, goes to this authentication.py
app.register_blueprint(authentication.authentication)
app.register_blueprint(maps)
app.register_blueprint(admin.admin)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'panthergolden68@gmail.com'
app.config['MAIL_PASSWORD'] = 'evyozlcqbxmpnvbg'
app.config['MAIL_DEFAULT_SENDER'] = 'panthergolden68@gmail.com'

# Configure session to use filesystem
app.config['SESSION_TYPE'] = 'filesystem'

# Configure the session to use cookies
app.config['SESSION_COOKIE_NAME'] = 'session'
app.config['SESSION_COOKIE_SECURE'] = True  # ensure the cookie is sent over HTTPS only
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # allow cross-site requests

mail = Mail(app)
Session(app)

# test route
@app.route('/')
def home():
	# test response
	return {'status': 200, 'message': 'Welcome to the backend of Academic Planner'}


if __name__ == '__main__':
	app.run(debug=True)