import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Typography, Toolbar, Button } from "@mui/material";
import { Logout } from './Logout';
import { IsLoggedInContext } from '../App';

export const Navbar = () => {
  const isLoggedIn = useContext(IsLoggedInContext);
  const button={marginRight:'20px', fontSize:'1.2rem', fontWeight:'700', padding:'0.3rem 1.4rem'}
  return (
    <>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>PostGram</Typography>
          {isLoggedIn?<Logout/>:(
            <>
            <Button style={button} color="secondary" variant="contained" component={Link} to="/Login">Login</Button>
            <Button style={button} color="secondary" variant="contained" component={Link} to="/Signup">Sign up</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};
