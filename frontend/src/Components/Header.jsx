import React, { useState } from "react";
import {
  AppBar,
  Button,
  Card,
  Container,
  Icon,
  IconButton,
  MenuItem,
  MenuList,
  StepIcon,
  Toolbar,
  Tooltip,
} from "@mui/material";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { NavLink, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { signout } from "../features/auth/authSlice";

function Header({ pages, tos }) {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleCloseNavMenu = (event) => {
    console.log(event)
    setAnchorElNav(null);
  };
  const handleOpenNavMenu = (event) => {
    console.log(pages);
    setAnchorElNav(event.currentTarget);
  };

  const handleLogOut = () => {
    // axios({
    //     method: "GET",
    //     url: "http://127.0.0.1:5000/authentication/logout",
    // }).then((response) => {
    //     console.log(response)
    // }).catch((error) => {
    //     if(error.response) {
    //         console.log(error.response)
    //         console.log(error.response.status)
    //         console.log(error.response.headers)
    //     }
    // })

    dispatch(signout());
    nav('/'); // redirects to HomePage after signout
  }

  return (
    <>
      <AppBar position="static">
        <Container sx={{ bgcolor: "black" }}>
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "space-between",
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
            <MenuItem>Academic Planner</MenuItem>
          </Box>

          {/***********************/}
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "space-between",
              display: { xs: "none", md: "flex" },
            }}
          >
            <MenuItem>Academic Planner</MenuItem>
            <Box sx={{ justifyContent: "flex-end" }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  LinkComponent={NavLink}
                  to={tos[page]}
                  sx={{
                    ":hover": {
                      bgcolor: "royalblue",
                      color: "white",
                    },
                    "&.active": {
                      bgcolor: "royalblue",
                      color: "white",
                    },
                    my: 2,
                    fontSize: "10px",
                    bgcolor: "grey",
                    margin: "5px",
                    color: "white",
                    display: "ruby",
                  }}
                >
                  {page}
                </Button>
              ))}
              <Button
                onClick={() => { handleCloseNavMenu(); handleLogOut();}}
                sx={{
                  ":hover": {
                    bgcolor: "royalblue",
                    color: "white",
                  },
                  "&.active": {
                    bgcolor: "royalblue",
                    color: "white",
                  },
                  my: 2,
                  fontSize: "10px",
                  bgcolor: "grey",
                  margin: "5px",
                  color: "white",
                  display: "ruby",
                }}
              > 
                logout 
              </Button>
            </Box>
          </Box>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
}

export default Header;
