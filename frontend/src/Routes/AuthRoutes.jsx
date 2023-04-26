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
import ForgotPassword from '../Pages/ForgotPassword';
import ConfirmationPage from '../Pages/ConfirmationPage';

export default function AuthRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/student/signin" element={<SignInPage role={"student"}/>} />
                <Route path="/student/signup" element={<SignUpPage role={"student"}/>} />
                <Route path="/admin/signin" element={<SignInPage role={"admin"}/>} />
                <Route path="/forgot_password" element={<ForgotPassword role={"student"}/>}/>
                <Route path="/student/collect_new_details" element={<ConfirmationPage role={"student"}/>}/>                
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </Router>
    )
};