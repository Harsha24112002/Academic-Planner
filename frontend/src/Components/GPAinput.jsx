import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editCourseStatus, editGrade } from "../Actions/StudentDetailsActions";

export const Grades = ["A", "A-", "B", "B-", "C", "C-", "D", "F", "S"];
function GPAinput({ course_id,open, handleClose }) {

  const [Grade, setGrade] = useState("A");
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setGrade(e.target.value);
  };
  const handleSubmit = async (e) => {
    axios({
        method: "POST",
        url: `http://127.0.0.1:5000/maps/update_course_status/${course_id}`,
        data: {course_status:"completed",grade: Grade},
        withCredentials:true
    }).then((response) => {
      console.log("AAAA",response)
      if(response.data.data == "Success"){
        dispatch(editCourseStatus(course_id,"completed",Grade))
      }
      else{
        alert(response.data.msg);
      }
  })    
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <>
        <DialogTitle>You are currently seeing GPA</DialogTitle>
        <DialogContent>
          <Grid container columns={12}>
            <Grid Item xs={5}>
              <FormControl sx={{width:"200px"}}>
                <InputLabel id="GPA" margin="2px">Grade</InputLabel>
                <Select
                  labelId="GPA"
                  id="GPAhandler"
                  value={Grade}
                  onChange={handleChange}
                >
                  {Grades.map((G) => (
                    <MenuItem value={G}>{G}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid Item xs={8}>
              <Button onClick={handleSubmit}>Course Done!!!</Button>
            </Grid>
          </Grid>
        </DialogContent>
      </>
    </Dialog>
  );
}

export default GPAinput;
