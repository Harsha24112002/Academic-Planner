import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Select,
  FormControl,
  MenuItem,
  Box,
  InputLabel,
  Button,
  Grid,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CourseForm from "./Admin/CourseForm";
import { useState } from "react";
import axios from "axios";
import { DetailsUpdate,StudentCoursesUpdate } from "../Actions/StudentDetailsActions";
function CourseRegistrationDialog({ open, handleClose }) {
  const reg_course_details = useSelector((state) => {
    return state.courseDetails.details;
  });
  const electives = [
    "Departmental Core Theory",
    "Free Elective",
    "Departmental Elective",
    "Liberal Arts Elective",
    "Life Skills",
    "Basic Engineering Skills",
    "Creative Arts Elective",
  ];
  const dispatch = useDispatch();
  const oddsems = [1, 3, 5, 7];
  const evensems = [2, 4, 6, 8];
  const [elective, setElective] = useState(electives[0]);
  const [regsem, setRegSem] = useState();
  const handleChange = (event) => {
    setElective(event.target.value);
  };
  const handleSemChange = (event) => {
    setRegSem(event.target.value);
  };
   
  const handleRegister = async (event) => {
    if (regsem == null || regsem == undefined) {
      alert("Semester not Selected!!!");
    } else {
      const formdata = {
        course_id: reg_course_details.course_id,
        registered_sem: regsem,
        elective: elective,
      };
      // const response = axios.post(
      //   `http://127.0.0.1:5000/maps/register/${reg_course_details.course_id}`,
      //   formdata
      // );
      const response = axios({method:"POST",
       url:`http://127.0.0.1:5000/maps/register/${reg_course_details.course_id}`,
       data:formdata,
        withCredentials: true
      })
      const data = (await response).data;
      alert(data.msg);
      console.log("DATA",data);
      //  IF Success
      if (data.success) {
        let flag = false;
        if(data.msg == "Prerequisites are not met")
        {
          flag = true;
        }
        
        const updateData = {
          course_id: reg_course_details.course_id,
          registered_sem: regsem,
          elective: elective,
          met_prerequisite_flag: !flag,
          incomplete_prerequisites: data.data,
          course_status: "registered"
        };
        
        dispatch(DetailsUpdate(updateData));
        let updateCourseData = {};
        updateCourseData[reg_course_details.course_id] = reg_course_details;
        dispatch(StudentCoursesUpdate(updateCourseData));
      }
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        // onClose={handleClose}
      >
        {Object.keys(reg_course_details).length != 0 ? (
          <>
            <DialogTitle>
              Registering {reg_course_details.course_id}{" "}
            </DialogTitle>
            <DialogContent>
              <CourseForm courseDetails={reg_course_details} type="see" />
              <Grid container columns={12}>
                <Grid item xs={8}>
                  <Box
                    m={1}
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 2 },
                      border: "dotted",
                      color: "red",
                    }}
                  >
                    <FormControl>
                      <InputLabel id="Elective Type">Elective Type</InputLabel>
                      <Select
                        labelId="Elective Type"
                        id="demo-simple-select"
                        value={elective}
                        onChange={handleChange}
                      >
                        {electives.map((elective) => (
                          <MenuItem value={elective}>{elective}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    m={1}
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 2 },
                      border: "dotted",
                      color: "red",
                    }}
                  >
                    <FormControl>
                      <InputLabel id="Semester">Semester</InputLabel>
                      <Select
                        labelId="Semester"
                        id="demo-simple-select"
                        value={regsem}
                        onChange={handleSemChange}
                        label="mylabel"
                        sx={{ minWidth: "120px" }}
                      >
                        {reg_course_details.course_sem == "even"
                          ? evensems.map((num) => (
                              <MenuItem value={num}>{num}</MenuItem>
                            ))
                          : oddsems.map((num) => (
                              <MenuItem value={num}>{num}</MenuItem>
                            ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
              <Button onClick={handleRegister}>Register</Button>
            </DialogContent>
          </>
        ) : (
          <h1> Loading... </h1>
        )}
      </Dialog>
    </div>
  );
}

export default CourseRegistrationDialog;
