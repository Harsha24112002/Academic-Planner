import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import PaginationTable from "./Table";
import { CircularProgress } from "@mui/material";
import { fetchcoursesSearch } from "../Actions/StudentDetailsActions";

function CourseList() {
    const { details, course_details, loading, error } = useSelector((state) => ({
        details: state.studentDetails.details.course_list,
        loading: state.studentDetails.course_details_loading,
        course_details: state.studentDetails.course_details,
        error: state.studentDetails.error,
      }));

    return (
        
        <div>
        {
            loading?<CircularProgress/>:<PaginationTable ></PaginationTable>
        }
        </div>
    )
}

export default CourseList;
