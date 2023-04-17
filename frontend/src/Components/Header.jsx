import React, { useState } from 'react'
import { AppBar, Button, Card, Container, Icon, IconButton, MenuItem, MenuList, StepIcon, Toolbar, Tooltip } from '@mui/material'
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom';
// const pages = ["profile", "maps", "specialization paths", "logout"];
// const tos = {
//   profile: "/student/profile",
//   "specialization paths": "/student/spPaths",
//   maps: "/student/maps",
// };

function Header({pages,tos}) {
  const [anchorElNav, setAnchorElNav] = useState(null)

  const handleCloseNavMenu = (event) => {
    console.log(event)
    setAnchorElNav(null);
  };
  const handleOpenNavMenu = (event) => {
    console.log(pages);
    setAnchorElNav(event.currentTarget);
  };
  return (
    <>
    <AppBar position='static'>
        <Container sx={{bgcolor:'black'}}>
           <Box sx={{ flexGrow: 1,justifyContent:'space-between', display: { xs: 'flex', md: 'none' } }}>
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
              >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" >{page}</Typography>
                
                </MenuItem>
              ))}
            </Menu>
            <MenuItem>
                Academic Planner
              </MenuItem>
           </Box>

          {/***********************/}
          <Box sx={{ flexGrow: 1,justifyContent:'space-between', display: { xs: 'none', md: 'flex' }}}>
            <MenuItem>
                Academic Planner
            </MenuItem>
           <Box sx={{justifyContent:'flex-end'}}>
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
          </Box>
          </Box>
        </Container>
    </AppBar>
    <Outlet />
    </>
  )
}

export default Header