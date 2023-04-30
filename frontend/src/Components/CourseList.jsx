import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import PaginationTable from "./Table";
import { CircularProgress } from "@mui/material";
import { fetchcoursesSearch } from "../Actions/StudentDetailsActions";

function CourseList() {
    const { details, loading, error } = useSelector((state) => ({
        details: state.studentDetails.course_details,
        loading: state.studentDetails.course_details_loading,
        error: state.studentDetails.error,
      }));

    return (
        
        <div>
        {
            loading?<CircularProgress/>:<PaginationTable courseInfo = {details} >{console.log("hi",details)}</PaginationTable>

        }
        </div>
    )
}

export default CourseList;
