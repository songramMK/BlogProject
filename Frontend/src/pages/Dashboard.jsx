import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import DashSidebar from './DashSidebar';
import DashBoardProfile from './DashBoardProfile';
import BottomNavBar from './BottomNavBar';
import DashBoardPost from './DashBoardPost';
import DashBoardCreatePost from './DashBoardCreatePost';
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
    <div className="min-h-screen flex  sm:flex-row  bg-black">
      {/* <div className="min-h-screen  flex flex-col md:flex-row"> */}
        {/* Sidebar */}
        <DashSidebar></DashSidebar>
      {/* </div> */}

      {/* <BottomNavBar></BottomNavBar> */}

      {/* PROFILE */}
      <div className="flex-1 p-2 w-full bg-black">
        {tab === "profile" && <DashBoardProfile></DashBoardProfile>}
        {tab === "createpost" && <DashBoardCreatePost></DashBoardCreatePost>}
        {tab === "posts" && <DashBoardPost></DashBoardPost>}
      </div>
    </div>
  );
}
