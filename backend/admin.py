from flask import request, session, Blueprint

from db_connection import database
from Models.models import Course, SpecializationPath
from Models.models import StudentCourseSpecification

admin = Blueprint("admin",__name__, url_prefix="/admin/")

###
"""
    Add Course(s)
    Update Course(s)
    Delete Course(s)

    Add Path(s)
    Update Paths(s)
    Delete Paths(s)
"""
###


### Add Course to DataBase by ADMIN
@admin.route("/addcourse",methods=["POST"])
def addCourse():
    req = request.json
    new_course = Course(**req)
    ### !!! Add good returns 
    resp = database.adminOperations.add_course(new_course.dict())
    return resp

### Update Course by ID in DataBase by ADMIN
@admin.route("/updatecourse/<string:id>",methods=["PUT"])
def updateCourse(course_id):
    req = request.json
    course = Course(**database.adminOperations.get_course_by_id(course_id))
    course.updateCourse(req)
    resp = database.adminOperations.update_course(course.course_id)
    return resp

### Add Path to DataBase by ADMIN
@admin.route("/addpath",methods=["POST"])
def addPath():
    req = request.json
    new_course = SpecializationPath(**req)
    ### !!! Add good returns 
    resp = database.adminOperations.add_path(new_course.dict())
    return resp

### Update Path by ID in DataBase by ADMIN
@admin.route("/updatepath/<string:name>",methods=["PUT"])
def updatePath(name):
    req = request.json
    ### !!! Assumed path name can also be changed
    old_path_dict = database.adminOperations.get_path_by_name(name)
    path = SpecializationPath(**old_path_dict)
    path.update_paths(**req)
    resp = database.adminOperations.update_path(name,path.dict())
    return resp

### Delete Path by ID in DataBase by ADMIN
@admin.route("/deletepath/<string:name>",methods=["DELETE"])
def deletePath(name):
    resp = database.adminOperations.remove_path(name)
    return resp