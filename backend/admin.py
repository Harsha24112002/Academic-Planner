from flask import request, session, Blueprint

from db_connection import database
from Models.models import Course, SpecializationPath
from Models.models import StudentCourseSpecification
from pydantic import ValidationError

admin = Blueprint("admin",__name__, url_prefix="/admin/")

### ! Should add some type attribute in User class to differentiate student and admin
### and every endpoint in this file should check for type == admin in session object

###
"""
    #Added
    Add Course(s)
    Update Course(s)

    ## Dont know whether to delete from database or just set some alive flag to false in course
    Delete Course(s) 

    Add Path(s)
    Update Paths(s)
    Delete Paths(s)
"""
###


### Add Course to DataBase by ADMIN
@admin.route("/addcourse",methods=["POST"])
def addCourse():
    # if session.get("user") is None:
    #     return "Not logged in"
    # if session["user"]["type"] == "student":
    #     return "Permission denied for student"
    req = request.json
    print(req)
    try:
        new_course = Course(**req)
    except ValidationError as e:
        return {'success': False, 'errors': e.errors()}

    ### !!! Add good returns 
    response = database.courseOperations.add_course(new_course.dict())
    return {"success": True}

### Update Course by ID in DataBase by ADMIN
# !!! Assumed Course ID cannot be updated, should confirm with others
@admin.route("/updatecourse/<string:id>",methods=["PUT"])
def updateCourse(id):
    # if session.get("user") is None:
    #     return "Not logged in"
    # if session["user"]["type"] == "student":
    #     return "Permission denied for student"
    req = request.json
    coursedb = database.courseOperations.get_course_by_id(id)
    course = Course(**coursedb)
    course.updateCourse(**req)
    response = database.courseOperations.update_course(course.dict())
    return {"success":"true"}
   

### Add Path to DataBase by ADMIN
@admin.route("/addpath",methods=["POST"])
def addPath():
    # if session.get("user") is None:
    #     return "Not logged in"
    # if session["user"]["type"] == "student":
    #     return "Permission denied for student"
    req = request.json
    try:
        new_course = SpecializationPath(**req)
    except ValidationError as e:
        return {'success': False, 'errors':e.errors()}
    ### !!! Add good returns 
    response = database.pathOperations.add_path(new_course.dict())
    return {"success": True}

### Update Path by ID in DataBase by ADMIN
@admin.route("/updatepath/<string:name>",methods=["PUT"])
def updatePath(name):
    if session.get("user") is None:
        return "Not logged in"
    if session["user"]["type"] == "student":
        return "Permission denied for student"
    req = request.json
    ### !!! Assumed path name can also be changed
    old_path_dict = database.pathOperations.get_path_by_name(name)
    path = SpecializationPath(**old_path_dict)
    path.update_paths(**req)
    resp = database.pathOperations.update_path(name,path.dict())
    return resp

### Delete Path by ID in DataBase by ADMIN
@admin.route("/deletepath/<string:name>",methods=["DELETE"])
def deletePath(name):
    if session.get("user") is None:
        return "Not logged in"
    if session["user"]["type"] == "student":
        return "Permission denied for student"
    resp = database.pathOperations.remove_path(name)
    return resp
