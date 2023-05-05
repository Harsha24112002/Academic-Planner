import axios from "axios";

export const fetchDetailsRequest = () => ({
  type: "STUDENT_DETAILS_REQUEST",
});

export const fetchDetailsSuccess = (Details) => ({
  type: "STUDENT_DETAILS_SUCCESS",
  payload: Details,
});

export const editNotes = (course_id, notes) =>
({
  type: "STUDENT_NOTES_UPDATE",
  payload: {
    "course_id":course_id,
    "notes": notes
  }
});

export const editDetails = (details) =>
({
  type: "STUDENT_DETAILS_UPDATE",
  payload: details
});

export const editGrade = (course_id, grade) => ({
  type: "STUDENT_GRADE_UPDATE",
  payload: {
    "course_id":course_id,
    "grade":grade
  }
})

export const editCourseStatus = (course_id, course_status,grade) => ({
  type: "STUDENT_COURSE_STATUS_UPDATE",
  payload: {
    "course_id":course_id,
    "course_status":course_status,
    "grade":grade
  }
})
export const fetchDetailsFailure = (error) => ({
  type: "STUDENT_DETAILS_FAILURE",
  payload: error,
});

export const DetailsUpdate = (Details) => ({
  type: "STUDENT_COURSE_DETAILS_UPDATE",
  payload: Details,
});

export const StudentDetailsDelete = (payload) => ({
  type: "STUDENT_COURSE_DELETE",
  payload: payload
}) 
export const fetchDetails = () => {
  return async (dispatch,getState) => {
    const details = getState().studentDetails.details
    if(Object.keys(details).length !== 0){
      return;
    }
    dispatch(fetchDetailsRequest());
      axios({
          method: "GET",
          url: "http://127.0.0.1:5000/authentication/get_details/student",
          withCredentials: true
      }).then((response) => {
          const studentDetails = response.data;
          console.log("AC",studentDetails)
          dispatch(fetchDetailsSuccess(studentDetails));
      }).catch((error) => {
          console.log(error);
          const errorMsg = error.message;
          dispatch(fetchDetailsFailure(errorMsg));
      });
  };
};

export const detailsDelete = (id) => {
  return (dispatch) => {
    dispatch(StudentDetailsDelete(id))
  }
}

export const fetchStudentCoursesRequest = () => ({
  type: "STUDENT_COURSES_REQUEST",
});

export const fetchStudentCoursesSuccess = (Details) => ({
  type: "STUDENT_COURSES_SUCCESS",
  payload: Details,
});

export const fetchStudentCoursesFailure = (error) => ({
  type: "STUDENT_COURSES_FAILURE",
  payload: error,
});

export const StudentCoursesUpdate = (Details) => ({
  type: "STUDENT_COURSES_UPDATE",
  payload: Details,
});

export const fetchStudentCourses = (data) => {
  return async (dispatch,getState) => {
    const course_details = getState().studentDetails.course_details
    if(Object.keys(course_details).length !== 0){
      return;
    }
    dispatch(fetchStudentCoursesRequest());
    // axios
    //   .post(`http://127.0.0.1:5000/maps/get_multiple_courses/`,data)
    //   .then((response) => {
    //     // console.log(response.data)
    //     const data = response.data;
    //     dispatch(fetchStudentCoursesSuccess(data));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     const errorMsg = error.message;
    //     dispatch(fetchStudentCoursesFailure(errorMsg));
    //   });

    axios({
      method: "POST",
      url: `http://127.0.0.1:5000/maps/get_multiple_courses/`,
      data: data,
      withCredentials: true
    }).then((response) => {
        // console.log(response.data)
        const data = response.data;
        dispatch(fetchStudentCoursesSuccess(data));
    }).catch((error) => {
        console.log(error);
        const errorMsg = error.message;
        dispatch(fetchStudentCoursesFailure(errorMsg));
    });
  };
};
