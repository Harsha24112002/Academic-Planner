import pytest
from pytest import MonkeyPatch
from maps.maps import maps
from app import app
from unittest.mock import patch, MagicMock
import io
from conftest import return_mock_course_list, mock_user_session

class TestCourseRegistration():

    @pytest.fixture
    def client(self):
        app.config['TESTING'] = True
        with app.test_client() as client:
            with app.app_context():
                with client.session_transaction() as session:
                    session['user'] = mock_user_session()
                yield client

    def test_course_registration_with_all_prerequisites_met(self, client, mocker):

        # mocker.patch('db_connection.database.__init__')
        mocker.patch('maps.maps.database.courseOperations.get_prerequisites_of_course', return_value=[])
        mocker.patch('maps.maps.database.studentOperations.add_course', return_value="Success")
        mocker.patch('maps.maps.database.studentOperations.update_course_list', return_value="Success")

        response = client.post('maps/register/CS102', json = {"registered_sem":1})

        assert response.status_code == 200
        assert response.json == {"success":True, "msg":"Course CS102 is successfully registered", "data":[]}
        pass

    def test_course_registration_without_prerequisites(self, client, mocker):

        mocker.patch('maps.maps.database.courseOperations.get_prerequisites_of_course', return_value=["CS201","CS202"])
        mocker.patch('maps.maps.database.studentOperations.add_course', return_value="Success")
        mocker.patch('maps.maps.database.studentOperations.update_course_list', return_value="Success")

        response = client.post('maps/register/CS301', json = {"registered_sem":2})
        assert response.status_code == 200
        assert response.json == {"success":True,"msg":"Prerequisites are not met" ,"data": ["CS201","CS202"]}
        pass

    def test_already_registered_course_registration(self, client,  mocker):

        mocker.patch('maps.maps.database.courseOperations.get_prerequisites_of_course', return_value=[])
        mocker.patch('maps.maps.database.studentOperations.add_course', return_value="Success")
        mocker.patch('maps.maps.database.studentOperations.update_course_list', return_value="Success")
        
        response = client.post('maps/register/CS101', json = {"registered_sem":1})

        assert response.status_code == 400
        assert response.json == {"success":False, "msg": f"The Course CS101 is already registered"}

    # Trying to register without getting complete course specifications {course_id, registered_sem, ...}
    def test_course_registration_details_validation(self, client, mocker):
        mocker.patch('maps.maps.database.courseOperations.get_prerequisites_of_course', return_value=[])
        mocker.patch('maps.maps.database.studentOperations.add_course', return_value="Success")
        mocker.patch('maps.maps.database.studentOperations.update_course_list', return_value="Success")
        
        response = client.post('maps/register/CS101')

        assert response.status_code == 400

    def test_unknown_course_registration(self, client, mocker):
        mocker.patch('maps.maps.database.courseOperations.get_prerequisites_of_course', return_value=None)
        mocker.patch('maps.maps.database.studentOperations.add_course', return_value="Success")
        mocker.patch('maps.maps.database.studentOperations.update_course_list', return_value="Success")

        response = client.post('maps/register/CS701', json = {"registered_sem":3})
        assert response.status_code == 400
        assert response.json == {"success": False,"msg": "The Course CS701 is not available"}
        pass

    
class TestCourseDeregistration():

    @pytest.fixture
    def client(self):
        app.config['TESTING'] = True
        with app.test_client() as client:
            with app.app_context():
                yield client

    # Trying to de-register a course that is not registered
    def test_not_registered_course_deregistration(self, client, mocker):
        with client.session_transaction() as session:
            session['user'] = mock_user_session()
        mocker.patch('maps.maps.database.studentOperations.delete_course',return_value="Success")
        mocker.patch('maps.maps.database.courseOperations.get_multiple_courses_prerequisites',return_value=[])
        mocker.patch('maps.maps.database.studentOperations.update_course_list',return_value="Success")

        response = client.delete('maps/deregister/CS302')
        assert response.status_code == 400
        assert response.json == {
            "status" : "error",
            "message" : "The Course CS302 is not registered to deregister!"
        }

    def test_deregistration(self, client, mocker):
        with client.session_transaction() as session:
            session['user'] = mock_user_session()

        response = client.delete('maps/deregister/CS101')
        assert response.status_code == 200
        assert response.json == {
            "status" : "success",
            "message" : "Successfully Deregistered",
        }

    # de-registering a course that is prerequisite to one or more other courses
    def test_prerequisite_course_deresgistration(self, client, mocker):
        with client.session_transaction() as session:
            session['user'] = mock_user_session()
            session['user']['course_list'].append({
                "course_id" : "CS201",
                "course_grade" : "A",
                "course_status" : "completed",
                "registered_sem" : 1,
                "elective" : "Departmental Core Theory",
                "met_prerequisite_flag" : True,
                "note" : { "note" : "Some note"},
                "incomplete_prerequisites" : []
            })

        mocker.patch('maps.maps.database.studentOperations.delete_course',return_value="Success")
        mocker.patch('maps.maps.database.courseOperations.get_multiple_courses_prerequisites',return_value={"CS201":["CS101"]})
        mocker.patch('maps.maps.database.studentOperations.update_course_list',return_value="Success")

        
        response = client.delete('maps/deregister/CS101')
        assert response.status_code == 200
        assert response.json == {
            "status" : "success",
            "message" : "Successfully Deregistered",
        }

    
        

class TestCourseUpdation():

    @pytest.fixture
    def client(self):
        app.config['TESTING'] = True
        with app.test_client() as client:
            with app.app_context():
                with client.session_transaction() as session:
                    session['user'] = mock_user_session()
                yield client

    # Trying to Update course status that is not registered
    def test_not_registered_course_updation(self, client, mocker):

        mocker.patch('maps.maps.database.courseOperations.get_prerequisites_of_course',return_value=[])
        mocker.patch('maps.maps.database.studentOperations.update_course_status',return_value="Success")

        response = client.post('maps/update_course_status/CS801')
        assert response.status_code == 400
        assert response.json == {
            "status" : "error",
            "message" : "The Course CS801 is not registered to update it's status"
        }
    
    # grade is considered as a required to field to be provided 
    # to update any course status as completed
    def test_grade_validation_with_course_updation(self, client, mocker):

        mocker.patch('maps.maps.database.courseOperations.get_prerequisites_of_course',return_value=[])
        mocker.patch('maps.maps.database.studentOperations.update_course_status',return_value="Success")

        response = client.post('maps/update_course_status/CS101',json={"course_status":"completed", "grade": None})
        assert response.status_code == 400
        assert response.json == {
                "status" : "error",
                "message" : "Cant mark as completed without a grade"
            }

    # Trying to update course status to "completed" without completing the prerequisites
    def test_course_updation_with_prerequisites_not_met(self, client, mocker):
        with client.session_transaction() as session:
                session['user'] = mock_user_session()
                session['user']['course_list'][0]['course_status'] = "Incomplete"
                session['user']['course_list'].append({
                    "course_id" : "CS201",
                    "course_grade" : "A",
                    "course_status" : "Incomplete",
                    "registered_sem" : 1,
                    "elective" : "Departmental Core Theory",
                    "met_prerequisite_flag" : False,
                    "note" : { "note" : "Some note"},
                    "incomplete_prerequisites" : ["CS101"]
                })

        mocker.patch('maps.maps.database.courseOperations.get_prerequisites_of_course',return_value=["CS101"])
        mocker.patch('maps.maps.database.studentOperations.update_course_status',return_value="Success")

        response = client.post('maps/update_course_status/CS201',json={"course_status":"completed", "grade": "B"})
        assert response.status_code == 400
        assert response.json == {
            "status" : "error",
            "message" : "Prerequisites Not Registered"
        }

    def test_course_updation_with_valid_updates(self, client, mocker):
        with client.session_transaction() as session:
                session['user'] = mock_user_session()
                session['user']['course_list'][0]['course_status'] = "Incomplete"
                

        mocker.patch('maps.maps.database.courseOperations.get_prerequisites_of_course',return_value=[])
        mocker.patch('maps.maps.database.studentOperations.update_course_status',return_value="Success")

        response = client.post('maps/update_course_status/CS101',json={"course_status":"completed", "grade": "A-"})
        assert response.status_code == 200
        assert response.json == {
            "status" : "success",
            "message" : "Course status updated successfully"
        }



## student -- register, deregister, update,
#            get_registered_courses, get_courses
## course -- 
#     get_course_details
#     get_multiple_courses
## Admin -- add, update, delete 