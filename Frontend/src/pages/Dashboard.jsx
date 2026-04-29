import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import DashSidebar from './DashSidebar';
import DashBoardProfile from './DashBoardProfile';
import BottomNavBar from './BottomNavBar';
export const Dashboard = () => {
  const location = useLocation() ; 
  const [tab, setTab] = useState("") ; 

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search) ; 
    const tabFromUrl = urlParams.get("tab") ; 
    if(tabFromUrl){
      setTab(tabFromUrl); 
    }
  } , [location.search]) ; 
 
  return (
    <div>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <DashSidebar></DashSidebar>
      </div>

      {/* <BottomNavBar></BottomNavBar> */}

      {/* PROFILE */}
      <div>{tab === "profile" && <DashBoardProfile></DashBoardProfile>}</div>
    </div>
  );
}
