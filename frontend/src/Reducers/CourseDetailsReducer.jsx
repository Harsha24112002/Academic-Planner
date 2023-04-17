const initialState = {
  courseDetails: [],
  loading: true,
  error: null,
};

const courseDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "COURSE_DETAILS_REQUEST":
      return { ...state, loading: true, error: null };
    case "COURSE_DETAILS_SUCCESS": {
      console.log("Payload", action.payload);
      return {
        ...state,
        courseDetails: action.payload,
        loading: false,
        error: null,
      };
    }
    case "COURSE_DETAILS_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "COURSE_DETAILS_DELETE":
      return initialState;
    default:
      return state;
  }
};

export default courseDetailsReducer;
