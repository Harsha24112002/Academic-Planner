import React, { useRef } from "react";
import Header from "../Components/Header";
import {
  Container,
  Grid,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  ListItem,
  List,
  Icon,
  IconButton,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import ProfilePageTabs from "../Components/Tabs";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { editDetails, fetchDetails, fetchEditDetails } from "../Actions/StudentDetailsActions";
import GPATrends from "../Components/GPATrends";
import CourseList from "../Components/CourseList";
import { useState } from 'react';
import axios from "axios";
import { fetchPaths } from "../features/pathDetailsSlice";

const components = [<GPATrends />, <CourseList />];
const labels = ["GPA trends", "My Courses"]


const EditableTextBox = ({ initialValue }) => {

  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch()

  const onSave = (value) => {
    axios({
      method: "POST",
      url: `http://127.0.0.1:5000/authentication/get_details/student`,
      data: { 'first_name': value },
      withCredentials: true
    }).then(
      dispatch(editDetails({ "first_name": value }))
    )
  }

  const onCancel = () => {

  }
  const handleSave = () => {
    onSave(value);
    setEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setEditing(false);
    onCancel();
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      {editing ? (
        <>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="outlined-multiline-flexible"
                // label="Notes"
                multiline
                maxRows={4}
                defaultValue={initialValue}
                onChange={handleChange}
              />
            </div>
          </Box>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </>
      ) : (
        <>
          <span>{value}</span>
          <IconButton>
            <Edit onClick={handleEdit} />
          </IconButton>
        </>
      )}
    </div>
  );
};

function ProfilePage() {
  
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDetails());
  }, []);

  const { details, loading, error } = useSelector((state) => {
    console.log(state.studentDetails)
    return ({
      details: state.studentDetails.details,
      loading: state.studentDetails.loading,
      error: state.studentDetails.error,
    })
  });


  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileInputChange = event => {
    event.preventDefault();
    const file = event.target.files[0]
    console.log("sffgf", file)
    setSelectedFile(file);
    const formData = new FormData();
    formData.append("photo", file, file.name);
    console.log("fgh", formData)

    axios({
      method: "POST",
      url: "http://127.0.0.1:5000/authentication/edit_profile_photo/student",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data" // set content type header
      },
      withCredentials: true
    });

    axios({
      method: "POST",
      url: "http://127.0.0.1:5000/authentication/get_profile_picture",
      withCredentials: true
    }).then((response) => {
      const photo_url = response.data;
      dispatch(editDetails({ 'photo': photo_url }));
    });


  };

  const handleChangeProfile = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <Container>
          <Grid container spacing={2} columns={12} marginTop={1}>
            <Grid item xs={3}>
              <Box>
                <Card>
                  {/* {console.log('dp ',details['photo'])} */}
                  <CardMedia
                    component="img"
                    sx={{ 'object-fit': 'fill', "cursor": "pointer" }}
                    image={`data:image/png;base64,${details['photo']}`}
                    alt="DP"
                    onClick={handleChangeProfile}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />

                  <CardContent>

                    <List>
                      <ListItem>
                        <Typography gutterBottom variant="h5" component="div">
                          {details["username"]}
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <Typography gutterBottom variant="h7" component="div">
                          {details["email"]}
                        </Typography>
                      </ListItem>
                      <ListItem>
                        <Typography gutterBottom variant="h5" component="div">
                          {details["id"]}
                        </Typography>
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            <Grid item xs={9}>
              <Box
                sx={{ height: "auto" }}
                display="flex"
                justifyContent="space-around"
              >
                <Box>
                  <List>
                    <ListItem>
                      <Typography gutterBottom variant="h5" component="div">
                        Welcome, <EditableTextBox
                          initialValue={details["first_name"] ? details["first_name"] : "first name"}
                        ></EditableTextBox>

                      </Typography>

                    </ListItem>
                    <ListItem>
                      <Typography gutterBottom variant="h5" component="div">
                        {details["department"]}
                      </Typography>
                    </ListItem>
                  </List>
                </Box>
                <Box sx={{ width: "100px" }}>
                  <Typography>CGPA : {details["cgpa"]}</Typography>
                </Box>
                <Box sx={{ alignSelf: "flex-end" }}>

                </Box>
              </Box>
              <Box>
                <ProfilePageTabs components={components} labels={labels} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      )}
    </div>
  );
}

export default ProfilePage;
