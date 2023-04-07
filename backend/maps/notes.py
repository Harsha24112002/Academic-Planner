from flask import request, session, Blueprint

from db_connection import database
from Models.models import Student
from Models.models import StudentCourseSpecification, Notes
from .maps import maps

@maps.route("/addnotes/<string:id>", methods=["POST"])
def addnotes(id):
    if session.get("user") is None:
        return "Login first!!!" ##############
    
    
    req = request.json
    notes = Notes(**req)
    # student.addnotes(id,req)
    response = database.studentOperations.add_notes(session["user"]["id"],id,notes)
    print(session["user"])
    course_id = [i for i,course in enumerate(session["user"]["course_list"]) if course.course_id == id]
    if len(course_id) == 0:
        return "No such course"
    course_id = course_id[0]
    session.user.course_list[course_id].note = notes.dict()["note"]
    if response == "Success":
        return "Success"
    
@maps.route("/updatenotes/<string:id>", methods=["POST"])
def updatenotes(id):
    if session.get("user") is None:
        return "Login first!!!" ##############
    
    req = request.json
    student = Student(session["user"])
    student.addnotes(id,req)
    response = database.studentOperations.update(student.email,student.dict())
    session["user"] = student.dict()
    if response == "Success":
        return "Success"
    
@maps.route("/deletenotes/<string:id>", methods=["POST"])
def deletenotes(id):
    if session.get("user") is None:
        return "Login first!!!" ##############
    
    req = request.json
    student = Student(session["user"])
    student.deletenotes(id,req)
    response = database.studentOperations.update(student.email,student.dict())
    session["user"] = student.dict()
    if response == "Success":
        return "Success"
    return "Failure"