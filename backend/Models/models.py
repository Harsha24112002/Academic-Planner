from pydantic import BaseModel
from typing import Optional,List
import json

class Notes(BaseModel):
    note : str
   
    def add_note():
        pass
    def update_note():
        pass
    def delete_note():
        pass        

class Course(BaseModel):
    course_name : str
    course_id: str
    course_instructor : str
    course_slot : str
    course_sem : str
    core_elective : str
    course_prerequisites : List[str] = []
 
    def updateCourse(self,**details):
        self.course_name = details.get("course_name",self.course_name)
        self.course_instructor = details.get("course_instructor",self.course_instructor)
        self.course_prerequisites = details.get("course_prerequisites",self.course_prerequisites)
        self.course_sem = details.get("course_sem",self.course_sem)
        self.core_elective = details.get("core_elective",self.core_elective)
        self.course_slot = details.get("course_slot",self.course_slot)

    def JSONify(self):
        return json.dumps(self.__dict__,object_hook=lambda d: d.dict())
     
    def print(self):
        print(self.__course_id)


class StudentCourseSpecification(BaseModel):
    course_id: str
    course_grade : Optional[str]
    course_status : Optional[str]
    registered_sem : int
    elective : Optional[str]
    met_prerequisite_flag : bool
    note : Optional[Notes]
    incomplete_prerequisites: List[str] = []

    # def JSONify(self):
    #     return json.dumps(self.__dict__,object_hook=lambda d: d.dict())
 
    
class User(BaseModel):
    first_name: Optional[str]
    last_name : Optional[str]
    username : str
    password : str
    email : str
    photo_url : Optional[str]
    id : Optional[str]
    # type : str
    

class Student(User,BaseModel):
    department : str
    cgpa : Optional[float]
    course_list : Optional[List[StudentCourseSpecification]] = []

    def JSONify(self):
        return json.dumps(self.__dict__)
    
    def update_metadata(self,**metadata):
        self.first_name = metadata.get("first_name",self.first_name)
        self.last_name = metadata.get("last_name",self.last_name)
        self.photo_url = metadata.get("photo_url",self.photo_url)
        self.cgpa = metadata.get("cgpa",self.cgpa)
        self.course_list = metadata.get("course_list",self.course_list)
        self.id = metadata.get("id",self.id)        
        pass

    # function to check if already a course is present in the slot
    def check_course_slot(self, course_id, course_slot, course_sem, courses):
        for course in courses:
            if course.course_sem == course_sem and course.course_slot == course_slot and course.course_status == "registered":
                return False
        return True

    def register():
        pass

        # check if the course is already registered
        # if not, then check if the course is present in the slot(retreive the course list from the database)
        # if yes, then register the course

    def deregister():
        pass    
    def mark_completed():
        pass

    def update_course_status(self, course_id, grade):
        for course in self.course_list:
            if course.course_id == course_id:
                course.course_status = "completed"
                course.course_grade = grade

                # !!! if there is a function to update the prerequisite flags, call it here, or it continues

                # check for other future course pre-requisite details met or not
                for future_course in self.course_list:
                    if future_course.course_status == "registered":
                        prerequisites_flag = True
                        for prereq in future_course.course_prerequisites:
                            # if the prerequisite is not completed, then the flag is false
                            # how to get out the prereq course from the course list?

                            # for course in self.course_list:
                            #     if course.course_id == prereq:
                            #         prerequisites_flag = prerequisites_flag and course.course_status == "completed"

                            prerequisites_flag = prerequisites_flag and self.course_list[prereq].course_status == "completed"
                        future_course.met_prerequisite_flag = prerequisites_flag
    
                break

        # based on the course prerequisite flags, reflect it on the frontend.
    

class Admin(User,BaseModel):
    def update_metadata():
        pass
    def add():
        pass
    def update():
        pass
    def delete():
        pass


class SpecializationPath(BaseModel):
    name : str
    path_url : str

    def update_paths(self,**pathDetails):
        self.name = pathDetails.get("name",self.name)
        self.path_url = pathDetails.get("path_url",self.path_url)
        

class PictorialRepresenation(BaseModel):
    pass
 

