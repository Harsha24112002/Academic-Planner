import React, { useState } from "react";
import "../css/Shapes.css";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  detailsDelete,
  StudentDetailsDelete,
} from "../Actions/StudentDetailsActions";
import CourseDetails from "./CourseDetails";
import { AddCourse, RemoveCourse } from "../features/GPAcourses";
import ExpectedGrade from "./ExpectedGrade";
const boxStyle = {
  border: "grey solid 2px",
  borderRadius: "10px",
  padding: "5px",
};

function SemBox({ sem, mode }) {
  const { details, courseDetails, loading2 } = useSelector((state) => ({
    details: state.studentDetails.details,
    courseDetails: state.studentDetails.course_details,
    loading2: state.studentDetails.loading2,
  }));
  const dispatch = useDispatch();
  const [open, setopen] = useState(false);
  const [expectedOpen, setExpectedOpen] = useState(false);
  const [courseId, setcourseId] = useState("");
  const { selectedCourses, expectedGrades } = useSelector((state) => {
    return{
      selectedCourses: state.gpaCourses.selectedCourses,
      expectedGrades: state.gpaCourses.expectedGrades
    }
  })

  function update_state(payload) {
    dispatch(AddCourse(payload));
  };

  const handleopen = (e) => {
    if (mode) {
      const course_id = e.target.textContent;
      const student_course_details = details.course_list
        ? details.course_list.filter((course) => {
            return course.course_id === course_id;
          })[0]
        : {};
      if (selectedCourses[course_id] || false === true) {
        const payload = {
          course_id: course_id,
          course_grade: expectedGrades[course_id],
          course_credits: courseDetails
            ? courseDetails[course_id].course_credits
            : 0,
        };
        dispatch(RemoveCourse(payload));
      } else {
        if (student_course_details.course_status === "completed") {
          const payload = {
            course_id: course_id,
            course_grade: details.course_list
              ? details.course_list.filter((course) => {
                  return course.course_id === course_id;
                })[0].course_grade
              : 0,
            course_credits: courseDetails
              ? courseDetails[course_id].course_credits
              : 0,
          };
          update_state(payload);
        } else {
          setcourseId(course_id);
          setExpectedOpen(true);
        }
      }
    } else {
      setcourseId(e.target.textContent);
      setopen(true);
    }
  };
  const handleclose = () => {
    setopen(false);
  };
  const handleExpectedClose = () => {
    setExpectedOpen(false);
  };
  function getCoursesBySemester(sem) {
    var ret = [];
    if (!details.course_list) {
      return ret;
    }
    const sz = details.course_list.length;
    for (let i = 0; i < sz; i++) {
      if (details.course_list[i].registered_sem == sem) {
        console.log("DETAILSSSSS", details.course_list[i]);
        ret.push([
          details.course_list[i].course_id,
          details.course_list[i].met_prerequisite_flag,
          "Incomplete Prerquisites: " +
            details.course_list[i].incomplete_prerequisites.join(", "),
        ]);
      }
    }
    return ret;
  }
  // Should write map based on registered sem
  //   const courses = ((courses))
  return (
    <Container
      sx={{
        bgcolor: "lightgrey",
        minHeight: "495px",
        padding: "20px 0px 20px 0",
        margin: "20px 20px 20px 0",
        minWidth: "145px",
      }}
    >
      <Box
        sx={{
          bgcolor: "black",
          color: "whitesmoke",
          marginBottom: "15px",
        }}
      >
        Semester {sem}
      </Box>
      <div>
        <Xwrapper>
          {details ? (
            <>
              {getCoursesBySemester(sem).map((obj) => {
                if (obj[1]) {
                  if (selectedCourses[obj[0]] && mode) {
                    return (
                      <button
                        className="circle3 text selected"
                        id={obj[0]}
                        onClick={handleopen}
                      >
                        {obj[0]}
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className="circle3 text"
                        id={obj[0]}
                        onClick={handleopen}
                      >
                        {obj[0]}
                      </button>
                    );
                  }
                } else {
                  return (
                    <Tooltip title={obj[2]}>
                      {selectedCourses[obj[0]] && mode ? (
                        <button
                          className="circle3 text error selected"
                          id={obj[0]}
                          onClick={handleopen}
                        >
                          {obj[0]}
                        </button>
                      ) : (
                        <button
                          className="circle3 text error"
                          id={obj[0]}
                          onClick={handleopen}
                        >
                          {obj[0]}
                        </button>
                      )}
                    </Tooltip>
                  );
                }
              })}
              {open ? (
                <CourseDetails
                  open={open}
                  course_id={courseId}
                  handleClose={handleclose}
                />
              ) : (
                <></>
              )}
            </>
          ) : (
            <h1>Hello</h1>
          )}
        </Xwrapper>
      </div>
      {expectedOpen ? (
        <ExpectedGrade
          open={expectedOpen}
          handleClose={handleExpectedClose}
          update_state={update_state}
          course_id={courseId}
        />
      ) : (
        <></>
      )}
    </Container>
  );
}

export default SemBox;
