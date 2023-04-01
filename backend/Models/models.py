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
 
    def JSONify(self):
        return json.dumps(self.__dict__,object_hook=lambda d: d.dict())
     
    def print(self):
        print(self.__course_id)


class StudentCourseSpecification(BaseModel):
    course_id: str
    course_grade : str
    course_status : str
    # registered_sem : bool
    elective : str
    met_prerequisite_flag : bool
    note : Optional[Notes]

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
    

class Student(User,BaseModel):
    department : str
    cgpa : Optional[float]
    course_list : Optional[List[StudentCourseSpecification]]

    def JSONify(self):
        return json.dumps(self.__dict__)
    
    def update_metadata(self,**metadata):
        self.first_name = metadata.get("first_name",self.first_name)
        self.last_name = metadata.get("last_name",self.last_name)
        self.photo_url = metadata.get("photo_url",self.photo_url)
        self.cgpa = metadata.get("cgpa",self.cgpa)
        self.course_list = metadata.get("course_list",self.course_list)
        pass
    def register():
        pass
    def deregister():
        pass    
    def mark_completed():
        pass
    

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

    def update_paths():
        pass

class PictorialRepresenation(BaseModel):
    pass
 

