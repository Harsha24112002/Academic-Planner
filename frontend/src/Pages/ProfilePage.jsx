import React from "react";
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
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import ProfilePageTabs from "../Components/Tabs";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchDetails, fetchEditDetails } from "../Actions/StudentDetailsActions";
import GPATrends from "../Components/GPATrends";
import CourseList from "../Components/CourseList";


const components = [<GPATrends />, <CourseList />];
const labels = ["GPA trends", "My Courses"]


function ProfilePage() {
  const { details, loading, error } = useSelector((state) => {
    console.log(state.studentDetails)
    return ({
    details: state.studentDetails.details,
    loading: state.studentDetails.loading,
    error: state.studentDetails.error,
  })});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchDetails());
  }, []);


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
                  <CardMedia
                    component="img"
                    sx={{ 'object-fit': 'fill'}}
                    image={`data:image/png;base64,${details['photo']}`}
                    alt="DP"
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
                        Welcome, {details["username"]}
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
                  <IconButton>
                    <Edit />
                  </IconButton>
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
