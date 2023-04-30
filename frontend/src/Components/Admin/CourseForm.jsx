import React, { useEffect } from "react";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import { useFormControl } from "@mui/material/FormControl";
import { FormControl, MenuItem, Select } from "@mui/material";
import { Input } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormHelperText } from "@mui/material";
import { deleteDetails } from "../../features/courseDetailsSlice";
import { useDispatch } from "react-redux";

const fileTypes = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"];

function CourseForm({ courseDetails, type }) {

	const [CourseName, setCourseName] = useState(
		courseDetails ? courseDetails.course_name : ""
	);

	

	const [CourseId, setCourseId] = useState(
		courseDetails ? courseDetails.course_id : ""
	);
	const [CourseInstructor, setCourseInstructor] = useState(
		courseDetails ? courseDetails.course_instructor : ""
	);
	const [CourseSlot, setCourseSlot] = useState(
		courseDetails ? courseDetails.course_slot : ""
	);
	const [CourseSem, setCourseSem] = useState(
		courseDetails ? courseDetails.course_sem : ""
	);
	const [CoreElective, setCoreElective] = useState(
		courseDetails ? courseDetails.core_elective : ""
	);
	const [CoursePrerequisites, setCoursePrerequisites] = useState(
		courseDetails ? courseDetails.course_prerequisites : []
	);

	const [CourseCredit, setCourseCredit] = useState(
		courseDetails ? courseDetails.course_credits : 1
	);

	useEffect(()=>{
		setCourseName(state=>courseDetails ? courseDetails.course_name : "")
		setCourseId(state=>courseDetails ? courseDetails.course_id : "")
		setCourseInstructor(state=>courseDetails ? courseDetails.course_instructor : "")
		setCourseSlot(state=>courseDetails ? courseDetails.course_slot : "")
		setCourseSem(state=>courseDetails ? courseDetails.course_sem : "")
		setCoreElective(state=>courseDetails ? courseDetails.core_elective : "")
		setCourseCredit(state=>courseDetails ? courseDetails.course_credits : 1)
	},[courseDetails])


	const dispatch = useDispatch();

	const [errors, setErrors] = useState([]);
	const [CourseNameError, setCourseNameError] = useState(false);
	const [CourseIdError, setCourseIdError] = useState(false);
	const [CourseInstructorError, setCourseInstructorError] = useState(false);
	const [CourseSlotError, setCourseSlotError] = useState(false);
	const [CourseSemError, setCourseSemError] = useState(false);
	const [CourseCreditError, setCourseCreditError] = useState(false);
	const course_credits_arr = [1, 2, 3];

	const [CoreElectiveError, setCoreElectiveError] = useState(false);

	const [uploadError, setUploadError] = useState({});
	const [file, setFile] = useState([]);

	const handleCourseNameChange = (event) => {
		setCourseName(event.target.value);
	};

	const handleCourseIdChange = (event) => {
		setCourseId(event.target.value);
	};

	const handleCourseInstructorChange = (event) => {
		setCourseInstructor(event.target.value);
	};

	const handleCourseSlotChange = (event) => {
		setCourseSlot(event.target.value);
	};

	const handleCourseSemChange = (event) => {
		setCourseSem(event.target.value);
	};

	const handleCoreElectiveChange = (event) => {
		setCoreElective(event.target.value);
	};

	const handleCourseCreditChange = (event) => {
		setCourseCredit(event.target.value);
	};

	const handleCoursePrerequisitesChange = (event) => {
		const course_list = event.target.value.split("\n");
		// console.log(course_list);
		setCoursePrerequisites(course_list);
	};

	const handleCourseNameBlur = () => {
		if (CourseName == "") {
			setCourseNameError(true);
		} else {
			setCourseNameError(false);
		}
	};
	const handleCourseIdBlur = () => {
		if (CourseId == "") {
			setCourseIdError(true);
		} else {
			setCourseIdError(false);
		}
	};
	const handleCourseInstructorBlur = () => {
		if (CourseInstructor == "") {
			setCourseInstructorError(true);
		} else {
			setCourseInstructorError(false);
		}
	};
	const handleCourseSlotBlur = () => {
		if (CourseSlot == "") {
			setCourseSlotError(true);
		} else {
			setCourseSlotError(false);
		}
	};

	const handleCourseCreditBlur = () => {
		if (CourseCredit == 0) {
			setCourseCreditError(true);
		} else {
			setCourseCreditError(false);
		}
	};

	const handleCourseSemBlur = () => {
		if (CourseSem == "") {
			setCourseSemError(true);
		} else {
			setCourseSemError(false);
		}
	};
	const handleCoreElectiveBlur = () => {
		if (CoreElective == "") {
			setCoreElectiveError(true);
		} else {
			setCoreElectiveError(false);
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file && fileTypes.includes(file.type)) {
			setFile(file);
			setUploadError({});
		} else {
			setFile(null);
			setUploadError({
				error: true,
				message: "Please select an excel or csv file",
			});
		}
	}
	const handleSubmit = async (event) => {
		// console.log(CourseNameError)
		// event.preventDefault();
		const fieldsAreEmpty = CourseName == "" || CourseId == "" || CourseInstructor == "" || CourseSlot == "" || CourseSem == "" || CoreElective == "";
		const isFileEmpty = file.length == 0;

		if (fieldsAreEmpty && isFileEmpty) {
			setErrors([{ loc: [1], msg: "Input all the required fields or Upload a file" }]);
		} else {
			const formdata = {
				course_name: CourseName,
				course_id: CourseId,
				course_instructor: CourseInstructor,
				course_slot: CourseSlot,
				course_sem: CourseSem,
				core_elective: CoreElective,
				course_prerequisites: CoursePrerequisites,
				course_credits: CourseCredit
			};

			var response = null;

			if (fieldsAreEmpty) {
				const formData = new FormData();
				formData.append("file", file);
				response = axios({
					method: "POST",
					url: `http://127.0.0.1:5000/admin/uploadfile/${CourseId}`,
					data: formData,
					withCredentials: true
				});
			} else {
				response =
					type == "add"
						? axios({
							method: "POST",
							url: "http://127.0.0.1:5000/admin/addcourse",
							data: formdata,
							withCredentials: true
						})
						: axios({
							method: "PUT",
							url: `http://127.0.0.1:5000/admin/updatecourse/${formdata.course_id}`,
							data: formdata,
							withCredentials: true
						});
			}

			const data = (await response).data;
			// console.log(data);
			if (data.success) {
				// Redirect to the success page
				console.log("AAAAAAAAAAAA", data)
				dispatch(deleteDetails());
				
			} else {
				// console.log("AAAAAAAAAAAA",data)
				setErrors(data.errors);
			}
		}
	};

	return (
		<div>
			<Box
				component="form"
				sx={{
					"& > :not(style)": { m: 2 },
					border: "solid",
				}}
				autoComplete
				autoCapitalize
			>
				{errors.map((error) => (
					<div key={error.loc.join("-")}>{error.msg}</div>
				))}

				<TextField
					id="Name"
					label="Course Name"
					variant="outlined"
					required="true"
					onChange={handleCourseNameChange}
					onBlur={handleCourseNameBlur}
					error={CourseNameError}
					helperText={CourseNameError ? "This field is required" : ""}
					defaultValue={CourseName}
					value={CourseName}
					InputProps={{
						readOnly: type == "see",
					  }}
				/>
				<TextField
					id="ID"
					label="Course ID"
					variant="outlined"
					required="true"
					onChange={handleCourseIdChange}
					onBlur={handleCourseIdBlur}
					error={CourseIdError}
					helperText={CourseIdError ? "This field is required" : ""}
					defaultValue={CourseId}
					value={CourseId}
					InputProps={{
						readOnly: type == "see",
					  }}
				/>
				<br />
				<TextField
					id="Instructor"
					label="Course Instructor"
					variant="outlined"
					required="true"
					onChange={handleCourseInstructorChange}
					onBlur={handleCourseInstructorBlur}
					error={CourseInstructorError}
					helperText={CourseInstructorError ? "This field is required" : ""}
					defaultValue={CourseInstructor}
					value={CourseInstructor}
					InputProps={{
						readOnly: type == "see",
					  }}
				/>

				<TextField
					id="Course Slot"
					label="Course Slot"
					variant="outlined"
					required="true"
					onChange={handleCourseSlotChange}
					onBlur={handleCourseSlotBlur}
					error={CourseSlotError}
					helperText={CourseSlotError ? "This field is required" : ""}
					defaultValue={CourseSlot}
					value={CourseSlot}
					InputProps={{
						readOnly: type == "see",
					  }}
				/>
				<br />
				<TextField
					id="Course Sem"
					label="Course Sem"
					variant="outlined"
					required="true"
					onChange={handleCourseSemChange}
					onBlur={handleCourseSemBlur}
					error={CourseSemError}
					helperText={CourseSemError ? "This field is required" : ""}
					defaultValue={CourseSem}
					value={CourseSem}
					InputProps={{
						readOnly: type == "see",
					  }}
				/>

				<TextField
					id="Core Elective"
					label="Core Elective"
					variant="outlined"
					required="true"
					onChange={handleCoreElectiveChange}
					onBlur={handleCoreElectiveBlur}
					error={CoreElectiveError}
					helperText={CoreElectiveError ? "This field is required" : ""}
					defaultValue={CoreElective}
					value={CoreElective}
					InputProps={{
						readOnly: type == "see",
					  }}
				/>
				<br />
				<TextField
					multiline
					id="Course Prerequisites"
					label="Course Prerequisites"
					variant="outlined"
					onChange={handleCoursePrerequisitesChange}
					helperText="Enter prerequisites in multiple lines"
					defaultValue={CoursePrerequisites.join("\r\n")}
					value={CoursePrerequisites.join("\r\n")}
					InputProps={{
						readOnly: type == "see",
					  }}
				/>
				{/* <TextField
					id="Course Credits"
					label="Course Credits"
					variant="outlined"
					required="true"
					onChange={handleCourseCreditChange}
					onBlur={handleCourseCreditBlur}
					error={CourseCreditError}
					helperText={CourseCreditError ? "This field is required" : ""}
					defaultValue={CourseCredit}
				/> */}
				<br />
				{type!=="see"?
				(<FormControl>
					<InputLabel id="Course Credits">Course Credits</InputLabel>
					<Select
						labelId="Course Credits"
						id="demo-simple-select"
						value={CourseCredit}
						defaultValue={CourseCredit}
						onChange={handleCourseCreditChange}
						onBlur={handleCourseCreditBlur}
						error={CourseCreditError}
						label="mylabel"
						sx={{ minWidth: "120px" }}
					>
						{course_credits_arr.map((num) => (
							<MenuItem value={num}>{num}</MenuItem>
						))}
					</Select>
				</FormControl>):
				(
					<TextField
					multiline
					id="Course Creditss"
					label="Course Credits"
					variant="outlined"
					value={CourseCredit}
					InputProps={{
						readOnly: "true",
					  }}/>
				)
}
				<br />

				{type == "add" ?
					(
						<>
							<div className="uploadfile">
								<label htmlFor="fileInput">Too many courses? Add an excel/csv file here:</label>
								<input
									type="file"
									id="fileInput"
									onChange={(e) => handleFileChange(e)}
								/>
							</div>
							{uploadError.error && <p>{uploadError.message}</p>}
						</>
					) : <></>}
			</Box>

			<br />
			<br />

			{type!="see"?(<Button variant="contained" color="primary" onClick={handleSubmit}>
				Submit
			</Button>):<></>}
		</div>
	);
}

export default CourseForm;