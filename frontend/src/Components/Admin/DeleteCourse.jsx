import React from 'react'
import SearchCourses from '../SearchCourses'
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import axios from 'axios';

function DeleteCourse() {
  const { course_id } = useSelector((state) => {
    console.log("AAAAA", state.courseDetails.details);
    return {
      details: state.courseDetails.details.course_id,
    };
  });

  const handleDelete = () =>{
    console.log("delete",course_id);
    
  }
  
  return (
    <>
      <SearchCourses />
      <Button onClick={handleDelete}>Delete</Button>
    </>
  )
}

export default DeleteCourse