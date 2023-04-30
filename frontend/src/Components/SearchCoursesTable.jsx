import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { saveDetails } from '../features/courseDetailsSlice';



const columns = [
	{ id: 'ID', label: 'Course ID', minWidth: 100 },
	{ id: 'Name', label: 'Course Name', minWidth: 170 }
];

function createData(info) {
	return { 'ID': info[0], 'Name': info[1] };
}


export default function SearchCourseTable({ coursesInfo, handleClose, handleRegister ,type }) {

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const rows = coursesInfo.map((info) => createData(info));
	const dispatch = useDispatch();

	const handleRowClick = (event) => {
		console.log("inside handle", event.target.id)
		// setSelectedValue(event.target.textContent);
		// setSearchQuery("")
		// setOpen(false);
		// dispatch(fetchcoursesSearchDelete());
	
		axios({
			method: "GET",
			url: `http://127.0.0.1:5000/maps/get_course_details/${event.target.id}`,
			withCredentials: true
		})
			.then((response) => {
				// console.log("repsonse",response.data.course_id)
				
				dispatch(saveDetails(response.data))
				handleClose();
				if(type=="register")
				{
					handleRegister();
				}

			})
			.catch((error) => {
				console.log(error.msg);
			});
	
		// data = {
		//   course_id: event.target.textContent,
		//   registered_sem : 3
		//   elective : Optional[str]
		//   met_prerequisite_flag : bool
		//   # note : Optional[Notes]
		//   note : Optional[Notes]
		// }
		// axios.post(`http://127.0.0.1:5000/maps/register/${event.target.textContent}`,data)
	};

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table stickyHeader aria-label="sticky table" >
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{ minWidth: column.minWidth }}
									sx={{ bgcolor: "lightgrey" }}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow onClick={handleRowClick} hover role="checkbox" id={row["ID"]} tabIndex={-1} key={row.code}>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell key={column.id} align={column.align} id={row["ID"]} >
													{column.format && typeof value === 'number'
														? column.format(value)
														: value}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

