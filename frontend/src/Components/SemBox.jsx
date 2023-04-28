import React from "react";
import "../css/Shapes.css";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";
import { Box, CircularProgress, Container, Typography, Button, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { detailsDelete, StudentDetailsDelete } from "../Actions/StudentDetailsActions";
const boxStyle = {
  border: "grey solid 2px",
  borderRadius: "10px",
  padding: "5px",
};

function SemBox({ sem }) {
  const {details} = useSelector((state) => ({
    details: state.studentDetails.details,
  }));
  const dispatch = useDispatch();
  const handleDeregister = async (e) => {
    const id = e.target.id;
    // const response = axios.delete(
    //   `http://127.0.0.1:5000/maps/deregister/${id}`,
    //   { withCredentials: true }
    // );

    const response = axios({
      method: "DELETE",
      url: `http://127.0.0.1:5000/maps/deregister/${id}`,
      withCredentials: true
    });

    const data = (await response).data;
    alert(data);
    dispatch(detailsDelete(id));
  }
  function getCoursesBySemester(sem) {
    var ret = [];
    if (!details.course_list) {
      return ret;
    }
    const sz = details.course_list.length;
    for (let i = 0; i < sz; i++) {
      if (details.course_list[i].registered_sem == sem) {
        console.log("DETAILSSSSS",details.course_list[i]);
        ret.push([details.course_list[i].course_id,details.course_list[i].met_prerequisite_flag,
          "Incomplete Prerquisites: "+details.course_list[i].incomplete_prerequisites.join(", ")]);
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
          marginBottom: "15px"
        }}
      >
        Semester {sem}
      </Box>
      <div>
        <Xwrapper>
          {details
          ?
          <>          
          {getCoursesBySemester(sem).map((obj) => {
            if(obj[1]){
            return (
              <button className="circle3 text" id={obj[0]} onClick={handleDeregister}>
                {obj[0]}
              </button>
            );
            }
            else{
              return (
                <Tooltip title={obj[2]}>
                <button className="circle3 error text" id={obj[0]} onClick={handleDeregister}>
                  {obj[0]}
                </button>
              </Tooltip>
              );
            }
          })}
          </>
          :
          (<h1>Hello</h1>)
        }
        </Xwrapper>
      </div>
      
    </Container>
  );
}

export default SemBox;
