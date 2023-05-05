import { createSlice } from "@reduxjs/toolkit";

export const grades = {
    "A":10,"A-":9,"B":8,"B-":7,"C":6,"C-":5,"D":4,"F":0
}
export const GPAcoursesSlice = createSlice({
  name: "GPACourses",
  initialState: {
    weightedsum: 0,
    total_creds: 0,
    selectedCourses: {},
    expectedGrades: {}
  },
  reducers: {
    AddCourse: (state, action) => {
      console.log("acbscjs",action.payload)
      state.weightedsum = state.weightedsum + grades[action.payload.course_grade]*action.payload.course_credits;
      state.total_creds = state.total_creds + action.payload.course_credits;
      const newdict = {}
      newdict[action.payload.course_id] = true;
      const newgrade = {}
      newgrade[action.payload.course_id] = action.payload.course_grade
      state.selectedCourses = {...state.selectedCourses, ...newdict}
      state.expectedGrades = {...state.expectedGrades, ...newgrade}
    },
    RemoveCourse: (state, action) => {
        console.log(action)
      state.weightedsum = state.weightedsum - grades[action.payload.course_grade]*action.payload.course_credits;
      state.total_creds = state.total_creds - action.payload.course_credits;
      const newdict = {}
      newdict[action.payload.course_id] = false;
      state.selectedCourses = {...state.selectedCourses, ...newdict}
    },
    ClearGPA: (state,action) => {
      state.weightedsum = 0;
      state.total_creds = 0;
      state.selectedCourses = {};
      state.expectedGrades = {};
    }
  },
});

export const { AddCourse,RemoveCourse,ClearGPA } = GPAcoursesSlice.actions;

export default GPAcoursesSlice.reducer;
