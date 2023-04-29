import React from "react";
import SearchCourses from "../SearchCourses";
import CourseForm from "./CourseForm";
import { useSelector } from "react-redux";

function UpdateCourse() {
  //   const [coursesSearch, setcoursesSearch] = useState({});
  const { details } = useSelector((state) => {
    console.log("AAAAA",state.courseDetails.details);
    return {
      details: state.courseDetails.details,
    };
  });

  return (
    <div>
      <SearchCourses />

      {Object.keys(details).length != 0 ? (
        <CourseForm courseDetails={details} type="update" />
      ) : (
       <></>
      )}
    </div>
  );
}

export default UpdateCourse;
