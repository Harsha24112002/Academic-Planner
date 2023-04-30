import pytest
from pytest import MonkeyPatch
import authentication
from app import app
from unittest.mock import patch, MagicMock
import io

# create a mock student object that will be returned by the mock_student_operations fixture
def return_mock_user():
	mock_user = {
		"first_name": "John",
		"last_name": "Doe",
		"username": "jdoe",
		"password": "$pbkdf2-sha256$29000$NiakFALAuBfCWAsBwLh3jg$ZGIT0Mooj0rgL3IXTXc82pvIezGAldHXPDQFQFmDOQ0",
		"email": "jdoe@example.com",
		"photo_url": "https://example.com/jdoe.jpg",
		"id": "123456",
		"role": "student",
		"department": "Computer Science",
		"cgpa": 3.5,
		"course_list": [
			{
				"course_id": "CS101",
				"course_grade": "A",
				"course_status": "InCompleted",
				"registered_sem": 1,
				"elective": 'Some value',
				"met_prerequisite_flag": True,
				"note": {'note': 'Some value'},
				"incomplete_prerequisites": []
			},
			{
				"course_id": "CS201",
				"course_grade": "B",
				"course_status": "Incomplete",
				"registered_sem": 2,
				"elective": "Elective1",
				"met_prerequisite_flag": False,
				"note": {'note': 'Some value'},
				"incomplete_prerequisites": [
					"CS101"
				]
			}
		]
	}

	return mock_user	

# basic test route
def test_home_route():
    response = app.test_client().get('/')
    assert response.status_code == 200
    assert response.json == {'status': 200, 'message': 'Welcome to the backend of Academic Planner'}

# tests to test Login route
class TestLoginRoute():
	# test login route with valid credentials
	def test_login_route_valid_credentials(self, mocker):     
		_mock_user = mocker.patch('db_connection.database.studentOperations.get_user', return_value = return_mock_user())
		_mock_verification = mocker.patch('authentication.sha256.verify', return_value=True)
		response = app.test_client().post('/authentication/login/student', json={'email': 'jdoe@example.com', 'password': '123456'})
		assert response.status_code == 200
		assert response.json == {'status': 'success', 'message': 'Logged in Successfully'}

	# test login route with invalid credentials
	def test_login_route_invalid_credentials(self, mocker):
		_mock_user = mocker.patch('db_connection.database.studentOperations.get_user', return_value = return_mock_user())
		_mock_verification = mocker.patch('authentication.sha256.verify', return_value=False)
		response = app.test_client().post('/authentication/login/student', json={'email': 'jdoe@example.com', 'password': '123456'})
		assert response.status_code == 401
		assert response.json == {
					"status" : "error",
					"message" : "Incorrect password"
				}

	# test for invalid user
	def test_login_route_invalid_user(self, mocker):
		_mock_user = mocker.patch('db_connection.database.studentOperations.get_user', return_value = None)
		_mock_verification = mocker.patch('authentication.sha256.verify', return_value=False)
		response = app.test_client().post('/authentication/login/student', json={'email': 'jdoe@example.com', 'password': '123456'})

		assert response.status_code == 404
		assert response.json == {
			"status" : "error",
			"message" : "User does not exist"
		}

	# test for user with invalid role
	def test_login_route_invalid_role(self, mocker):
		_mock_user = mocker.patch('db_connection.database.studentOperations.get_user', return_value = return_mock_user())
		response = app.test_client().post('/authentication/login/invalidrole', json={'email': 'jdoe@example.com', 'password': '123456'})

		assert response.status_code == 400
		assert response.json == {
			"status" : "error",
			"message" : "No such access available"
		}

class TestResetPassword():

	# test for invalid email
	def test_reset_password_invalid_user(self, mocker):
		_mock_email = mocker.patch('authentication.database.studentOperations.check_email', return_value=None)
		response = app.test_client().post('/authentication/student/forgot_password', json={'email' : ''})

		assert response.status_code == 400
		assert response.json == {
			"status" : "error",
			"message" : "Email does not exist"
		}

	# test for valid mail
	def test_reset_password_valid_user(self, mocker):
		_mock_email = mocker.patch('authentication.database.studentOperations.check_email', return_value=True)
		_mock_send_email = mocker.patch('authentication.send_email', return_value=True)

		response = app.test_client().post('/authentication/student/forgot_password', json={'email' : 'johndoe@example.com'})

		assert response.status_code == 200
		assert response.json == {
			"status" : "success",
			"message" : "OTP sent successfully"		
		}

	# test for mailing exception
	def test_reset_password_mail_exception(self, mocker):
		_mock_email = mocker.patch('authentication.database.studentOperations.check_email', return_value=True)
		mock_function = MagicMock(side_effect=Exception("Something went wrong!"))
		_mock_send_email = mocker.patch('authentication.send_email', side_effect=mock_function)
		response = app.test_client().post('/authentication/student/forgot_password', json={'email' : 'johndoe@example.com'})
		assert response.status_code == 500
		assert response.json == {
				"status" : "error",
				"message" : "Error sending email"
			}

class TestGetNewDetails():

	# test for wrong otp
	def test_get_new_details_wrong_otp(self, mocker):
		_mock_otp = mocker.patch('authentication.cache', return_value={'email':'fakeemail@email'})
		response = app.test_client().post('/authentication/student/forgot_password/new_details')

		assert response.status_code == 400
		assert response.json == {
			"status" : "error",
			"message" : "Incorrect OTP"
		}

	# test for valid updating password
	def test_get_new_details_valid_updating_password(self, mocker):
		_mock_otp = mocker.patch.dict('authentication.cache', {'johndoe@example.com': 'otp'})
		_mock_user = mocker.patch('authentication.database.studentOperations.get_user', return_value={"password": "old_password"})
		_mock_update = mocker.patch('authentication.database.studentOperations.update', return_value=None)
		response = app.test_client().post('/authentication/student/forgot_password/new_details',
										data={'email': 'johndoe@example.com', 'otp': 'otp', 'password': '1234'})
		assert response.status_code == 200
		assert response.json == {
			"status": "success",
			"message": "Password updated successfully"
		}

	# test for exception while updating password
	def test_get_new_details_invalid_updating_password(self, mocker):
		mocker.patch.dict('authentication.cache', {'johndoe@example.com': 'otp'})
		mocker.patch('authentication.database.studentOperations.get_user', return_value={"password": "old_password"})
		mock_function = MagicMock(side_effect=Exception("Something went wrong!"))
		mocker.patch('authentication.database.studentOperations.update', side_effect=mock_function)

		response = app.test_client().post('/authentication/student/forgot_password/new_details',
										data={'email': 'johndoe@example.com', 'otp': 'otp', 'password': '1234'})

		assert response.status_code == 500
		assert response.json == {
			"status" : "error",
			"message" : "An unexpected error occurred! Please try again later. Report if this occurs continously"
		}

class TestSignup:
    # test for signingup with already existing mail
    def test_signup_with_existing_email(self, mocker):
        mocker.patch('authentication.database.studentOperations.check_email', return_value=True)
        response = app.test_client().post('/authentication/signup/student', data={
            'email': 'johndoe@example.com',
            'username': 'johndoe',
            'password': 'password'
        })
        assert response.status_code == 400
        assert response.json == {
            "status" : "error",
            "message" : "Email already exists"
        }

	# test for signingup with already existing username
    def test_signup_with_existing_username(self, mocker):
        _mock_email = mocker.patch('authentication.database.studentOperations.check_email', return_value=False)
        _mock_user = mocker.patch('authentication.database.studentOperations.check_username', return_value=True)
        response = app.test_client().post('/authentication/signup/student', data={
            'email': 'johndoe@example.com',
            'username': 'johndoe',
            'password': 'password'
        })
        assert response.status_code == 409
        assert response.json == {
            "status" : "error",
            "message" : "Username already exists"
        }
	
	# test for signup with valid details
    def test_signup_with_valid_details(self, mocker):
        _mock_email = mocker.patch('authentication.database.studentOperations.check_email', return_value=False)
        _mock_user = mocker.patch('authentication.database.studentOperations.check_username', return_value=False)
        _mock_add_user = mocker.patch('authentication.database.studentOperations.add_user', return_value=None)
        _mock_hash = mocker.patch('authentication.sha256.hash', return_value='hashed_password')
        # mocker.patch.object(fs, 'put', return_value='photo_url')
        mock_file = MagicMock()
        mock_file.filename = 'test.jpg'
        mock_file.read.return_value = b'test'

        data = {
			'name': 'John Doe',
			'username': 'johndoe',
			'email': 'johndoe@example.com',
			'department': 'Computer Science',
			'password': 'password'
		}

        response = app.test_client().post('/authentication/signup/student', data=data, content_type='multipart/form-data')

        assert response.status_code == 200
        assert response.json == {
			"status" : "success",
			"message" : "User Added successfully"
		}
	
	# test for signup with invalid details
    def test_signup_with_invalid_details(self, mocker):
        mocker.patch('authentication.database.studentOperations.check_email', return_value=False)
        mocker.patch('authentication.database.studentOperations.check_username', return_value=False)
        mocker.patch('authentication.database.studentOperations.add_user', side_effect=Exception("Something went wrong!"))
        mocker.patch('authentication.sha256.hash', return_value='hashed_password')

        response = app.test_client().post('/authentication/signup/student', data={
            'email': 'johndoe@example.com',
            'username': 'johndoe',
            'password': 'password'
        }, content_type='multipart/form-data')
        assert response.status_code == 500
        assert response.json == {
            "status" : "error",
            "message" : "Unexpected error occured while reading contents of response. Please insert proper data"
        }

class TestLogOut():
	# for wrapper
	@pytest.fixture
	def client(self):
		app.config['TESTING'] = True
		with app.test_client() as client:
			with app.app_context():
				yield client

	# test for successful logout
	def test_logout_success(self, client):
		with client.session_transaction() as session:
			session['user'] = {"username": "test_user", "role": "student"}
		response = client.get("/authentication/logout/")
		assert response.status_code == 200
		assert response.json == {"status": "success", "message": "Logged out successfully"}

	# test for logout with no user
	def test_logout_no_user(self, client):
		response = client.get("/authentication/logout/")
		assert response.status_code == 401
		assert response.json == {"status": "error", "message": "redirect to Home Page, Login to Access"}

	# test for logout with no role
	def test_logout_no_role(self, client):
		with client.session_transaction() as session:
			session['user'] = {"username": "test_user"}
		response = client.get("/authentication/logout/")
		assert response.status_code == 500
		assert response.json == {"status": "error", "message": "An unexpected error occurred! Please try again later. Report if this occurs continously"}

# class TestLogOut():
# 	def test_logout_with_valid_session(self, mocker):
# 		with app.test_client() as client:
# 			with client.session_transaction() as session:
# 				session['user'] = {'username': 'johndoe', 'type': 'student'}
# 			response = client.get('/authentication/logout/')
# 			assert response.status_code == 200
# 			assert response.json == {
# 				"status": "success",
# 				"message": "Logged out successfully"
# 			}
# 			with client.session_transaction() as session:
# 				assert 'user' not in session

# 	def test_logout_without_session(self, mocker):
# 		with app.test_client() as client:
# 			response = client.get('/authentication/logout/')
# 			assert response.status_code == 500
# 			assert response.json == {
# 				"status": "error",
# 				"message": "Already Logged Out"
# 			}

class TestGetDetails():
	@pytest.fixture
	def client(self):
		app.config['TESTING'] = True
		with app.test_client() as client:
			with app.app_context():
				yield client
	
	# test for getting details when not logged in
	def test_get_details_not_logged_in(self, client, mocker):
		_mock_user = mocker.patch('db_connection.database.studentOperations.get_user', return_value=return_mock_user())
		response = client.get("/authentication/get_details/student")
		assert response.status_code == 401
		assert response.json == {
			"status" : "error",
			"message": "redirect to Home Page, Login to Access",
		}

	def test_get_details_get_user_not_logged_in(self, client):
		response = client.get("/authentication/get_details/student")
		assert response.status_code == 401
		assert response.json == {
			"status" : "error",
			"message": "redirect to Home Page, Login to Access",
		}