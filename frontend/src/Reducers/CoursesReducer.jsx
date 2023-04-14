const initialState = {
    courses: [],
    loading: true,
    error: null
  };
  
  const coursesReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_COURSES_REQUEST':
        return { ...state, loading: true, error: null };
      case 'FETCH_COURSES_SUCCESS':
        return { ...state, courses: action.payload, loading: false, error: null };
      case 'FETCH_COURSES_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default coursesReducer;
  