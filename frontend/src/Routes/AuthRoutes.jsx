import * as React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import HomePage from '../Pages/HomePage';
import SignInPage from '../Pages/SignInPage'
import SignUpPage from '../Pages/SignUpPage';
import NotFoundPage from '../Pages/NotFoundPage';

export default function AuthRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/student/signin" element={<SignInPage role={"student"}/>} />
                <Route path="/student/signup" element={<SignUpPage role={"student"}/>} />
                <Route path="/admin/signin" element={<SignInPage role={"admin"}/>} />
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </Router>
    )
};