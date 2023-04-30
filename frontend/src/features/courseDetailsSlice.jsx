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
    deleteDetails:(state)=>{
      state.details = {}
    }
  },
});

export const { saveDetails, deleteDetails } = courseDetailsSlice.actions;

export default courseDetailsSlice.reducer;
