import axios from "axios";
export const fetchpathsSearchRequest = () => ({
  type: "PATHS_SEARCH_REQUEST",
});

export const fetchpathsSearchSuccess = (Details) => ({
  type: "PATHS_SEARCH_SUCCESS",
  payload: Details,
});

export const fetchpathsSearchFailure = (error) => ({
  type: "PATHS_SEARCH_FAILURE",
  payload: error,
});

export const fetchpathsSearchDelete = () => ({
  type: "PATHS_SEARCH_DELETE",
});
export const fetchpathsSearch = (searchQuery) => {
  return (dispatch) => {
    dispatch(fetchpathsSearchRequest());

    axios({
        method: "GET",
        url: `http://127.0.0.1:5000/maps/get_paths/${searchQuery}`,
        withCredentials: true
    }).then((response) => {
        console.log("[paths]",response.data)
        const data = response.data;
        dispatch(fetchpathsSearchSuccess(data));
    }).catch((error) => {
        console.log(error);
        const errorMsg = error.message;
        dispatch(fetchpathsSearchFailure(errorMsg));
    });
  };
};
