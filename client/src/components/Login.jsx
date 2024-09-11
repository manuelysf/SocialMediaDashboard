import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; //shickt von frontend zu backend
import { Grid2, Button, Paper, TextField, Typography } from "@mui/material";
import { SetIsLoggedInContext } from "../App";
import { useContext } from "react";

export const Login = () => {

  const setIsLoggedIn = useContext(SetIsLoggedInContext);

  const paperStyle = {
    padding: "2rem",
    margin: "100px auto",
    borderRadius: "1rem",
    boxShadow: "10px 10px 10px",
  };
  const heading = { fontSize: "2.5rem", fontWeight: "600" };
  const row = { display: "flex", marginTop: "2rem" };
  const btnStyle = {
    marginTop: "2rem",
    fontSize: "1.2rem",
    fontWeight: "700",
    backgroundColor: "black",
    borderRadius: "0.5rem",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
      e.preventDefault();
      axios.post("http://localhost:3001/login", { email, password }, { withCredentials: true })
          .then(result => {
              if (result.data === "Success") {
                  axios.get('http://localhost:3001/user', { withCredentials: true })
                      .then(response => {
                          if (response.data.user) {
                            setIsLoggedIn(true);
                            navigate("/home", { state: { user: response.data.user } });
                          }
                      });
              } else {
                  alert("Login failed");
              }
          })
          .catch(err => console.log(err));
  };

  return (
    <>
      <Grid2 align="center">
        <Paper
          style={paperStyle}
          sx={{
            width: {
              xs: "80vw",
              sm: "50vw",
              md: "40vw",
              lg: "30vw",
              xl: "30vw",
            },
            height: "60vh",
          }}
        >
          <Typography style={heading}>Login</Typography>
          <form onSubmit={handleLogin}> 
            <TextField required style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Email" variant="outlined" type="email" placeholder="Enter Email" name="email" onChange={(e)=>setEmail(e.target.value)}/>                    
            <TextField required style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Password" variant="outlined" type="password" placeholder="Enter Password" name="password" onChange={(e)=>setPassword(e.target.value)} />
            <Button style={btnStyle} variant="contained" type="submit">Login</Button>
          </form>
        </Paper>
      </Grid2>
    </>
  )
}
