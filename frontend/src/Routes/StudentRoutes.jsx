import * as React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import ProfilePage from '../Pages/ProfilePage';
import SpecializationPathsPage from '../Pages/Admin/SpecializationPathsPage';
import NotFoundPage from '../Pages/NotFoundPage';
import Header from '../Components/Header';



export default function StudentRoutes() {

    const studentPages = ["profile", "maps", "specialization paths", "logout"];
    const studentLinks = {
        "profile": "/profile",
        "specialization paths": "/spPaths",
        "maps": "/maps",
    };

    return (
        <Router>
            <Routes>
                <Route path="/"  element={<Header pages={studentPages} tos={studentLinks}/>}>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="spPaths" element={<SpecializationPathsPage />} />
                    <Route path="*" element={<NotFoundPage/>}/>
                </Route>
            </Routes>
            
        </Router>
    )
};