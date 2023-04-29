const initialState = {
	pathsSearch: [],
	loading: true,
	error: null,
      };
      
      const pathsSearchReducer = (state = initialState, action) => {
	switch (action.type) {
	  case "PATHS_SEARCH_REQUEST":
	    return { ...state, loading: true, error: null };
	  case "PATHS_SEARCH_SUCCESS": {
	    console.log("Payload", action.payload);
	    return {
	      ...state,
	      pathsSearch: action.payload,
	      loading: false,
	      error: null,
	    };
	  }
	  case "PATHS_SEARCH_FAILURE":
	    return { ...state, loading: false, error: action.payload };
	  case "PATHS_SEARCH_DELETE":
	    return initialState;
	  default:
	    return state;
	}
      };
      
      export default pathsSearchReducer;
      