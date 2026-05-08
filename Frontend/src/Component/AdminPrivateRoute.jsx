import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router';

const AdminPrivateRoute = () => {
    const {currentUser } = useSelector((state)=> state.user) ; 
  return currentUser && currentUser.isAdmin ? (
    <Outlet></Outlet>
  ): (
    <Navigate to={"/signin"}></Navigate>
  )
}

export default AdminPrivateRoute