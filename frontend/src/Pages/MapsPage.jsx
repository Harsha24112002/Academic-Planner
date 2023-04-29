import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDetails,
  fetchEditDetails,
  fetchStudentCourses
} from "../Actions/StudentDetailsActions";
import SemBox from "../Components/SemBox";
import {
  Grid,
  Button,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText 

} from "@mui/material";
import "../css/Shapes.css";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import SearchCourses from "../Components/SearchCourses";
import CourseForm from "../Components/Admin/CourseForm";
import CourseRegistrationDialog from "../Components/CourseRegistrationDialog";
import CreditsCount from "../Components/CreditsCount";

function MapsPage() {
  const { details, loading, error } = useSelector((state) => ({
    details: state.studentDetails.details,
    loading: state.studentDetails.details_loading,
    error: state.studentDetails.error
  }));
  const [mode,setmode] = useState(false)
  const reg_course_details = useSelector((state) => {
    return state.courseDetails.details;
  });

  const { studentCourses, loading2 } = useSelector((state) => ({
    studentCourses: state.studentDetails.course_details,
    loading2: state.studentDetails.course_details_loading,
  }));

  const { weightedsum, creds_count} = useSelector((state) => {
    return {
    weightedsum: state.gpaCourses.weightedsum,
    creds_count: state.gpaCourses.total_creds
  }})
  const handleModeChange = () => {
    if(mode){
      setmode(false);
    }
    else{
      setmode(true);
    }
  }
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDetails());
  }, []);

  useEffect(() => {
    if (loading != true && details.course_list) {
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
    <div style={{ padding: "20px 0px 0px 0px" }}>
      <SearchCourses />
      <Button onClick={handleOpen}>Register</Button>
      <CourseRegistrationDialog open={open} handleClose={handleClose}/>   
      {mode?(<div>{creds_count!=0?weightedsum/creds_count:"NA"}</div>):(<></>)}
      <Button onClick={handleModeChange}> {!mode?"GPA calculation":"View Courses"} </Button>
      {loading ? (
        <h1>Loading{console.log("laoding2")}</h1>
      ) : (
        <div>
          <Grid
            container
            direction="row"
            wrap="nowrap"
            spacing={10}
            // overflowX="auto"
            padding={"0px 100px 0px 25px"}
            maxWidth={"false"}
            // style={{ overflowX: "auto" }}
          >
            {!mode?
            sems.map((sem) => {
              return (
                <Grid item>
                  <SemBox sem={sem} />
                </Grid>
              );
            }):
            sems.map((sem)=> {
              return (
                <Grid item>
                  <SemBox mode={mode} sem={sem} />
                </Grid>
              );
            })
          }
            {loading2 ? (
              <></>
            ) : (
              <>
                {getCoursePrerequisites().map((obj) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <Xarrow
                        start={obj[1]}
                        end={obj[0]}
                        startAnchor={"auto"}
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
          <CreditsCount details={details}/>
        </div>
      )}
      <div>
        <p>
          {" "}
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi,
          magnam fuga. Hic fugit officia aliquid molestias alias modi labore?
          Magni minus omnis non unde dolor quo velit ea corporis architecto!{" "}
        </p>
      </div>
    </div>
  );
}

export default MapsPage;
