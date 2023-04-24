import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { signin, updaterole } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignInPage({role}) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const dispatch = useDispatch();
    dispatch(updaterole({
        role: role,
    }))

    const nav = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (role === "student") {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password',password);

            axios({
                method: "POST",
                url: "http://127.0.0.1:5000/authentication/login/student",
                data: formData
            }).then((response) => {
                console.log(response)
            }).catch((error) => {
                if(error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
            console.log("Student logged in Successfully for now")
        } else if (role === "admin") {
            // call to /admin/login
            console.log("Admin logged in Successfully for now")
        } else {
            // role not selected! prompt
        }
        
        nav("/");
        dispatch(signin());
    };

    return (
        <div className="Sign In Form">
            <h1>{role} Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    email :
                    <input
                        value={email}
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    password :
                    <input
                    value={password}
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                    />
                </label>
                <input type="submit" value="Sign In"/>
            </form>
            {role==="student" && 
                <Link to="/student/signup">
                    New User?
                </Link>
            }
        </div>
    )
};