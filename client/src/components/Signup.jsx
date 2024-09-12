import { Grid2, Paper, TextField, Typography, Button } from "@mui/material";
import React, { useState} from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";

export const Signup = () => {
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup=(e)=> {
    e.preventDefault();
    axios.post("http://localhost:3001/signup", {name, email, password})
    .then(result=>{
        if(result.status == 201) {
          console.log("User created successfully")
          navigate("/login");
        }
    })
    .catch(err=>{
      if(err.response && err.response.status===400){
        window.alert("Email already exists. Please use a different Email")
      }else{
        console.log(err)
      }
    })
  }
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
              minHeight: "60px",
            },
            
          }}
        >
          <Typography style={heading}>Sign up</Typography>
          <form onSubmit={handleSignup}>
            <TextField required style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth type="text" label="Enter Name" name="name" onChange={(e)=>setName(e.target.value)}></TextField>
            <TextField required style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Email" variant="outlined" type="email" placeholder="Enter Email" name="email" onChange={(e)=>setEmail(e.target.value)}/>                    
            <TextField  required style={row} sx={{label: { fontWeight: '700', fontSize:"1.3rem" }}} fullWidth label="Password" variant="outlined" type="password" placeholder="Enter Password" name="password" onChange={(e)=>setPassword(e.target.value)} />
            <Button style={btnStyle} variant="contained" type="submit">Sign Up</Button>
          </form>
        </Paper>
      </Grid2>
    </>
  );
};
