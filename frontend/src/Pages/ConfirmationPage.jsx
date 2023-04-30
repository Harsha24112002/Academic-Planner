import React, { useState, setState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import '../css/ConfirmationPage.css'

export default function ConfirmationPage() {

	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [formErrors, setFormErrors] = useState({});
	const [isSubmit, setIsSubmit] = useState(false);

	const nav = useNavigate();

	const handleInputChange = (e) => {
		const { id, value } = e.target;

		if (id === "email") {
			setEmail(value);
		}

		if (id === "otp") {
			setOtp(value);
		}

		if (id === "password") {
			setPassword(value);
		}

		if (id === "confirmPassword") {
			setConfirmPassword(value);
		}

	}

	useEffect(() => {
		// console.log(formErrors)
		if (Object.keys(formErrors).length === 0 && isSubmit) {
			console.log("Form is valid");

			const formData = new FormData();
			formData.append("email", email);
			formData.append("otp", otp);
			formData.append("password", password);

			axios({
				method:"POST",
				url : "http://127.0.0.1:5000/authentication/student/forgot_password/new_details", 
				data : formData, 
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				withCredentials:true
			})
			.then((response) => {
				console.log(response);
				nav("/student/signin");
			})
			.catch((error) => {
				console.log(error);
			});
		}
	}, [formErrors]);

	const validate = () => {
		const errors = {};

		if(!email) {
			errors.mail_error = 'Email address is required'
		}

		if(!/\S+@\S+\.\S+/.test(email)) {
			errors.mail_error = 'Email address is invalid'
		}

		if(!email.includes('iith.ac.in')) {
			errors.mail_error = 'Email address must be an iith.ac.in domain'
		}

		if (otp === "") {
			errors.otp = "OTP is required";
		}

		if (password === "") {
			errors.password = "Password is required";
		}

		if (confirmPassword === "") {
			errors.confirmPassword = "Confirm Password is required";
		}

		if(password !== confirmPassword) {
			errors.confirmPassword = "Passwords do not match";
		}

		if (password && password.length < 6) {
			errors.password = "Password must be at least 6 characters !";
		}

		return errors;
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormErrors(validate());
		setIsSubmit(true);
	}


	return (
		<div class="confirmation-page">
			<div class="form">
				<form class="forgotPasswordForm">
				{/* <input type="text" placeholder="OTP"/> */}
				<label for="email">Email</label>
				<input className="email" type="text" id="email" name="email" placeholder="Enter EMAIL" onChange={(event) => handleInputChange(event)}/>   
				<br/>
				{formErrors.mail_error && <p>{formErrors.mail_error}</p>}
			

				<label for="otp">OTP</label>
				<input className="otp" type="text" id="otp" name="otp" placeholder="Enter OTP" onChange={(event) => handleInputChange(event)}/>   
				<br/>
				{formErrors.otp && <p>{formErrors.otp}</p>}
			
				<label for="password">Password</label>
				<input className="password" type="password" id="password" name="pasword" placeholder="New Password" onChange={(event) => handleInputChange(event)}/>   
				<br/>
				{formErrors.password && <p>{formErrors.password}</p>}

				<label for="confirm password">Confirm Password</label>
				<input className="password" type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" onChange={(event) => handleInputChange(event)}/>   
				<br/>
				{formErrors.confirmPassword && <p>{formErrors.confirmPassword}</p>}

				<br/>
				<button type="submit" onClick={(event) => handleSubmit(event)}>Submit</button>
				<p class="message">Not registered? <a href="/student/signup">Create an account</a></p>
				</form>
			</div>
		</div>
	)
}