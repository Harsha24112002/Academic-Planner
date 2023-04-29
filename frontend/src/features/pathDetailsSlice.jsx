import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const pathDetailsSlice = createSlice({
  name: "pathDetails",
  initialState: {
    details : {},
    paths : "",
    paths_loading: true
  },
  reducers: {
    savePath: (state, action) => {
      console.log("ATREDUXER",action.payload)
      state.details = action.payload;
    },
    fetchPaths: (state) =>
    {
      axios({
        method:"GET",
        url: "http://127.0.0.1:5000/maps/getpaths",
        withCredentials: true
      }).then((response) =>
      {
        console.log("in fetch", response.data)
        state.paths = response.data
        state.paths_loading = false
        return response.data
      })
    },
  },
});

export const { savePath, fetchPaths } = pathDetailsSlice.actions;

export default pathDetailsSlice.reducer;
