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

function GPATrends() {

	// need to get the current_elective_count and details
	const fixed_elective_count = [10, 13, 15, 10, 15, 13, 32, 15]
	const sem_cgpa = [8, 7.5, 8, 8.5, 8, 7.5, 8, 8.5]
	const current_elective_count = [2, 3, 5, 1, 2, 2, 8, 2]

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
		labels : ['Departmental Core Theory', 'Departmental Core Lab', 'LA/CA', 'Basic Sciences', 'Basic Engineering Skills', 'Additional', 'Departmenal Electives', 'Free Electives'],
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
					if(index === 5) return 0
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
					<Bar className="bargraph" padding={-10}
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
