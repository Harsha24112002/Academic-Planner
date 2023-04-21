import axios from "axios";
export const fetchDetailsRequest = () => ({
  type: "STUDENT_DETAILS_REQUEST",
});

export const fetchDetailsSuccess = (Details) => ({
  type: "STUDENT_DETAILS_SUCCESS",
  payload: Details,
});

export const fetchDetailsFailure = (error) => ({
  type: "STUDENT_DETAILS_FAILURE",
  payload: error,
});

export const fetchDetails = () => {
  return (dispatch) => {
    dispatch(fetchDetailsRequest)
    axios
      .get("http://localhost:5000/authentication/get_details/student")
      .then(response => {
        console.log(response.data)
        const studentDetails = response.data;
        dispatch(fetchDetailsSuccess(studentDetails))
      })
      .catch(error => {
        console.log(error)
        const errorMsg = error.message
        dispatch(fetchDetailsFailure(errorMsg))
      });
  };
};
