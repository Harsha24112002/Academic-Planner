const initialState = {
    details: {},
    loading: true,
    error: null
  };
  
  const studentCourseReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'STUDENT_COURSES_REQUEST':
        return { ...state, loading: true, error: null };
      case 'STUDENT_COURSES_SUCCESS':
        return { ...state, details: action.payload, loading: false, error: null };
      case 'STUDENT_COURSES_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default studentCourseReducer;
  