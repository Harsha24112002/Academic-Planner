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
    // axios
    //   .get(`http://127.0.0.1:5000/maps/get_courses/${searchQuery}`,
    //         { "withCredentials" : true }
    //   )
    //   .then((response) => {
    //     console.log(response.data)
    //     const data = response.data;
    //     dispatch(fetchcoursesSearchSuccess(data));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     const errorMsg = error.message;
    //     dispatch(fetchcoursesSearchFailure(errorMsg));
    //   });

    if(searchQuery == null)
    {
      searchQuery = ""
    }

    console.log("SSSSSSSSSSS",searchQuery);

    axios({
        method: "GET",
        url: `http://127.0.0.1:5000/maps/get_courses/${searchQuery}`,
        withCredentials: true
    }).then((response) => {
        console.log("courses",response.data)
        const data = response.data;
        dispatch(fetchcoursesSearchSuccess(data));
    }).catch((error) => {
        console.log(error);
        const errorMsg = error.message;
        dispatch(fetchcoursesSearchFailure(errorMsg));
    });
  };
};
