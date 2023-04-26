from flask import Flask, Blueprint
import authentication
import admin
from maps.maps import maps
from flask_cors import CORS
from flask_session import Session
from flask_mail import Mail, Message

app = Flask(__name__)
app.secret_key = "secret-key"
CORS(app,supports_credentials=True)

# Configure session to use filesystem
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

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

mail = Mail(app)

if __name__ == '__main__':
	app.run(debug=True)