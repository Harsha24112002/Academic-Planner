import React from "react";
import "../css/Shapes.css";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";
import { Box, Container, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const boxStyle = {
  border: "grey solid 2px",
  borderRadius: "10px",
  padding: "5px",
};

// const DraggableBox = ({ id, classname }) => {
//   const updateXarrow = useXarrow();
//   return (
//     <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
//       <div id={id} className={classname}>
//         <div className="text">{id}</div>
//       </div>
//     </Draggable>
//   );
// };

function SemBox({ sem }) {
  const {details} = useSelector((state) => ({
    details: state.studentDetails.details,
  }));

  function getCoursesBySemester(sem) {
    var ret = [];
    console.log(details,sem)
    if (!details.course_list) {
      return ret;
    }
    const sz = details.course_list.length;
    for (let i = 0; i < sz; i++) {
      if (details.course_list[i].registered_sem == sem) {
        ret.push(details.course_list[i].course_id);
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
          {getCoursesBySemester(sem).map((course) => {
            return (
              <div className="circle3" id={course}>
                <div className="text">{course}</div>
              </div>
            );
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
