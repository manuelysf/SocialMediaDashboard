import React from 'react'
import { useLocation } from 'react-router-dom'

export const Home = () => {
  const location = useLocation();
  const user = location.state?.user;
  return (
    <div style={{color: 'white'}}><h1>` Username: {user && user.name}`</h1></div>
  )
}
