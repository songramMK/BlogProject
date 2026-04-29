import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { signInSuccess } from '../../redux/feature/user/userSlice';

const GithubEmail = () => {



 const [formData, setFormData] = useState("");
 const location = useLocation() ; 

 const { UserName, profilePhotoUrl } = location.state || {}; ; 
 console.log("USERNAME: ", UserName, " PHOTOPROFILEURL :  ", profilePhotoUrl); 
 const dispatch = useDispatch() ; 
 const navigate = useNavigate() ;





  const handleChange = (e) => {
    e.preventDefault();
    // const newData = { ...formData, [e.target.id]: e.target.value.trim() };
    setFormData(e.target.value);
    console.log(e.target.id, e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const res = await fetch("/api/auth/github", {
          method: "POST",
          headers: { "Content-type": "Application/json" },
          body: JSON.stringify({ UserName, profilePhotoUrl, email : formData }),
        });
        const data = await res.json() ; 
        if(res.ok){
            dispatch(signInSuccess(data)); 
            navigate("/") ; 
        }
    }catch(error){
        console.log(error) ; 
    }
  }


  return (
    <div className="mt-20 mb-40 w-full flex justify-center  bg-black text-white">
      <div className=" border-2 border-[#F05252] rounded-3xl p-10">
        <p className="font-light ">Enter Your Github Email </p>
        <form onSubmit={handleSubmit}>
          <label className="text-gray-400 my-3" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            required
            onChange={handleChange}
            className="w-full py-2 px-2 border border-gray-400 rounded outline-red-400 "
            type="email"
            placeholder="Enter Your Email"
          />
        </form>
      </div>
    </div>
  );
}

export default GithubEmail