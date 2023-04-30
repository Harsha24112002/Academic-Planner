import * as React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import ProfilePage from '../Pages/ProfilePage';
import SpecializationPathsPage from '../Pages/SpecializationPathsPage';
import NotFoundPage from '../Pages/NotFoundPage';
import Header from '../Components/Header';
import MapsPage from '../Pages/MapsPage';
import { Modal } from '@mui/material';



export default function StudentRoutes() {

    const studentPages = ["profile", "maps", "specialization paths"];
    const studentLinks = {
        "profile": "/profile",
        "specialization paths": "/spPaths",
        "maps": "/maps",
    };

    return (
        <Router>
            <Routes>
                <Route path="/"  element={<Header pages={studentPages} tos={studentLinks}/>}>
                    <Route path='/' element={<MapsPage />}/>
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="spPaths" element={<SpecializationPathsPage />} />
                    <Route path="maps" element={<MapsPage />} />
                    <Route path="*" element={<NotFoundPage/>}/>
                </Route>
            </Routes>
        </Router>
    )
};