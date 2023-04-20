import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDetails,
  fetchEditDetails,
} from "../Actions/StudentDetailsActions";
import SemBox from "../Components/SemBox";
import { Grid, Button, Modal, Dialog, DialogTitle } from "@mui/material";
import "../css/Shapes.css";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { fetchStudentCourses } from "../Actions/StudentCoursesActions";
import SearchCourses from "../Components/SearchCourses";
function MapsPage() {
  const { details, loading, error } = useSelector((state) => ({
    details: state.studentDetails.details,
    loading: state.studentDetails.loading,
    error: state.studentDetails.error,
  }));

  const { studentCourses, loading2 } = useSelector((state) => ({
    studentCourses: state.studentCourses.details,
    loading2: state.studentCourses.loading,
  }));
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDetails());
  }, []);

  useEffect(() => {
    if (loading != true) {
      const course_ids = details.course_list.map((obj) => obj.course_id);
      dispatch(fetchStudentCourses({ courses: course_ids }));
    }
  }, [loading]);

  function getCoursesBySemester(id) {
    var ret = [];
    const sz = details.course_list.length;
    for (let i = 0; i < sz; i++) {
      if (details.course_list[i].registered_sem == id) {
        ret.push(details.course_list[i].course_id);
      }
    }
    console.log(id, ret);
    return ret;
  }

  function getCoursePrerequisites() {
    const course_prereq = [];
    const course_ids = details.course_list.map((obj) => obj.course_id);
    for (const [key, value] of Object.entries(studentCourses)) {
      const len = value["course_prerequisites"].length;
      for (let i = 0; i < len; i++) {
        if (course_ids.includes(value["course_prerequisites"][i])) {
          course_prereq.push([key, value["course_prerequisites"][i]]);
        }
      }
    }
    console.log(course_prereq);
    return course_prereq;
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const sems = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div style={{overflowX:"hidden"}}>
      <SearchCourses />
      <Button onClick={handleOpen}>Register</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        // onClose={handleClose}
      >
        <DialogTitle>Select Course</DialogTitle>
        {/* <List>
          {loading ? (
            <CircularProgress />
          ) : (
            coursesDetails.map((course, i) => (
              <ListItem key={i} disableGutters>
                <ListItemButton key={i} onClick={handleListItemButtonClick}>
                  {course[0]}
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List> */}
      </Dialog>
      {loading ? (
        <h1>Loading{console.log("laoding2")}</h1>
      ) : (
        <div>
        <Grid
          container
          direction="row"
          wrap="nowrap"
          spacing={10}
          overflowX="auto"
          margin={"0px"}
          padding={"0px 150px 0px 0px"}
          maxWidth={"false"}
          style={{ overflowX: "auto"}}
        >
          {sems.map((sem) => {
            return (
              <Grid item>
                <SemBox sem={sem} />
              </Grid>
            );
          })}
          {loading2 ? (
            <></>
          ) : (
            <>
              {getCoursePrerequisites().map((obj) => {
                return (
                  <div style={{ position: "relative" }}>
                    <Xarrow
                      start={obj[0]}
                      end={obj[1]}
                      lineColor={"black"}
                      strokeWidth={2}
                      scrollZoom={false}
                      style={{ position: "absolute", top: 0, left: 0 }}
                    />
                  </div>
                );
              })}
            </>
          )}
        </Grid>
        </div>
      )}
      <div>
      <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, magnam fuga. Hic fugit officia aliquid molestias alias modi labore? Magni minus omnis non unde dolor quo velit ea corporis architecto! </p>
      </div>
    </div>
  );
}

export default MapsPage;
