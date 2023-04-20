import React from "react";
import { Box, TextField, IconButton, ListItemButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dialog,
  Typography,
  Button,
  DialogTitle,
  List,
  ListItem,
  CircularProgress,
} from "@mui/material";
import AddCourse from "./Admin/CourseForm"
import {
  fetchcoursesSearch,
  fetchcoursesSearchDelete,
} from "../Actions/CoursesSearchActions";
import axios from "axios";
import { saveDetails } from "../features/courseDetailsSlice";

function SearchCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Enter Query");
  const dispatch = useDispatch();
  const { coursesSearch, loading, error } = useSelector((state) => {
    console.log("AA",state.coursesSearch.coursesSearch)
    return {
      coursesSearch: state.coursesSearch.coursesSearch,
      loading: state.coursesSearch.loading,
      error: state.coursesSearch.error,
    };
  });

  

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    // console.log(event.target.value);
    console.log("Search query:", searchQuery);
    event.preventDefault();
    dispatch(fetchcoursesSearch(searchQuery));
    setOpen(true);

    // Perform search or other actions with the searchQuery value
  };
  const handleClose = () => {
    setOpen(false);
    dispatch(fetchcoursesSearchDelete());
  };
  const handleListItemButtonClick = (event) => {
    setSelectedValue(event.target.textContent);
    setOpen(false);
    dispatch(fetchcoursesSearchDelete());

    axios
      .get(`http://localhost:5000/maps/get_course_details/${event.target.textContent}`)
      .then((response) => {
        dispatch(saveDetails(response.data))
      })
      .catch((error) => {
        console.log(error.msg);
      });
  };
  return (
    <Box onSubmit={handleSearchSubmit} component="form">
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <IconButton type="submit" aria-label="Search">
        <SearchIcon />
      </IconButton>
      <Typography variant="subtitle1" component="div">
        Selected: {selectedValue}
      </Typography>
      <br />

      <Dialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        // onClose={handleClose}
      >
        <DialogTitle>Select Course</DialogTitle>
        <List>
          {loading ? (
            <CircularProgress />
          ) : (
            coursesSearch.map((course, i) => (
              <ListItem key={i} disableGutters>
                <ListItemButton key={i} onClick={handleListItemButtonClick}>
                  {course[0]}
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </Dialog>
      {/* {Object.keys(courseDetails).length !== 0 ? (
	<AddCourse courseDetails={courseDetails} type="update"/>
	) : (
	<></>
	)} */}
    </Box>
  );
}

export default SearchCourses;
