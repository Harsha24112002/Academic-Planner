from flask import request, session, Blueprint
from db_connection import database
from Models.models import StudentCourseSpecification
import threading
from pydantic import ValidationError
from authentication import login_required
# from bson.json_utils import dumps

maps = Blueprint("maps",__name__, url_prefix="/maps/")

from .notes import *
from .paths import *

@maps.route("/get_course_details/<string:id>", methods=["GET","POST"])
@login_required(["student","admin"])
def get_course_details(id):
    # if session.get("user") is None:
    #     return "Not Logged In"

    details = database.courseOperations.get_course_details(id)
    # !!! Add Courses collection to DB
    # and return courses based on search filters
    # that will be given as args/forms/...
    details.pop('_id')
    # print(details)
        
    return details

@maps.route("/get_multiple_courses/",methods=["POST"])
@login_required(["student"])
def get_many_courses_details():
    # if session.get("user") is None:
    #     return "Not Logged In"
    courses_info = {}
    req = request.json
    for course in req["courses"]:
        details = database.courseOperations.get_course_details(course)
        details.pop('_id')
        courses_info[course] = details

    # !!! Add Courses collection to DB
    # and return courses based on search filters
    # that will be given as args/forms/...
        
    return courses_info

@maps.route("/register/<string:id>", methods=["POST","GET"])
@login_required(["student"])
def register(id):
    
    if session["user"]["course_list"] is None:
        session["user"]["course_list"] = []
    if any( course["course_id"] == id for course in session["user"]["course_list"]) :
        return {"success":False, "msg": f"The Course {id} is already registered"}, 400

    course_dict = request.json
    course_dict["course_id"] = id
    course_dict["course_status"] = "registered"
    prereq_list = database.courseOperations.get_prerequisites_of_course(id)
    if prereq_list == None :
        return {"success": False,"msg": "The Course " + id + " is not available"}, 400

    student_has_this_prereq = { course:False for course in prereq_list }
    student_registered_courses = session["user"]["course_list"]
    def is_prerequisite_completed(course_id):
        for course in student_registered_courses :
            if course["course_id"] == course_id and course["registered_sem"] < course_dict["registered_sem"]:
                student_has_this_prereq[course_id] = True
                break

    threads_list = []
    for course in prereq_list :
        thread = threading.Thread(target=is_prerequisite_completed, args=[course])
        thread.start()
        threads_list.append(thread)

    for thread in threads_list:
        thread.join()

    course_dict["met_prerequisite_flag"] = True
    for flag in student_has_this_prereq.values() :
        if not flag :
            course_dict["met_prerequisite_flag"] = False
            break
    try:
        registeringCourse =  StudentCourseSpecification(**course_dict)    
    except ValidationError as e:
        return {"success":False, "msg": e.errors()}, 400
    
    data = [course for course in student_has_this_prereq.keys() if student_has_this_prereq[course]==False]
    registeringCourse.incomplete_prerequisites = data
    response = database.studentOperations.add_course(session["user"]["email"], registeringCourse.dict())
    # !!! add a try cache block if DB operations fail
    # ==> add in the studentDBOperations class not here

    if response == "Success" :
        ### Check if this course is prerequisite to another 
        session["user"]["course_list"].append(registeringCourse.dict())
        
        ### 
        updated_courses = []
        for course in session["user"]["course_list"]:
            # print("Course: ",course)
            if registeringCourse.course_id in course["incomplete_prerequisites"] and course["registered_sem"] > registeringCourse.registered_sem:
                # print("Course: ",course)
                course["incomplete_prerequisites"].remove(registeringCourse.course_id)
                
                if len(course["incomplete_prerequisites"])==0:
                    course["met_prerequisite_flag"] = True

                updated_courses.append([course["course_id"],course["incomplete_prerequisites"],course["met_prerequisite_flag"]])
                
        database.studentOperations.update_course_list(session["user"]["email"],updated_courses)

        session.modified = True

        # when all the prerequisites are not met, a dict of prerequisite courses showing course-completion boolean is sent
        if course_dict["met_prerequisite_flag"] == False :
            return {"success":True,"msg":"Prerequisites are not met" ,"data":data}, 200

        # return message when the course is registered with all its prerequisites fulfilled
        return {"success":True, "msg":"Course " + str(id) + " is successfully registered", "data":[]}, 200

    return response

@maps.route("/deregister/<string:id>", methods=["DELETE"])
@login_required(["student"])
def deregister(id):
    if not any( course["course_id"] == id for course in session["user"]["course_list"]) :
        return {
            "status" : "error",
            "message" : "The Course " + id + " is not registered to deregister!"
        }, 400

    response = database.studentOperations.delete_course(session["user"]["id"], id)

    if response == "Success" :
        session["user"]["course_list"].remove(next(course for course in session["user"]["course_list"] if course["course_id"] == id))
        course_ids = [course["course_id"] for course in session["user"]["course_list"]]
        courses = database.courseOperations.get_multiple_courses_prerequisites(course_ids=course_ids)
        # print(courses)
        updated_courses = []
        for course in session["user"]["course_list"]:
            if id in courses[course["course_id"]]:
                course["met_prerequisite_flag"] = False
                course["incomplete_prerequisites"].append(id)
                updated_courses.append([course["course_id"],course["incomplete_prerequisites"],course["met_prerequisite_flag"]])
    
        database.studentOperations.update_course_list(session["user"]["email"],updated_courses)
        session.modified = True

        return {
            "status" : "success",
            "message" : "Successfully Deregistered",
        }, 200 #OK
        
    # !!! Return proper? error messages or Internal Server Error
    return response, 500

# !!! Not-completed Don't use this route
@maps.route("/update_course_status/<string:course_id>", methods=["POST"])
@login_required(["student"])
def update_course_status(course_id):

    #  if the course is not in the student's course list, return error message
    present_course = None
    for course in session["user"]["course_list"]:
        if course["course_id"] == course_id:
            present_course = course
            break
    print(course_id)
    
    if present_course == None :
        return {
            "status" : "error",
            "message" : "The Course " + course_id + " is not registered to update it's status"
        }, 400 # Bad request
        
    
    #  if the course is in the student's course list, update the course status
    req =request.json
    status = req["course_status"]
    grade = req["grade"]
    course_idx = [i for i,course in enumerate(session["user"]["course_list"]) if course["course_id"] == course_id][0]
    # if status is "completed", check for GPA score
    if status == "completed" :
        if grade is None :
            return {
                "status" : "error",
                "message" : "Cant mark as completed without a grade"
            }, 400
        if not len(session["user"]["course_list"][course_idx]["incomplete_prerequisites"]) == 0:
            return {
                "status" : "error",
                "message" : "Prerequisites Not Registered"
            }, 400
        prereqs = database.courseOperations.get_prerequisites_of_course(course_id)
        for course in prereqs:
            index = [i for i,c in enumerate(session["user"]["course_list"]) if c["course_id"] == course]
            if not len(index):
                continue
            index = index[0]
            if not session["user"]["course_list"][index]["course_status"] == "completed":
                return {
                    "status" : "error",
                    "message" : f"Prerequisites {course} Not Completed"
                }, 400

    if status == "registered" and present_course["course_status"] == "completed":
        course_ids = [course["course_id"] for course in session["user"]["course_list"]]
        course_prereqs_list = database.courseOperations.get_multiple_courses_prerequisites(course_ids=course_ids)
        for course in session["user"]["course_list"]:
            if present_course["course_id"] in course_prereqs_list[course["course_id"]]:
                return {"status":"error", "message":f"First unmark all other courses having this prerequisite,Eg: {course['course_id']}"},400
    
    response = database.studentOperations.update_course_status(session["user"]["id"], course_id, status, grade)
    if response == "Success":
        result = None
        for course in session["user"]["course_list"]:
            if course["course_id"] == course_id :
                course.update({ "course_status" : status,
                                "course_grade" : grade })
                result = True


        # The belowl line should do the functionality of above for loop,
        # but its not workingdont know why!?
        # result = next((course.update({"course_status": status, "course_grade":grade}) for course in session["user"]["course_list"] if course["course_id"] == course_id), None)

        if result == None:
            return "Course status update failed or possibly none of the courses were updated"
        return {
            "status" : "success",
            "message" : "Course status updated successfully"
        }, 200 #OK
    
    return response


#     if not any( course["course_id"] == id for course in session["user"]["course_list"]) :
#         return "The Course " + id + " is not registered to mark as complete"

#     new_status = response.form.get("status")

#     response = database.studentOperations.update_course_status(session["user"]["id"], id, new_status)

#     if response == "Success" :
#         next((course.update({"course_status": "completed"}) for course in session["user"]["course_list"] if course["course_id"] == "ME202"), None)
#         # We use the built-in next() function to execute the generator expression 
#         # and return the first updated course, or None if no course was updated.
#         # !!! If necessary we can write the case where next returns none 
#         # which means somehow the cache and Database data are not coherent!
#         return "Courses state changed succesfully"

#     return response

@maps.route("/get_registered_courses", methods = ["GET"])
@login_required(["student"])
def get_registered_courses():
    # if session.get("user") is None:
    #     return "Not logged in"
    
    # if len(session["user"]["course_list"]) == 0:
    #     return []

    ###!!! TO BE CHANGED AFTER LOGIN
    session['user'] = database.studentOperations.get_user_by_username("Harsha")
    session["user"].pop('_id')

    
    course_ids = [course["course_id"] for course in session["user"]["course_list"]]
    return course_ids
    
@maps.route("/get_courses/", defaults={"query":''}, methods = ["GET"])
@maps.route("/get_courses/<string:query>", methods = ["GET"])
@login_required(["student","admin"])
def get_courses(query):
    # if session.get("user") is None:
    #     return "Not logged in"
    
    return database.courseOperations.get_courses(query)

@maps.route("/update_grade/<string:course_id>",methods=["POST"])
# @login_required(["student"])
def update_grade(course_id):
    if session.get("user") is None:
        return "Login first!!!" ##############
    req = request.json
    print("Grade",req["grade"],course_id)
    response = database.studentOperations.update_grade(session["user"]["email"],course_id,req["grade"])
    course_id = [i for i,course in enumerate(session["user"]["course_list"]) if course["course_id"] == id]
    if len(course_id) == 0:
        return "No such course"
    course_id = course_id[0]
    session["user"]["course_list"][course_id]["course_grade"] = req["grade"]
    if response == "Success":
        return "Success"
    
