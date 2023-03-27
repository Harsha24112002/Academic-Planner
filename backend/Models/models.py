# Pseudo Code representing Models/Classes

class User():
    __first_name
    __last_name
    __username
    __password
    __mail_address
    __photo_url
    __id

    def update_metadata(...):


class Student(User):
    __department
    __cgpa    

    __course_list : list(Course)

    def update_metadata():
        pass
    
    def register():
        pass
    def deregister():
        pass    
    def mark_completed():
        pass

class Admin(User):
    def update_metadata():
        pass

    def add():
        pass
    def update():
        pass
    def delete():
        pass

class Course():
    __course_name
    __course_id
    __course_instructor
    __course_slot
    __course_sem
    __core_elective

    __course_prerequisites : list(string)
    __specification : StudentCourseSpecification

class StudentCourseSpecification():
    __course_grade
    __course_status
    __elective
    __met_prerequisite_flag
    __note : Notes()

    

class SpecializationPaths():
    __paths = list(image_urls)

    def update_paths():
        pass

class Notes():
    _note : string

    def add_note():
        pass
    def update_note():
        pass
    def delete_note():
        pass


class PictorialRepresenation():
    pass
