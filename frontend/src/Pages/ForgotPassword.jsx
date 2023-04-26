import React, { useState, setState, useEffect } from "react";
import '../css/ForgotPassword.css'
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export default function ForgotPassword() {

	const [email, setEmail] = useState("");
	const [formErrors, setFormErrors] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);
	const nav = useNavigate();

	const handleInputChange = (event) => {
		setEmail(event.target.value);
	}

	const validate = () => {
		const errors = {}

		if(!email) {
			errors.mail_error = 'Email address is required'
		}

		if(!/\S+@\S+\.\S+/.test(email)) {
			errors.mail_error = 'Email address is invalid'
		}

		if(!email.includes('iith.ac.in')) {
			errors.mail_error = 'Email address must be an iith.ac.in domain'
		}

		return errors
	}

	useEffect(() => {
		// console.log(formErrors)
		if (Object.keys(formErrors).length === 0 && isSubmit) {
		
			const formData = new FormData();
			formData.append("email", email);
	
			console.log(formData);
	
			axios.post("http://127.0.0.1:5000/authentication/student/forgot_password", formData, {
				headers: {
					"Content-Type": "multipart/form-data" // set content type header
				}
			})
				.then((Response) => {
					console.log(Response)
					if(Response.status === 200) {
						nav("/student/collect_new_details");
					}
				})
				.then((data) => console.log(data))
				.catch((error) => console.log(error));
			}
		}
	  )

	const handleSubmit = (event) => {
		event.preventDefault();
		const errors = validate();
		setFormErrors(errors);
		if(Object.keys(errors).length === 0) {
			console.log('Form is valid')
			setIsSubmit(true);
		} else {
			console.log('Form is invalid')
		}
	}

	return (
		<div>
			<h1>Forgot your password?</h1>
      			<hr></hr>
      			<h3>Enter your registered email address to reset your password</h3>
      
      			<form className="forgotPasswordForm">
        			<label for="mail">Email</label>
        			<input className="forgotPasswordInput" type="email" id="name" name="name" placeholder="Enter your email address" onChange={(event) => handleInputChange(event)}/>   
					<br></br>
					{formErrors.mail_error && <span id="nameError">{formErrors.mail_error}</span>}
					<br></br>
      				<button type="submit" onClick={(event) => handleSubmit(event)}>Submit</button>
  					{/* <span id="nameError">There was an error with your email</span> */}
      			</form>  
		</div>
	)
}