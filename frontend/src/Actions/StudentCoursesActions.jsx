import axios from "axios";
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

export const fetchStudentCourses = (data) => {
  return (dispatch) => {
    dispatch(fetchStudentCoursesRequest());
    axios
      .post(`http://localhost:5000/maps/get_multiple_courses/`,data)
      .then((response) => {
        // console.log(response.data)
        const data = response.data;
        dispatch(fetchStudentCoursesSuccess(data));
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = error.message;
        dispatch(fetchStudentCoursesFailure(errorMsg));
      });
  };
};
