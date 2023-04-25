from flask import request, session
from db_connection import database
from Models.models import  Notes
from .maps import maps
# from authentication import login_required

@maps.route("/addnotes/<string:id>", methods=["POST"])
# @login_required("student")
def addnotes(id): # updatenotes = addnotes
    if session.get("user") is None:
        return "Login first!!!" ##############
    
    req = request.json
    notes = Notes(**req)
    # student.addnotes(id,req)
    response = database.studentOperations.add_notes(session["user"]["email"],id,notes)
    print(session["user"])
    course_id = [i for i,course in enumerate(session["user"]["course_list"]) if course["course_id"] == id]
    if len(course_id) == 0:
        return "No such course"
    course_id = course_id[0]
    session["user"]["course_list"][course_id]["note"] = notes.dict()["note"]
    if response == "Success":
        return "Success"
    
    
@maps.route("/deletenotes/<string:id>", methods=["DELETE"])
# @login_required(["student"])
def deletenotes(id):
    if session.get("user") is None:
        return "Login first!!!" ##############
    response = database.studentOperations.delete_notes(session["user"]["email"],id)
    print(session["user"])
    course_id = [i for i,course in enumerate(session["user"]["course_list"]) if course["course_id"] == id]
    if len(course_id) == 0:
        return "No such course"
    course_id = course_id[0]
    session["user"]["course_list"][course_id]["note"] = None
    if response == "Success":
        return "Success"
    return response    