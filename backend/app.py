from flask import Flask, Blueprint
import authentication
import maps

app = Flask(__name__)
app.secret_key = "secret-key"

# adding blueprints

# The url's whose prefix starts with authentication, goes to this authentication.py
app.register_blueprint(authentication.authentication)
app.register_blueprint(maps.maps)

if __name__ == '__main__':
	app.run(debug=True)