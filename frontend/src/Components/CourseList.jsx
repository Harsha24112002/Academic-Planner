import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import PaginationTable from "./Table";
import { CircularProgress } from "@mui/material";
import { fetchCourseDetails } from "../Actions/StudentDetailsActions";

function CourseList() {
    const { details, loading, error } = useSelector((state) => ({
        details: state.studentDetails.details,
        loading: state.studentDetails.loading,
        error: state.studentDetails.error,
      }));

    return (
        
        <div>
        {
            loading?<CircularProgress/>:<PaginationTable courseInfo = {details["course_list"]} ></PaginationTable>
        }
        </div>
    )
}

export default CourseList;
