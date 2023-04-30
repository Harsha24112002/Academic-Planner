import { Card, CardContent, CardMedia, Grid, Skeleton, Typography } from "@mui/material";
import React from "react";
import '../css/GpaTrends.css'

import {
	Chart as ChartJs,
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	PointElement,
	LineElement
} from 'chart.js'

import { Bar, Line } from 'react-chartjs-2'
import { red } from "@mui/material/colors";

ChartJs.register(
	BarElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	PointElement,
	LineElement
)

function GPATrends({ props }) {

	// const {studentCourses, Course} = props;
	const studentCourses = props[0];
	const Course = props[1];

	// need to get the current_elective_count and details
	const fixed_elective_count = [30, 12, 30, 14, 15, 12, 13, 0, 0]
	// const sem_cgpa = [8, 7.5, 8, 8.5, 8, 7.5, 8, 8.5]

	const details = studentCourses.course_list;

	const mapElectiveToIndex = {
		"Departmental Core Theory" : 0,
		"Departmental Core Lab" : 1,
		"Departmental Elective" : 2,
		"Basic Sciences": 3,
		"Basic Engineering Skills": 4,
		"Liberal/Creative Arts Elective": 5,
		"Free Elective": 6,
		"Additional": 7,
		"Audit": 8
	}

	console.log('details in Trends : ', Course)

	const getElectiveCount = (details) => {
		const elective_count = [0, 0, 0, 0, 0, 0, 0, 0, 0]
		details.forEach(course => {
			const index = mapElectiveToIndex[course.elective]
			elective_count[index] += Course[course.course_id]['course_credits']
		})

		return elective_count
	}

	const gradeMapping = {
		"A" : 10,
		"A-" : 9,
		"B" : 8,
		"B-" : 7,
		"C" : 6,
		"C-" : 5,
		"D" : 4,
		"F" : 0
	}

	const current_elective_count = getElectiveCount(details)
	console.log('current_elective_count : ', current_elective_count)

	const get_sem_cgpa = (details) => {
		var sem_cgpa = [0, 0, 0, 0, 0, 0, 0, 0]
		var sem_credits = [0, 0, 0, 0, 0, 0, 0, 0]
		details.forEach(course => {
			// console.log('course : ', course)
			const registered_sem = course.registered_sem
			if(course.course_grade){
				sem_cgpa[registered_sem - 1] += gradeMapping[course.course_grade]*Course[course.course_id]['course_credits']
				sem_credits[registered_sem - 1] += Course[course.course_id]['course_credits']
			}
		})

		sem_cgpa = sem_cgpa.map((element, index) => {
			sem_cgpa[index] = sem_cgpa[index] == 0 ? NaN : sem_cgpa[index]
			// console.log("zoom : ", sem_cgpa[index], sem_credits[index])
			return (sem_cgpa[index]/sem_credits[index]).toFixed(2)
		})
		return sem_cgpa
	}

	const sem_cgpa = get_sem_cgpa(details)
	// console.log("sem_cgpa",sem_cgpa)

	const data = {
		labels : ['sem I', 'sem II', 'sem III', 'sem IV', 'sem V', 'sem VI', 'sem VII', 'sem VIII'],
		datasets : [
			{
				// axis: 'y',
				data: sem_cgpa,
				backgroundColor: [
					"rgba(75,192,192,1)",
					"#ecf0f1",
					"#50AF95",
					"#f3ba2f",
					"#2a71d0",
					"rgba(75,192,192,1)",
					"#ecf0f1",
					"#50AF95"
				  ],
				borderColor: 'black',
				borderWidth: 1,
				label: 'CGPA variation'
			}
		]
	}
	const options = {
		// indexAxis:'y',
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				max: 10,
				min: 0,
				ticks: {
					stepSize: 1
				}
			},
		}
	}

	const elective_count_data = {
		labels : ["Departmental Core Theory", "Departmental Core Lab", "Departmental Electives", "Basic Sciences", "Basic Engineering Skills", "LA/CA", "Free Electives", "Additional", "Audit"],
		datasets : [
			{
				data: current_elective_count,
				backgroundColor: '#2196f3',
				borderColor: 'black',
				borderWidth: 1,
				label: 'Completed',
				stack: 'Stack 0'			
			},
			{
				data: fixed_elective_count.map((element, index) => {
					if(index === 8) return 0
					return element - current_elective_count[index]
				}),
				backgroundColor: '#ef5350',
				borderColor: 'black',
				borderWidth: 1,
				label: 'To Do',
				stack: 'Stack 0'			
			}			
		]
	}

	const elective_count_options = {
		// indexAxis:'y',
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			x: {
				max: 30,
				min: 0,
				ticks: {
					stepSize: 1
				}
			},
		}
	}
	return (
		// <Grid container spacing={2} columns={12} marginTop={5} display={'flex'} justifyContent={"space-around"}>
		// 	<div                 
		// 		sx={{ height: "420" }}
		// 		// display="flex"
		// 		// justifyContent="space-around">
		// 		>
		// 		<Bar
		// 			// height={'500%'}
		// 			// width={500}
		// 			data = {data}
		// 			options = {options}
		// 		></Bar>
		// 	</div>

		// 	<div                 
		// 		sx={{ height: "auto" }}
		// 		display="flex"
		// 		justifyContent="space-around">
		// 		<Bar
		// 			data = {data}
		// 			options = {options}
		// 		></Bar>
		// 	</div>

		// </Grid>
		<Grid container spacing={2} className="container_trend">
			<div className="gpatrends">
				<div className="trend">
					<Bar className="bargraph"
						data = {elective_count_data}
						options = {{...elective_count_options, indexAxis:'y'}}
					></Bar>
				</div>
				<div className="trend">
					<Line classname="graph"
						data = {data}
						options = {options}
					></Line>
				</div>
			</div>
		</Grid>
	);
}

export default GPATrends;
