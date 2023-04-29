import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { editNotes } from "../Actions/StudentDetailsActions";
// function CourseNotesEditTextBox({ course_id, initialNotesValue }) {
//   const [notesvalue, setNotesValue] = useState(initialNotesValue);
//   const [notesediting, setNotesEditing] = useState(false);

//   const [gradevalue, setGradeValue] = useState(initialGradeValue);
//   const [gradeediting, setGradeEditing] = useState(false);

//   const onNotesSave = async () => {
//     axios({
//       method: "POST",
//       url: `http://127.0.0.1:5000/maps/addnotes/${course_id}`,
//       data: { note: notesvalue },
//       withCredentials: true,
//     }).then(dispatch(editNotes(course_id, notesvalue)));
//   };
//   const onGradeSave = async () => {
//     axios({
//       method: "POST",
//       url: `http://127.0.0.1:5000/maps/update_grade/${course_id}`,
//       data: { grade: gradevalue },
//       withCredentials: true,
//     }).then(dispatch(editNotes(course_id, gradevalue)));
//   };

//   const onNotesCancel = () => {};
//   const onGradeCancel = () => {};
//   const handleNotesSave = () => {
//     onNotesSave();
//     setNotesEditing(false);
//   };

//   const handleGradeSave = () => {
//     onGradeSave();
//     setGradeEditing(false);
//   };
//   const handleNotesCancel = () => {
//     setNotesValue(initialNotesValue);
//     setNotesEditing(false);
//     onNotesCancel();
//   };
//   const handleGradeCancel = () => {
//     setGradeValue(initialGradeValue);
//     setGradeEditing(false);
//     onGradeCancel();
//   };
//   const handleNotesEdit = () => {
//     setNotesEditing(true);
//   };
//   const handleGradeEdit = () => {
//     if (student_course_details.course_status === "completed") {
//       setGradeEditing(true);
//     } else {
//       setGradeEditing(false);
//     }
//   };
//   const handleNotesChange = (event) => {
//     setNotesValue(event.target.value);
//   };
//   const handleGradeChange = (event) => {
//     setGradeValue(event.target.value);
//   };
//   return (
//     <div>
//       {editing ? (
//         <>
//           <Box
//             component="form"
//             sx={{
//               "& .MuiTextField-root": { m: 1, width: "25ch" },
//             }}
//             noValidate
//             autoComplete="off"
//           >
//             <div>
//               <TextField
//                 id="outlined-multiline-flexible"
//                 label="Notes"
//                 multiline
//                 maxRows={4}
//                 defaultValue={value}
//                 onChange={handleChange}
//               />
//             </div>
//           </Box>
//           <Button onClick={handleSave}>Save</Button>
//           <Button onClick={handleCancel}>Cancel</Button>
//         </>
//       ) : (
//         <>
//           <span onClick={handleEdit}>{value}</span>
//           <p class="helper-text"> Double click to edit </p>
//         </>
//       )}
//     </div>
//   );
// }

function CourseNotesEditTextBox({ course_id, initialValue }) {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();

  const onSave = (value, course_id) => {
    axios({
      method: "POST",
      url: `http://127.0.0.1:5000/maps/addnotes/${course_id}`,
      data: { note: value },
      withCredentials: true,
    }).then(dispatch(editNotes(course_id, value)));
  };

  const onCancel = () => {};
  const handleSave = () => {
    onSave(value, course_id);
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
}

export default CourseNotesEditTextBox;
