import axios from "axios";
export const fetchcoursesSearchRequest = () => ({
  type: "COURSES_SEARCH_REQUEST",
});

export const fetchcoursesSearchSuccess = (Details) => ({
  type: "COURSES_SEARCH_SUCCESS",
  payload: Details,
});

export const fetchcoursesSearchFailure = (error) => ({
  type: "COURSES_SEARCH_FAILURE",
  payload: error,
});

export const fetchcoursesSearchDelete = () => ({
  type: "COURSES_SEARCH_DELETE",
});
export const fetchcoursesSearch = (searchQuery) => {
  return (dispatch) => {
    dispatch(fetchcoursesSearchRequest());


    if(searchQuery == null)
    {
      searchQuery = ""
    }


    axios({
        method: "GET",
        url: `http://127.0.0.1:5000/maps/get_courses/${searchQuery}`,
        withCredentials: true
    }).then((response) => {
        const data = response.data;
        dispatch(fetchcoursesSearchSuccess(data));
    }).catch((error) => {
        const errorMsg = error.message;
        dispatch(fetchcoursesSearchFailure(errorMsg));
    });
  };
};
