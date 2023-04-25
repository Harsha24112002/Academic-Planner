import * as React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { signin, updaterole } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Typography, TextField } from '@mui/material';
import '../css/SignInPage.css'

export default function SignInPage({role}) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    const dispatch = useDispatch();
    dispatch(updaterole({
        role: role,
    }))

    const nav = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password',password);

        axios({
            method: "POST",
            url: `http://127.0.0.1:5000/authentication/login/${role}`,
            data: formData
        }).then((response) => {
            console.log(response);
            nav("/");
            dispatch(signin());
        }).catch((error) => {
            if(error.response) {
                setError(true);
                setErrorMessage(error.response.data.message);
                // console.log("ok1",error.response)
                // console.log("ok2",error.response.status)
                // console.log("ok3",error.response.headers)
            }
        })
        return;
    };

    return (

        <div className="signin-page-container">
            <div className='signin-page-box'>
                <h3>Sign In</h3>
                <form 
                    onSubmit={handleSubmit}
                    className='signin-page-form'
                >   
                    <div
                        className='signin-page-form-details'
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'left',
                        }}
                    >
                        <label>email</label>
                        <input
                            value={email}
                            type="email"
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label>password</label>
                        <input
                            value={password}
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div
                        className='signin-page-form-submit'
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <input 
                            type="submit" 
                            value="Sign In"
                        />
                    </div>
                </form>
                <div className='signin-page-links'>
                    <Link to="" style={{color:'black'}}>
                        Forgot Password?
                    </Link>
                    {role==="student" && 
                        <Link to="/student/signup" style={{color:'black'}}>
                            New User?
                        </Link>
                    }
                </div>
                <div className='signin-page-error-box'>
                    {error && 
                        <Box
                            sx={{
                                display:'flex',
                                flexDirection: 'row'
                            }}
                        >
                            <Typography>{errorMessage}</Typography>
                            <Button 
                                variant='outlined'
                                onClick={()=>setError(false)}
                                color='error'
                                size='small'
                            >
                                OK!
                            </Button>
                        </Box>
                    }
                </div>
            </div>
        </div>
    )
};