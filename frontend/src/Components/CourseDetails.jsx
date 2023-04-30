import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  alertClasses,
} from "@mui/material";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { detailsDelete, editCourseStatus, editNotes } from "../Actions/StudentDetailsActions";
import "../css/Shapes.css";
import axios from "axios";
import GPAinput from "./GPAinput";
import CourseNotesEditTextBox from "./CourseNotesEditTextBox";
import { editGrade } from "../Actions/StudentDetailsActions";
import CourseGPAEditTextBox from "./CourseGPAEditTextBox";
function CourseDetails({ course_id, open, handleClose }) {
  const dispatch = useDispatch();
  const [GPAboxopen, setGPAboxopen] = useState(false);
  const handleDeregister = async (e) => {
    handleClose();
    const id = course_id;
    const response = axios({
      method:"DELETE",
      url:`http://127.0.0.1:5000/maps/deregister/${id}`,
      withCredentials:true
    });
    const data = (await response).data;
    alert(data);
    dispatch(detailsDelete(id));
  };
  const handleComplete = async (e) => {
    setGPAboxopen(true);
  };
  const handleUnMark = async (e) => {
    axios({
      method: "POST",
      url: `http://127.0.0.1:5000/maps/update_course_status/${course_id}`,
      data: { course_status: "registered", grade: null },
      withCredentials: true,
    }).then((response)=>{
      if(response.data.data == "Success"){
      dispatch(editCourseStatus(course_id, "registered" ,null))
      }
      else{
        alert(response.data.msg)
      }
    });
  };
  const handleGPAboxclose = () => {
    console.log("GPA Closes", GPAboxopen);
    setGPAboxopen(false);
  };
  const { details, course_details, student_course_details } = useSelector((state) => {
    const student_course_details = state.studentDetails.details?state.studentDetails.details.course_list.filter((course) => {
      return course.course_id === course_id;
    })[0]:null;
    return {
      course_details: state.studentDetails.course_details[course_id],
      details: state.studentDetails.details,
      student_course_details: student_course_details
    };
  });
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
                    <CourseNotesEditTextBox
                      course_id={course_id}
                      initialValue={
                        student_course_details.note
                          ? student_course_details.note.note
                            ? student_course_details.note.note
                            : "Enter Notes Here"
                          : "Enter notes here"
                      }
                    ></CourseNotesEditTextBox>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <p>Grade</p>
                  <div>
                {student_course_details.course_status==="completed"?(<CourseGPAEditTextBox
                      course_id={course_id}
                      initialValue={
                        student_course_details.course_grade
                          ? student_course_details.course_grade
                          : "NA"
                      }
                    />):(<div>NA</div>)}
                  </div>
                </Grid>
              </Grid>
              {student_course_details.course_status === "completed" ? (
                <Button onClick={handleUnMark}>UnMark</Button>
              ) : (
                <Button onClick={handleComplete}>Mark as Completed</Button>
              )}
              <GPAinput
                course_id={course_id}
                open={GPAboxopen}
                handleClose={handleGPAboxclose}
              />
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
