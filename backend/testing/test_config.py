import config

def test_database_config():
    assert config.configurations['database']['host'] == 'notlocalhost'
    assert config.configurations['database']['username'] == 'cs19btech11015'
    assert config.configurations['database']['password'] == 'urnheinZYSQOAxLR'
    assert config.configurations['database']['dbname'] == 'testingDB'
    assert config.configurations['database']['pictures'] == 'student_profile_pictures'
    assert config.configurations['database']['student_collection'] == 'Students'
    assert config.configurations['database']['course_collection'] == 'Courses'
    assert config.configurations['database']['path_collection'] == 'SpPaths'
    assert config.configurations['database']['admin_collection'] == 'Admin'
    assert config.configurations['database']['domain_name'] == 'iith.ac.in'

def test_mail_config():
    assert config.configurations['mail']['MAIL_SERVER'] == 'smtp.gmail.com'
    assert config.configurations['mail']['MAIL_PORT'] == 465
    assert config.configurations['mail']['MAIL_USE_SSL'] == True
    assert config.configurations['mail']['MAIL_USERNAME'] == None
    assert config.configurations['mail']['MAIL_PASSWORD'] == None
