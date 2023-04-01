from flask import Flask, Blueprint
import authentication
import maps, admin

app = Flask(__name__)
app.secret_key = "secret-key"

# adding blueprints

# The url's whose prefix starts with authentication, goes to this authentication.py
app.register_blueprint(authentication.authentication)
app.register_blueprint(maps.maps)
app.register_blueprint(admin.admin)
if __name__ == '__main__':
	app.run(debug=True)