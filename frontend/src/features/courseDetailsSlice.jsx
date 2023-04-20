import { createSlice } from "@reduxjs/toolkit";

export const courseDetailsSlice = createSlice({
  name: "courseDetails",
  initialState: {
    details: {},
  },
  reducers: {
    saveDetails: (state, action) => {
      console.log("ATREDUXER",action.payload)
      state.details = action.payload;
    },
  },
});

export const { saveDetails } = courseDetailsSlice.actions;

export default courseDetailsSlice.reducer;
