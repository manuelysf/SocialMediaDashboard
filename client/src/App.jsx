import { useState,  useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Home } from "./components/Home";
import { Navbar } from "./components/Navbar";
import axios from "axios";

export const IsLoggedInContext = createContext();
export const SetIsLoggedInContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState();
  useEffect(()=>{
    axios.get("http://localhost:3001/user", {withCredentials:true})
    .then(response=>{
      if(response.data.user){
        setIsLoggedIn(true)
      }
      else{
        setIsLoggedIn(false);
      }
    })
    .catch(() => setIsLoggedIn(false));
  },[])

  return (
    <>
    <IsLoggedInContext.Provider value = {isLoggedIn}>
      <SetIsLoggedInContext.Provider value = {setIsLoggedIn}>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/Login" element={isLoggedIn?<Navigate to="/home"/> : <Login />} />
            <Route path="/Signup" element={isLoggedIn?<Navigate to="/home"/> : <Signup />} />
            <Route path="/Home" element={isLoggedIn? <Home /> : <Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </SetIsLoggedInContext.Provider>
    </IsLoggedInContext.Provider>
    </>
  );
}

export default App;
