from flask import request, session, Blueprint
from db_connection import database
from Models.models import StudentCourseSpecification
import threading
# from bson.json_utils import dumps

maps = Blueprint("maps",__name__, url_prefix="/maps/")

from .notes import *

@maps.route("/get_course_details/<string:id>", methods=["GET"])
def get_course_details(id):
    # if session.get("user") is None:
    #     return "Not Logged In"

    details = database.courseOperations.get_course_details(id)
    # !!! Add Courses collection to DB
    # and return courses based on search filters
    # that will be given as args/forms/...
    details.pop('_id')
    print(details)
        
    return details

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

    prereq_list = database.courseOperations.get_prerequisites_of_course(id)
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
@maps.route("/update_course_status/<string:course_id>", methods=["POST"])
def update_course_status(course_id):

    #  if the course is not in the student's course list, return error message
    present_course = None
    for course in session["user"]["course_list"]:
        if course["course_id"] == course_id:
            present_course = course
            break
    
    if present_course == None :
        return "The Course " + course_id + " is not registered to mark as complete"
    
    #  if the course is in the student's course list, update the course status
    status = request.form.get("status")
    response = database.studentOperations.update_course_status(session["user"]["id"], course_id, status)

    if response == "Success":
        result = next((course.update({"course_status": status}) for course in session["user"]["course_list"] if course["course_id"] == course_id), None)
        if result == None:
            return "Course status update failed or possibly none of the courses were updated"
        return "Course status updated successfully"
    
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
def get_registered_courses():
    # if session.get("user") is None:
    #     return "Not logged in"
    
    # if len(session["user"]["course_list"]) == 0:
    #     return []

    ###!!! TO BE CHANGED AFTER LOGIN
    session['user'] = database.studentOperations.get_user_by_username("Geetha")
    session["user"].pop('_id')

    
    course_ids = [course["course_id"] for course in session["user"]["course_list"]]
    return course_ids
    

@maps.route("/get_courses/<string:query>", methods = ["GET"])
def get_courses(query):
    # if session.get("user") is None:
    #     return "Not logged in"
    
    return database.courseOperations.get_courses(query)

