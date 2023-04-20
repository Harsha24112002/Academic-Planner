import React from "react";
import Tabs from "../../Components/Tabs";
import AddCourse from "../../Components/Admin/CourseForm";
import UpdateCourse from "../../Components/Admin/UpdateCourse";
import DeleteCourse from "../../Components/Admin/DeleteCourse";
const components = [<AddCourse type="add"/>, <UpdateCourse />, <DeleteCourse />];
const labels = ["Add Course", "Update Course", "Delete Course"];

function Courses() {
  return (
    <Tabs components={components} labels={labels}/>
  )
}

export default Courses;
