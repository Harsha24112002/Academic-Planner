from flask import Flask, Blueprint
import authentication
import admin
from werkzeug.utils import import_string
from maps.maps import maps

app = Flask(__name__)
app.secret_key = "secret-key"

# The url's whose prefix starts with authentication, goes to this authentication.py
app.register_blueprint(authentication.authentication)
app.register_blueprint(maps)
app.register_blueprint(admin.admin)
if __name__ == '__main__':
	app.run(debug=True)