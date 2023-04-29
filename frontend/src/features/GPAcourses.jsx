import { createSlice } from "@reduxjs/toolkit";

const grades = {
    "A":10,"A-":9,"B":8,"B-":7,"C":6,"C-":5,"D":4,"F":0
}
export const GPAcoursesSlice = createSlice({
  name: "GPACourses",
  initialState: {
    weightedsum: 0,
    total_creds: 0,
  },
  reducers: {
    AddCourse: (state, action) => {
        console.log(action)
      state.weightedsum = state.weightedsum + grades[action.payload.course_grade]*action.payload.course_credits;
      state.total_creds = state.total_creds + action.payload.course_credits;
    },
    RemoveCourse: (state, action) => {
        console.log(action)
      state.weightedsum = state.weightedsum - grades[action.payload.course_grade]*action.payload.course_credits;
      state.total_creds = state.total_creds - action.payload.course_credits;
    },
  },
});

export const { AddCourse,RemoveCourse } = GPAcoursesSlice.actions;

export default GPAcoursesSlice.reducer;
