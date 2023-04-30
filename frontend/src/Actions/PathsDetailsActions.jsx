import axios from "axios";

export const fetchDetailsRequest = () => ({
  type: "PATHS_DETAILS_REQUEST",
});

export const fetchDetailsSuccess = (Details) => ({
  type: "PATHS_DETAILS_SUCCESS",
  payload: Details,
});

export const fetchDetailsFailure = (error) => ({
  type: "PATHS_DETAILS_FAILURE",
  payload: error,
});

export const fetchDetailsDelete = (error) => ({
    type: "PATHS_DETAILS_DELETE",
    payload: error,
  });

export const fetchDetails = () => {
  return async (dispatch,getState) => {
    const paths = getState().studentDetails.paths
    if(Object.keys(paths).length !== 0){
      return;
    }
    dispatch(fetchDetailsRequest());
    axios({
        method:"GET",
        url: "http://127.0.0.1:5000/maps/getpaths",
        withCredentials: true
      }).then((response) => {
          const pathDetails = response.data;
          console.log((pathDetails))
          dispatch(fetchDetailsSuccess(pathDetails));
      }).catch((error) => {
          console.log(error);
          const errorMsg = error.message;
          dispatch(fetchDetailsFailure(errorMsg));
      });
  };
};
