import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router';

const PrivateRoute = () => {
    const {currentUser} = useSelector((state) => state.user); 

  return currentUser ? <Outlet></Outlet> : <Navigate to={"/signIn"}></Navigate>;
}

export default PrivateRoute