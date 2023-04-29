import React, { useEffect, useMemo, useState } from "react";
import { Box, TextField, Button, FormControl,InputLabel,MenuItem,Select } from "@mui/material";
import GPAinput from "./GPAinput";
import { useDispatch } from "react-redux";
import { Grades } from "./GPAinput";
import { editGrade } from "../Actions/StudentDetailsActions";
import axios from "axios";
function CourseGPAEditTextBox({ course_id, initialValue }) {
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  const onSave = (value, course_id) => {
    axios({
      method: "POST",
      url: `http://127.0.0.1:5000/maps/update_grade/${course_id}`,
      data: { grade: value },
      withCredentials: true,
    }).then(dispatch(editGrade(course_id, value)));
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
          <FormControl>
            <InputLabel id="GPA">Grade</InputLabel>
            <Select
              labelId="GPA"
              id="GPAhandler"
              value={value}
              onChange={handleChange}
            >
              {Grades.map((G) => (
                <MenuItem value={G}>{G}</MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default CourseGPAEditTextBox;
