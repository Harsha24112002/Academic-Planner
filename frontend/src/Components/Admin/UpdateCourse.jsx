import React from "react";
import SearchCourses from "../SearchCourses";
import AddCourse from "./CourseForm";
import { useSelector } from "react-redux";

function UpdateCourse() {
  //   const [coursesSearch, setcoursesSearch] = useState({});
  const { details } = useSelector((state) => {
    console.log("AAAAA",state.courseDetails.details, Object.keys(state.courseDetails.details).length);
    return {
      details: state.courseDetails.details,
    };
  });

  return (
    <div>
      <SearchCourses />

      {Object.keys(details).length != 0 ? (
        <AddCourse courseDetails={details} type="update" />
      ) : (
        <h1>Wait chey</h1>
      )}
    </div>
  );
}

export default UpdateCourse;
