import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { detailsDelete, editNotes } from "../Actions/StudentDetailsActions";
import "../css/Shapes.css"
import axios from "axios";



const EditableTextBox = ({ course_id, initialValue }) => {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch()
  
  const onSave = (value, course_id) => {
    axios({
      method:"POST",
      url:`http://localhost:5000/maps/addnotes/${course_id}`, 
      data : {'note':value}, 
      withCredentials:true
    }).then(
      dispatch(editNotes(course_id,value))
      )
    }
    
    const onCancel = () =>
    {
      
    }
  const handleSave = () => {
    onSave(value,course_id);
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setEditing(false);
    onCancel();
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      {editing ? (
        <>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="outlined-multiline-flexible"
                label="Notes"
                multiline
                maxRows={4}
                defaultValue={initialValue}
                onChange={handleChange}
              />
            </div>
          </Box>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </>
      ) : (
        <>
          <span onClick={handleEdit}>{value}</span>
          <p class="helper-text"> Double click to edit </p>
        </>
      )}
    </div>
  );
};

function CourseDetails({ course_id, open, handleClose }) {
  const dispatch = useDispatch();
  const handleDeregister = async (e) => {
    handleClose();
    const id = course_id;
    const response = axios({
      method:"DELETE",
      url:`http://localhost:5000/maps/deregister/${id}`,
      withCredentials:true
    });
    const data = (await response).data;
    alert(data);
    dispatch(detailsDelete(id));
  };
  const { details, course_details } = useSelector((state) => {
    return {
      course_details: state.studentDetails.course_details[course_id],
      details: state.studentDetails.details,
    };
  });
  const student_course_details = details.course_list.filter((course) => {
    return course.course_id === course_id;
  })[0];
  const all_details_dict = [
    ["Course ID", course_id],
    ["Course Instructor", course_details.course_instructor],
    ["Course Slot", course_details.course_slot],
    ["Semester", student_course_details.registered_sem],
    ["Course Status", student_course_details.course_status],
    ["Elective Type", student_course_details.elective],
  ];
  /**
   *
    course_id: str
    course_grade : Optional[str]
    course_status : Optional[str]
    registered_sem : int
    elective : Optional[str]
    met_prerequisite_flag : bool
    note : Optional[Notes]
    incomplete_prerequisites: List[str] = []

   */
  return (
    <div>
      {open ? (
        <Dialog
          open={open}
          onClose={handleClose}
          // onClose={handleClose}
        >
          <>
            <DialogTitle>
              You are currently seeing {course_details.course_id}
            </DialogTitle>
            <DialogContent>
              {/*
               * Course Details from CourseDB -> uneditable
               * Notes, mark as completed( GPA )  -> Editable
               * remaining student_course specification- unedit
               *
               */}

              <Grid container columns={12}>
                {all_details_dict.map((info) => {
                  return (
                    <Grid item xs={6}>
                      <p>{info[0]}</p>
                      <h3 style={{ marginTop: "-10px" }}>{info[1]}</h3>
                    </Grid>
                  );
                })}

                <Grid item xs={6}>
                  <p>Notes</p>
                  <div>
                    <EditableTextBox
                      course_id = {course_id}
                      initialValue={student_course_details.note ? (student_course_details.note.note ? student_course_details.note.note : "Enter Notes Here" ) : "Enter notes here"}
                    ></EditableTextBox>
                  </div>
                </Grid>
                {/* <Grid item xs={8}>
                  <Box
                    component="form"
                    sx={{
                      "& .MuiTextField-root": { m: 1, width: "25ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <TextField
                        id="outlined-multiline-flexible"
                        label="Notes"
                        multiline
                        maxRows={4}
                        defaultValue={student_course_details.note.note}
                      />
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                     <Button>Save Note</Button>
                </Grid> */}
              </Grid>

              <Button onClick={handleDeregister}>Deregister</Button>
            </DialogContent>
          </>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
}

export default CourseDetails;
