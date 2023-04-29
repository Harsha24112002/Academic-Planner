import { Button, Dialog, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem,Select } from '@mui/material'
import React from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grades } from './GPAinput';
function ExpectedGrade({course_id,update_state,open,handleClose}) {
    console.log("Courseid",course_id)
    const [Grade, setGrade] = useState("A");
    const creds = useSelector((state) => (state.studentDetails.course_details[course_id].course_credits))
  const dispatch = useDispatch()
  const handleChange = (e) => {
    setGrade(e.target.value);
  };
  const handleSubmit = () => {
    const payload = {
        course_grade: Grade,
        course_credits: creds
    }
    update_state(course_id,payload)
    handleClose();
  };
  return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Expected Grade
        </DialogTitle>
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
              <Button onClick={handleSubmit}>Estimate</Button>
            </Grid>
          </Grid>
        </DialogContent>
        
      </Dialog>
  )
}

export default ExpectedGrade