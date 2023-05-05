configurations = {
    'database' : {
        'host' : "notlocalhost",
        'username' : None ,
        'password' : None ,
        'dbname' : 'testingDB' ,
        'pictures' : 'student_profile_pictures',
        'student_collection' : 'Students',
        'course_collection' : 'Courses',
        'path_collection' : 'SpPaths',
        'admin_collection' : 'Admin',
        'domain_name' : 'iith.ac.in',
    },
    'mail' : {
        'MAIL_SERVER' : 'smtp.gmail.com',
        'MAIL_PORT' : 465,
        'MAIL_USE_TLS': False,
        'MAIL_USE_SSL' : True,
        'MAIL_USERNAME' : None,
        'MAIL_PASSWORD' : None,
        'MAIL_DEFAULT_SENDER': None
    },
    'session': {
        'SESSION_TYPE': 'filesystem',
        'SESSION_COOKIE_NAME': 'session',
         'SESSION_COOKIE_SECURE': True,
         'SESSION_COOKIE_HTTPONLY': True,
         'SESSION_COOKIE_SAMESITE': 'None'

    }
}

