const initialState = {
  details: {},
  course_details: {},
  details_loading: true,
  course_details_loading: true,
  error: null,
};

const detailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "STUDENT_DETAILS_REQUEST":
      return { ...state, details_loading: true, error: null };
    case "STUDENT_DETAILS_SUCCESS":
      return {
        ...state,
        details: action.payload,
        details_loading: false,
        error: null,
      };
    case "STUDENT_DETAILS_FAILURE":
      return { ...state, details_loading: false, error: action.payload };
    case "STUDENT_COURSE_DETAILS_UPDATE": {
      let updated_state = {
        ...state,
        details: {
          ...state.details,
          course_list: [...state.details.course_list, action.payload],
        },
      };
      let updated_details = { ...updated_state.details };
      let updated_details_course_list = []
      for (let org_course of updated_details.course_list) {
        let course = { ...org_course }
        let found = course.incomplete_prerequisites.find(
          (element) => element == action.payload.course_id
        );
        if (found && action.payload.registered_sem < course.registered_sem) {
          let incomplete_prerequisites = [];
          incomplete_prerequisites =
            course.incomplete_prerequisites.filter((course_id) => {
              return course_id != action.payload.course_id;
            });
          course.incomplete_prerequisites = incomplete_prerequisites
        }

        if (course.incomplete_prerequisites.length === 0) {
          course.met_prerequisite_flag = true;
        }
        updated_details_course_list.push(course)
      }
      updated_details.course_list = updated_details_course_list;
      updated_state.details = updated_details;
      return updated_state;
    }
    case "STUDENT_COURSE_DELETE": {
      const id = action.payload;

      // let updated_state = JSON.parse(JSON.stringify(state))
      // updated_state.details.course_list = updated_state.details.course_list.filter((course)=>course.course_id != id)

      // console.log("updated_state", updated_state)
      // return updated_state;

      let updated_state = {
        ...state,
      };

      let updated_course_details = { ...updated_state.course_details };
      delete updated_course_details[id]
      let updated_details = { ...updated_state.details };


      let updated_details_course_list = []

      let len = updated_state.details.course_list;

      for (let org_course of updated_details.course_list) {
        let course = {...org_course}
        if (course.course_id == id) {
          continue;
        }
        let found = updated_course_details[
          course.course_id
        ].course_prerequisites.find((element) => element == id);


        if (found) {
          course.met_prerequisite_flag = false;
          if (
            !course.incomplete_prerequisites.find(
              (course_id) => course_id === id
            )
          ) {
            let dup_incomplete_prerequisites = [...course.incomplete_prerequisites]
            dup_incomplete_prerequisites.push(id);
            course.incomplete_prerequisites = dup_incomplete_prerequisites;
          }
        }

        updated_details_course_list.push(course)
      }

      updated_details.course_list = updated_details_course_list

      updated_state.details = updated_details;
      updated_state.course_details = updated_course_details;

      return updated_state;
    }
    case "STUDENT_COURSES_REQUEST":
      return { ...state, course_details_loading: true, error: null };
    case "STUDENT_COURSES_SUCCESS":
      return {
        ...state,
        course_details: action.payload,
        course_details_loading: false,
        error: null,
      };
    case "STUDENT_COURSES_FAILURE":
      return { ...state, course_details_loading: false, error: action.payload };
    case "STUDENT_COURSES_UPDATE":
      return {
        ...state,
        course_details: { ...state.course_details, ...action.payload },
      };

    case "STUDENT_DETAILS_UPDATE":
      return {
        ...state,
        details : {...state.details, ...action.payload}
      }
    case "STUDENT_NOTES_UPDATE":
      {
        let updated_state = JSON.parse(JSON.stringify(state))
        updated_state.details.course_list = updated_state.details.course_list.map((course) => {
          if (course.course_id == action.payload.course_id) {
            course.note = { "note": action.payload.notes }
          }
          return course;
        })
        console.log("updated_state",updated_state)
        return updated_state;
      }
    case "STUDENT_GRADE_UPDATE":
      {
        let updated_state = JSON.parse(JSON.stringify(state))
        updated_state.details.course_list = updated_state.details.course_list.map((course) => {
          if(course.course_id == action.payload.course_id){
            course.course_grade = action.payload.grade
          }  
          return course;
        })
        console.log("updated_state",updated_state)
        return updated_state;
      }
    case "STUDENT_COURSE_STATUS_UPDATE":
      {
        let updated_state = JSON.parse(JSON.stringify(state))
        updated_state.details.course_list = updated_state.details.course_list.map((course) => {
          if(course.course_id == action.payload.course_id){
            console.log("A",action.payload)
            course.course_grade = action.payload.grade
            course.course_status = action.payload.course_status
          }  
          return course;
        })
        console.log("updated_state", updated_state)
        return updated_state;
      }
    default:
      return state;
  }
};

export default detailsReducer;
