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
} from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import ProfilePageTabs from "../Components/ProfilePageTabs";

function ProfilePage() {
  return (
    <Container>
      <Header />
      <Grid container spacing={2} columns={12} marginTop={1}>
        <Grid item xs={3}>
          <Box>
            <Card>
              <CardMedia
                component="img"
                sx={{ height: "10", width: "150px", margin: "auto" }}
                image="Images/ProfilePic.png"
                alt="DP"
              />
              <CardContent>
                <List>
                  <ListItem>
                    <Typography gutterBottom variant="h5" component="div">
                      Name
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography gutterBottom variant="h5" component="div">
                      Email
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography gutterBottom variant="h5" component="div">
                      Roll Number
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
                    Welcome, Name
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography gutterBottom variant="h5" component="div">
                    Computer Science and Engineering
                  </Typography>
                </ListItem>
              </List>
            </Box>
            <Box sx={{ width: "100px" }}>
              <Typography>CGPA : 10.0</Typography>
            </Box>
          <Box sx={{ alignSelf: "flex-end" }}>
            <IconButton>
              <Edit />
            </IconButton>
          </Box>
          </Box>
          <Box>
            <ProfilePageTabs>
              
            </ProfilePageTabs>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProfilePage;
