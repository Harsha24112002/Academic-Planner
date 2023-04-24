import * as React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Header from '../Components/Header';
import Courses from '../Pages/Admin/Courses';
import SpecializationPathsPage from '../Pages/Admin/SpecializationPathsPage';
import NotFoundPage from '../Pages/NotFoundPage'; 

export default function AdminRoutes() {

    const adminPages = ["courses", "specialization paths"];
    const adminLinks = {
        "courses": "/courses",
        "specialization paths": "/spPaths",
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Header pages={adminPages} tos={adminLinks}/>}>
                    <Route path="courses" element={<Courses/>} />
                    <Route path="spPaths" element={<SpecializationPathsPage/>} />
                    <Route path="*" element={<NotFoundPage/>} />
                </Route>
            </Routes>
        </Router>
    )
};
