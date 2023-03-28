# # Pseudo Code representing Models/Classes

# class User():
#     __first_name
#     __last_name
#     __username
#     __password
#     __mail_address
#     __photo_url
#     __id

#     def update_metadata(...):

class User():

    def __init__(self):
        self.__first_name = None
        self.__last_name = None
        self.__username = None
        self.__password = None
        self.__mail_address = None
        self.__photo_url = None
        self.__id = None

    def update_metadata(self, first_name, last_name, username, password, mail_address, photo_url, id):
        self.__first_name = first_name
        self.__last_name = last_name
        self.__username = username
        self.__password = password
        self.__mail_address = mail_address
        self.__photo_url = photo_url
        self.__id = id


# class Student(User):
#     __department
#     __cgpa    

#     __course_list : list(Course)

#     def update_metadata():
#         pass
    
#     def register():
#         pass
#     def deregister():
#         pass    
#     def mark_completed():
#         pass

# class Admin(User):
#     def update_metadata():
#         pass

#     def add():
#         pass
#     def update():
#         pass
#     def delete():
#         pass

# class Course():
#     __course_name
#     __course_id
#     __course_instructor
#     __course_slot
#     __course_sem
#     __core_elective

#     __course_prerequisites : list(string)
#     __specification : StudentCourseSpecification

# class StudentCourseSpecification():
#     __course_grade
#     __course_status
#     __elective
#     __met_prerequisite_flag
#     __note : Notes()

    

# class SpecializationPaths():
#     __paths = list(image_urls)

#     def update_paths():
#         pass

# class Notes():
#     _note : string

#     def add_note():
#         pass
#     def update_note():
#         pass
#     def delete_note():
#         pass


# class PictorialRepresenation():
#     pass
