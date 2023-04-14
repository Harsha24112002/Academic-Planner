const initialState = {
    details: [],
    loading: true,
    error: null
  };
  
  const detailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'STUDENT_DETAILS_REQUEST':
        return { ...state, loading: true, error: null };
      case 'STUDENT_DETAILS_SUCCESS':
        return { ...state, details: action.payload, loading: false, error: null };
      case 'STUDENT_DETAILS_FAILURE':
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default detailsReducer;
  