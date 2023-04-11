from flask import request, session, Blueprint
from db_connection import database
from Models.models import StudentCourseSpecification
import threading

maps = Blueprint("maps",__name__, url_prefix="/maps/")

from .notes import *

@maps.route("/get_course_details", methods=["GET"])
def get_course_details():

    # !!! Add Courses collection to DB
    # and return courses based on search filters
    # that will be given as args/forms/...

    return "Course Details will be returned"

@maps.route("/register/<string:id>", methods=["POST","GET"])
def register(id):
    if session.get("user") is None:
        return "Not logged in"
    
    if session["user"]["course_list"] is None:
        session["user"]["course_list"] = []
    if any( course["course_id"] == id for course in session["user"]["course_list"]) :
        return "The Course " + id + " is already registered"

    course_dict = request.form.to_dict()
    course_dict["course_id"] = id

    prereq_list = database.studentOperations.get_prerequisites_of_course(id)
    if prereq_list == None :
        return "The Course " + id + " is not available"

    student_has_this_prereq = { course:False for course in prereq_list }
    student_registered_courses = session["user"]["course_list"]

    def is_prerequisite_completed(course_id):
        for course in student_registered_courses :
            if course["course_id"] == course_id :
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
    
    registeringCourse =  StudentCourseSpecification(**course_dict)    

    response = database.studentOperations.add_course(session["user"]["email"], registeringCourse.dict())
    # !!! add a try cache block if DB operations fail
    # ==> add in the studentDBOperations class not here

    if response == "Success" :
        session["user"]["course_list"].append(registeringCourse.dict())
        session.modified = True

        # return message when the course is registered with all its prerequisites fulfilled
        response = "Course " + str(id) + " is successfully registered"

        # when all the prerequisites are not met, a dict of prerequisite courses showing course-completion boolean is sent
        if course_dict["met_prerequisite_flag"] == False :
            response = student_has_this_prereq

    return response

@maps.route("/deregister/<string:id>", methods=["DELETE"])
def deregister(id):
    if session.get("user") is None:
        return "Not logged in"
    if not any( course["course_id"] == id for course in session["user"]["course_list"]) :
        return "The Course " + id + " is not registered to derigister!"

    response = database.studentOperations.delete_course(session["user"]["id"], id)

    if response == "Success" :
        session["user"]["course_list"].remove(next(course for course in session["user"]["course_list"] if course["course_id"] == id))
        return "Successfully Deregistered"

    # !!! Return proper? error messages or Internal Server Error
    return response

# !!! Not-completed Don't use this route
# @maps.route("/update_course_status/<int:id>", methods=["POST"])
# def update_course_status(id):

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
def get_registered_courses():
    if session.get("user") is None:
        return "Not logged in"
    
    if len(session["user"]["course_list"]) == 0:
        return []
    
    course_ids = [course["course_id"] for course in session["user"]["course_list"]]
    return course_ids
    

@maps.route("/get_courses/<string:query>", methods = ["GET"])
def get_courses(query):
    if session.get("user") is None:
        return "Not logged in"
    
    print(query)
    return database.studentOperations.get_courses(query)

