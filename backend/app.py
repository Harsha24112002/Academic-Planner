from flask import Flask, Blueprint
import authentication
import admin
from maps.maps import maps
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "secret-key"
CORS(app,supports_credentials=True)

# The url's whose prefix starts with authentication, goes to this authentication.py
app.register_blueprint(authentication.authentication)
app.register_blueprint(maps)
app.register_blueprint(admin.admin)

if __name__ == '__main__':
	app.run(debug=True)