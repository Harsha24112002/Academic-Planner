const initialState = {
  coursesSearch: [],
  loading: true,
  error: null,
};

const coursesSearchReducer = (state = initialState, action) => {
  switch (action.type) {
    case "COURSES_SEARCH_REQUEST":
      return { ...state, loading: true, error: null };
    case "COURSES_SEARCH_SUCCESS": {
      console.log("Payload", action.payload);
      return {
        ...state,
        coursesSearch: action.payload,
        loading: false,
        error: null,
      };
    }
    case "COURSES_SEARCH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "COURSES_SEARCH_DELETE":
      return initialState;
    default:
      return state;
  }
};

export default coursesSearchReducer;
