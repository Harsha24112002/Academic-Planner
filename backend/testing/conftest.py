import pytest



#    sem1      sem2       sem3
#    CS101       
#      |------- CS201 ------|
#      |------- CS202 ------|
#                        CS301
#    CS102       CS204
def return_mock_course_list():
    mock_course_list = [
        {
            "course_name" : "cs bascis",
            "course_id" : "CS101",
            "course_instructor" : "MVP",
            "course_slot" : "R",
            "course_sem" : "1",
            "core_elective" : "CSE",
            "course_credits" : "1",
            "course_prerequisites" : []
        },
        {
            "course_name" : "cs bascis2",
            "course_id" : "CS102",
            "course_instructor" : "MVP",
            "course_slot" : "G",
            "course_sem" : "1",
            "core_elective" : "CSE",
            "course_credits" : "1",
            "course_prerequisites" : []
        },
        {
            "course_name" : "cs fundamentals",
            "course_id" : "CS201",
            "course_instructor" : "MVP",
            "course_slot" : "E",
            "course_sem" : "2",
            "core_elective" : "CSE",
            "course_credits" : "2",
            "course_prerequisites" : [
                "CS101"
            ]
        },
        {
            "course_name" : "Computer Arch",
            "course_id" : "CS204",
            "course_instructor" : "MVP",
            "course_slot" : "F",
            "course_sem" : "2",
            "core_elective" : "CSE",
            "course_credits" : "2",
            "course_prerequisites" : []
        },
        {
            "course_name" : "CS Advanced",
            "course_id" : "CS301",
            "course_instructor" : "MVP",
            "course_slot" : "C",
            "course_sem" : "3",
            "core_elective" : "CSE",
            "course_credits" : "3",
            "course_prerequisites" : [
                "CS201", "CS202"
            ]
        },
        {
            "course_name" : "CS principles",
            "course_id" : "CS202",
            "course_instructor" : "MVP",
            "course_slot" : "B",
            "course_sem" : "2",
            "core_elective" : "CSE",
            "course_credits" : "2",
            "course_prerequisites" : [
                "CS101"
            ]
        },
    ]

    return mock_course_list

def mock_user_session():
    user_session = {
        "email" : "tester@iith.ac.in",
        "course_list" : [
            {
                "course_id" : "CS101",
                "course_grade" : "A",
                "course_status" : "completed",
                "registered_sem" : 1,
                "elective" : "Departmental Core Theory",
                "met_prerequisite_flag" : True,
                "note" : { "note" : "Some note"},
                "incomplete_prerequisites" : []
            }
        ],
        "id" : "testerId",
        "role" : "student"
    }

    return user_session