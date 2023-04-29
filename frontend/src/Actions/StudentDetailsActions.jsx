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
  course_id: course_id,
  payload: notes
});

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
  return (dispatch) => {
    dispatch(fetchDetailsRequest());
    // axios
    //   .get("http://localhost:5000/authentication/get_details/student",
    //         { "withCredentials" : true }
    //   )
    //   .then((response) => {
    //     // console.log(response.data)
    //     const studentDetails = response.data;
    //     dispatch(fetchDetailsSuccess(studentDetails));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     const errorMsg = error.message;
    //     dispatch(fetchDetailsFailure(errorMsg));
    //   });

      axios({
          method: "GET",
          url: "http://127.0.0.1:5000/authentication/get_details/student",
          withCredentials: true
      }).then((response) => {
          // console.log(response.data)
          const studentDetails = response.data;
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
    // const course_details = store.getState().studentCourses.details;
    // const payload = {
    //   "course_id":id,
    //   "courses": course_details
    // }
    // console.log("RBRB",course_details)
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
  return (dispatch) => {
    dispatch(fetchStudentCoursesRequest());
    // axios
    //   .post(`http://localhost:5000/maps/get_multiple_courses/`,data)
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
