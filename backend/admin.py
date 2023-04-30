from flask import request, session, Blueprint
import gridfs
from db_connection import database
from Models.models import Course, SpecializationPath
from Models.models import StudentCourseSpecification
from pydantic import ValidationError
import pandas as pd
from authentication import login_required

admin = Blueprint("admin",__name__, url_prefix="/admin/")

path_fs = gridfs.GridFS(database.cluster, collection="path_collection_pictures")

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
@login_required(["admin"])
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
@login_required(["admin"])
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
    return {"success":True}
   
@admin.route("/uploadfile/", methods=["POST"])
@login_required(["admin"])
def readFile():
    # !!! appropiate error handling while returning
    file = request.files['file']
    course_details = pd.read_excel(file)
    course_details.swapaxes("index", "columns")

    failed_additions = []

    for i in range(len(course_details)):
        frame = course_details.iloc[i]
        pre_req=[]

        if isinstance(frame['course_prerequisites'], str):
            pre_req = frame['course_prerequisites'].split(',')

        try:
            course = Course(course_name=frame['course_name'], course_id=frame['course_id'], course_instructor=frame['course_instructor'], course_slot=str(frame['course_slot']), course_sem=str(frame['course_sem']), core_elective=frame['core_elective'], course_prerequisites = pre_req, course_credits=frame['course_credits'])
            database.courseOperations.add_course(course.dict())
        except:
            failed_additions.append(i+1)

    # !!! Add good returns, send failed additions to frontend
    return {"success":True, "failed_additions":failed_additions}

### Add Path to DataBase by ADMIN
@admin.route("/addpath",methods=["POST"])
@login_required(["admin"])
def addPath():
    # if session.get("user") is None:
    #     return "Not logged in"
    # if session["user"]["type"] == "student":
    #     return "Permission denied for student"
    req = request.form
    file = request.files["photo"]
    file_name = req["name"]
    file_contents = file.read()
    path_url = path_fs.put(file_contents, _id = file_name)
    req = {}
    req["name"] = file_name
    req["path_url"] = path_url

    try:
        new_course = SpecializationPath(**req)
    except ValidationError as e:
        return {'success': False, 'errors':e.errors()}
    ### !!! Add good returns 
    response = database.pathOperations.add_path(new_course.dict())
    return {"success": True}

### Update Path by ID in DataBase by ADMIN
@admin.route("/updatepath/<string:name>",methods=["PUT"])
@login_required(["admin"])
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
@login_required(["admin"])
def deletePath(name):
    if session.get("user") is None:
        return "Not logged in"
    if session["user"]["type"] == "student":
        return "Permission denied for student"
    resp = database.pathOperations.remove_path(name)
    return resp
