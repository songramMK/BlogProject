import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./bubble.module.css";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signInStart, signOutSuccess, updateFailure, updateStart, updateSuccess } from "@/redux/feature/user/userSlice";

const DashBoardProfile = () => {
  const profilePicRef = useRef();
  const [imageFileUrl , setImageFileUrl] = useState("") ; 
  const [imageFile, setImageFile] = useState(null);
  const [FormData , setFormData] = useState({}) ;
  const dispatch = useDispatch();
  const { currentUser , error , loading  } = useSelector((state) => state.user);
 

  
  const handleChange = (e)=>{
    e.preventDefault() ; 
    setFormData({...FormData, [e.target.id] : e.target.value}) ; 
  }

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0] ;

    if (file) {
      setImageFile(file); 
      setImageFileUrl(URL.createObjectURL(file));
    } 
  };
  
  const handleSubmit = async(e)=>{
    e.preventDefault() ;
    try{
      dispatch(updateStart()) ; 
      const formData = new FormData() ; 

      if(FormData.UserName){
        formData.append("UserName"  , FormData.UserName ) ; 
      }
      if(FormData.password){
        formData.append("password" , FormData.password) ; 
      }
      if(imageFile){
        formData.append("image" , imageFile) ; 
      }

      const res = await fetch(`api/user/updateUser/${currentUser._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json() ; 
      if(!res.ok){
        dispatch(updateFailure(data.message)) ;
      }else{
        dispatch(updateSuccess(data)) ;
      }



    }catch(error){
      dispatch(updateFailure(error.message)) ;
      console.log(error) ; 
    }
  }

  const handleDeleteUser = async(e)=>{
    e.preventDefault() ; 
    try{
      dispatch(deleteUserStart()) ; 
      const res = await fetch(`api/user/delete/${currentUser._id}` , {
        method : "DELETE" , 

      })
      const data = await res.json() ; 
      if(!res.ok){
        dispatch(deleteUserFailure(data.message)) ; 
      }else{
        dispatch(deleteUserSuccess(data))
      }
    }catch(error){
      console.log(error) ; 
    }
  }

  const handleSignOut = async(e) =>{
    e.preventDefault() ; 
    try{
      const res = await fetch(`api/user/signOut`, {
        method : "POST"
      });
      const data = await res.json() ; 
      if(res.ok){
        dispatch(signOutSuccess()) ; 
      }else{
        console.log(data.message) ; 
      }
    }catch(error){
      console.log(error);
    }
    console.log("SIGNOUT METHOD") ; 
  }


  
  return (
    <div className="max-w-lg w-full mx-auto p-3">
      <BubbleText />
      <form onSubmit={handleSubmit} className="flex my-20 flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          hidden
          ref={profilePicRef}
          onChange={handleImageChange}
        />

        <div className="w-32 h-32  self-center overflow-hidden cursor-pointer">
          <img
            className="h-full w-full rounded-full object-cover border-2 border-[#f05252]"
            src={imageFileUrl || currentUser.profilePicture}
            alt=""
            onClick={() => profilePicRef.current.click()}
          />
        </div>

        <label htmlFor="email" className="text-gray-400">
          UserName
        </label>
        <input
          id="UserName"
          onChange={handleChange}
          defaultValue={currentUser.UserName}
          className="border text-indigo-300 border-gray-400 rounded py-3 px-2 outline-red-300"
          type="text"
        />
        <label htmlFor="email" className="text-gray-400">
          Email
        </label>
        <input
          id="email"
          onChange={handleChange}
          defaultValue={currentUser.email}
          disabled
          className="border  text-indigo-300 border-gray-400 rounded py-3 px-2 outline-red-300"
          type="email"
        />
        <label htmlFor="email" className="text-gray-400">
          Password
        </label>
        <input
          id="password"
          onChange={handleChange}
          placeholder="password"
          className="border border-gray-400 rounded py-3 px-2 outline-red-300"
          type="password"
        />

        <Button
          variant="outline"
          disabled={loading}
          // onClick={handleSubmit}
          type="submit"
          className="border py-5 my-5 border-gray-400 transition-all  rounded btn bg-error text-white font-thin text-xl "
        >
          {loading ? (
            <>
             
                <span className="pl-3">Loading...</span>
            
            </>
          ) : (
            <span className="pl-3">Update Profile</span>
          )}
        </Button>
      </form>
      <div className="flex justify-between">
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="text-white"
        >
          SignOut
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-white">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete your account? This action is
                permanent and your account will be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogCancel onClick={handleDeleteUser}>
                Continue
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DashBoardProfile;

const BubbleText = () => {
  return (
    <h2 className="text-center text-2xl sm:text-5xl font-thin text-indigo-300">
      {"Update Your Profile".split("").map((child, idx) => (
        <span className={styles.hoverText} key={idx}>
          {child}
        </span>
      ))}
    </h2>
  );
};
