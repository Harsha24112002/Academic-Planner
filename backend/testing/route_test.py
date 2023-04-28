from app import app

def test_home_route():
    response = app.test_client().get('/')
    print(response)
    assert response.status_code == 200
    assert response.json == {'status': 200, 'message': 'Welcome to the backend of Academic Planner'}