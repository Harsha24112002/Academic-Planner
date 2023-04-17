import axios from "axios";
export const fetchCourseDetailsRequest = () => ({
  type: "COURSE_DETAILS_REQUEST",
});

export const fetchCourseDetailsSuccess = (Details) => ({
  type: "COURSE_DETAILS_SUCCESS",
  payload: Details,
});

export const fetchCourseDetailsFailure = (error) => ({
  type: "COURSE_DETAILS_FAILURE",
  payload: error,
});

export const fetchCourseDetailsDelete = () => ({
  type: "COURSE_DETAILS_DELETE",
});
export const fetchCourseDetails = (searchQuery) => {
  return (dispatch) => {
    dispatch(fetchCourseDetailsRequest);
    axios
      .get(`http://localhost:5000/maps/get_courses/${searchQuery}`)
      .then((response) => {
        // console.log(response.data)
        const data = response.data;
        dispatch(fetchCourseDetailsSuccess(data));
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = error.message;
        dispatch(fetchCourseDetailsFailure(errorMsg));
      });
  };
};
