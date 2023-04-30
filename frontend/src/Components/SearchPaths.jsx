import React from "react";
import { Box, TextField, IconButton, ListItemButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Dialog,
	Typography,
	Button,
	DialogTitle,
	List,
	ListItem,
	CircularProgress,
} from "@mui/material";
import axios from "axios";
import { fetchpathsSearch, fetchpathsSearchDelete } from "../Actions/PathsSearchActions";
// import {}

function SearchPaths() {
	const [searchQuery, setSearchQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [selectedValue, setSelectedValue] = useState("Enter Query");
	const dispatch = useDispatch();
	  const { pathsSearch_, loading, error } = useSelector((state) => {
	    return {
	      pathsSearch_: state.pathsSearch.pathsSearch,
	      loading: state.pathsSearch.loading,
	      error: state.pathsSearch.error,
	    };
	  });



	const handleSearchInputChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleSearchSubmit = (event) => {
		// console.log(event.target.value);
		console.log("Search query:", searchQuery);
		event.preventDefault();
		dispatch(fetchpathsSearch(searchQuery));
		setOpen(true);

		// Perform search or other actions with the searchQuery value
	};
	const handleClose = () => {
		setOpen(false);
		    dispatch(fetchpathsSearchDelete());
	};
	const handleListItemButtonClick = (event) => {
		setSelectedValue(event.target.textContent);
		setSearchQuery(event.target.textContent)
		setOpen(false);
		dispatch(fetchpathsSearchDelete());


		axios({
			method: "GET",
			url: `http://127.0.0.1:5000/maps/get_path/${event.target.textContent}`,
			withCredentials: true
		})
			.then((response) => {
				// console.log("repsonse",response.data.course_id)
				// dispatch(savePath(response.data))
			})
			.catch((error) => {
				console.log(error.msg);
			});

	};
	return (
		<Box onSubmit={handleSearchSubmit} component="form">
			<TextField
				label="Search"
				variant="outlined"
				size="small"
				value={searchQuery}
				onChange={handleSearchInputChange}
			/>
			<IconButton type="submit" aria-label="Search">
				<SearchIcon />
			</IconButton>
			{/* <Typography variant="subtitle1" component="div">
        Selected: {selectedValue}
      </Typography> */}
			<br />

			<Dialog
				selectedValue={selectedValue}
				open={open}
				onClose={handleClose}
			>
				<DialogTitle>Select Path</DialogTitle>
				<List>
					{loading ? (
						<CircularProgress />
					) : (
						pathsSearch_.map((path, i) => (
							<ListItem key={i} disableGutters>
								<ListItemButton key={i} onClick={handleListItemButtonClick}>
									{path}
								</ListItemButton>
							</ListItem>
						))
					)}
				</List>
			</Dialog>

		</Box>
	);
}

export default SearchPaths;
