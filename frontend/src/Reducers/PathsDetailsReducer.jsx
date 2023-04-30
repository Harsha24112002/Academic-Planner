const initialState = {
    paths: {},
    loading: true,
    error: null,
  };
  
  const pathsDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
      case "PATHS_DETAILS_REQUEST":
        return { ...state, loading: true, error: null };
      case "PATHS_DETAILS_SUCCESS": {
        console.log("Payload ", state,action.payload);
        return {
          ...state,
          paths: action.payload,
          loading: false,
          error: null,
        };
      }
      case "PATHS_DETAILS_FAILURE":
        return { ...state, loading: false, error: action.payload };
      case "PATHS_DETAILS_DELETE":
        return initialState;
      default:
        return state;
    }
  };
  
  export default pathsDetailsReducer;
  