import React from "react";
import banner from "../../assets/banner.png";
// import loginBanner from '../../assets/loginBanner.png'
// import image_ from '../../assets/image_.png'
// import imageBannerr from "../../assets/imageBannerr.png";
import imagelast from "../../assets/imagelast.png";
import image1 from "../../assets/image1.png";
import image2 from "../../assets/image2.png";
import image3 from "../../assets/image3.png";
import image4 from "../../assets/image4.png";
import image5 from "../../assets/image5.png";
import imagefinalBg from "../../assets/imagefinalBg.png";
import { IoIosStar } from "react-icons/io";
import "./authentication.css";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import { FaFacebook } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";

import { FiCheckSquare, FiX } from "react-icons/fi";
// import { AnimatePresence, motion } from "framer-motion";

import { Link, useNavigate } from "react-router";
import { scale } from "motion";

// REDUX FUNCTION IMPORT
import { useState, useEffect } from "react";
import {
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../../redux/feature/user/userSlice";
export const SignUp = () => {
  const removeNotif = (id) => {
    setNotifications((pv) => pv.filter((n) => n.id !== id));
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({});
  const [Check, setCheck] = useState(false);
  const [ErrorMessage, SetErrorMessage] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [reShowPass, setReShowPass] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.id === "CheckBox") {
      setCheck(e.target.checked);
      return;
    }
    const newData = { ...formData, [e.target.id]: e.target.value.trim() };
    setFormData(newData);
    console.log(e.target.id, e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Check !== true) {
      SetErrorMessage(
        "Please agree to the terms and conditions before signing up.",
      );
      setNotifications((pv) => [generateRandomNotif(ErrorMessage), ...pv]);

      return;
    }
    if (formData.password !== formData.reTypePassword) {
      SetErrorMessage("Password Is Not Match....");
      setNotifications((pv) => [generateRandomNotif(ErrorMessage), ...pv]);
      return;
    }
    try {
      const res = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserName: formData.userName,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (data.success == false) {
        SetErrorMessage("SignUp Unsuccessfull.....");
        setNotifications((pv) => [generateRandomNotif(ErrorMessage), ...pv]);
      }
      if (res.ok) {
        navigate("/signIn");
      }
    } catch (error) {
      SetErrorMessage(`${error.message}`);
      setNotifications((pv) => [generateRandomNotif(ErrorMessage), ...pv]);
      console.log(error);
    }
    console.log("FormData", formData);
  };

  const auth = getAuth(app);

  const HandleFacebook = async () => {
    try {
      const FacbookProvider = new FacebookAuthProvider();
      const firebaseFacebookResponse = await signInWithPopup(
        auth,
        FacbookProvider,
      );

      console.log("UserName : ", firebaseFacebookResponse.user.displayName , 
        "email : ", firebaseFacebookResponse.user.email , 
        "profilePhotoUrl:", firebaseFacebookResponse.user.photoURL,


      );
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: firebaseFacebookResponse.user.displayName,
          email: firebaseFacebookResponse.user.email,
          profilePhotoUrl: firebaseFacebookResponse.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
    /* 
email : user.email
userName : user.displayName
profileUrl : user.photoURL


    */
    // console.log("Facebook : ", firebaseFacebookResponse);
    console.log("FACEBOOK ");
  };

  const HandleGithub = async () => {
    try {
      const gitHubProvider = new GithubAuthProvider();
      const firebaseGithubResponse = await signInWithPopup(
        auth,
        gitHubProvider,
      );
      navigate("/GithubProfile", {
        state: {
          UserName: firebaseGithubResponse.user.reloadUserInfo.screenName,
          profilePhotoUrl: firebaseGithubResponse.user.photoURL,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const HandleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      const firebaseResponse = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: firebaseResponse.user.displayName,
          email: firebaseResponse.user.email,
          profilePhotoUrl: firebaseResponse.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
      console.log(firebaseResponse);
    } catch (error) {
      console.log(error);
    }
    console.log("GOOGLE");
  };

  return (
    <div className="flex flex-col-reverse  bg-black  sm:flex-row lg:flex-row   justify-center items-start pt-10 sm:pt-5 px-1  sm:pr-10">
      {/* LEFT SIDE  */}
      <div className="w-full md:w-1/2  lg:w-1/2 px-15 py-0 md:py-5 flex flex-col justify-center items-start">
        <h1 className="font-pacifico mt-5 sm:mt-1 font-bold text-3xl ">
          DarkSphere
        </h1>
        <h1 className="font_poppins  text-4xl mt-5 sm:mt-3 mb-5 font-bold w-full flex justify-start items-center">
          Create your account
        </h1>
        <p className="font_poppins text-xs text-gray-400 w-full flex justify-start items-center">
          Join DarkSphere and start sharing your ideas with the world.
        </p>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              className="w-full py-2"
              initial={{ y: 30, opacity: 0 }}
              transition={{ duration: 1.2 }}
              exit={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <label
                value="userName"
                className="text-gray-400 my-3"
                htmlFor="username"
              >
                User Name
              </label>
              <input
                required
                id="userName"
                onChange={handleChange}
                className="w-full py-2 px-2 border border-gray-400 rounded outline-red-400 "
                type="text"
                placeholder="Enter Your Email"
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full py-2"
            >
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
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              exit={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="w-full py-2 relative"
            >
              <label className="text-gray-400 my-3" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                required
                onChange={handleChange}
                className="w-full py-2 px-2 border border-gray-400 rounded outline-red-400 "
                type={showPass ? "text" : "password"}
                placeholder="Enter Your Password"
              />
              <button
                type="button"
                onClick={() => {
                  setShowPass(!showPass);
                }}
                className=" absolute  bottom-5 right-5"
              >
                {showPass ? <FaRegEye /> : <FaEyeSlash />}
              </button>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              className="w-full py-2 relative"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 1 }}
              transition={{ duration: 1.2 }}
            >
              <label className="text-gray-400 my-3" htmlFor="password">
                Re-type Password
              </label>
              <input
                id="reTypePassword"
                required
                onChange={handleChange}
                className="w-full  py-2 px-2  border border-gray-400 rounded outline-red-400 "
                type={reShowPass ? "text" : "password"}
                placeholder="Re-Type Your Password"
              />
              <button
                type="button"
                onClick={() => {
                  setReShowPass(!reShowPass);
                }}
                className=" absolute  bottom-5 right-5"
              >
                {reShowPass ? <FaRegEye /> : <FaEyeSlash />}
              </button>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 items-center">
            <input type="checkbox" id="CheckBox" onChange={handleChange} />
            <p className="font_poppins text-wrap text-xs text-gray-300 my-10">
              By signing up, I agree to the terms and conditions, privacy
              policy, and cookie policy
            </p>
          </div>

          {/* 
          
          ------------------------------------

          */}

          <div className="flex gap-3 my-5 justify-between">
            <button onClick={HandleFacebook} className="flex w-full">
              <Card href="" Icon={FaFacebook} />
            </button>

            <button onClick={HandleGithub} className="flex w-full">
              <Card href="" Icon={FaSquareGithub} />
            </button>
          </div>

          <button onClick={HandleGoogle} className="w-full my-5 flex">
            <Card href="" Icon={FaGoogle} />
          </button>

          {/* 
          
          ------------------------------------

          */}

          <button
            type="submit"
            className="btn text-center w-full py-4 bg-red-500 hover:bg-amber-700"
          >
            SIGN UP
          </button>
        </form>

        <p className="font_poppins text-wrap text-gray-300 text-xs my-5">
          Already have an account?
          <Link to={"/signIn"} className="text-[#f05252] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      {/* END LEFT SIDE */}

      {/* NOTIFICATION ERROR START */}

      <div className="flex flex-col gap-1 w-72 fixed top-2 right-2 z-50 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <Notification removeNotif={removeNotif} {...n} key={n.id} />
          ))}
        </AnimatePresence>
      </div>

      {/* NOTIFICATION ERROR END */}

      {/* RIGHT SIDE */}
      <div
        id="box"
        style={{ borderRadius: "80px 30px 30px 20px" }}
        className="sm:block md:block  md:w-1/2 lg:w-1/2  overflow-hidden   border border-red-400  relative  "
      >
        <img
          className="block sm:hidden "
          style={{ objectFit: "cover", transition: "all ease 1s" }}
          src={imagelast}
          alt=""
        />
        <img
          style={{ objectFit: "cover", transition: "all ease 1s" }}
          className="hidden sm:block md:block  "
          src={imagefinalBg}
          alt=""
        />
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ y: -210, opacity: 0 }}
            animate={{ y: -10, opacity: 1 }}
            exit={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.9 }}
          >
            {/*  */}
            <div className=" absolute left-5 sm:left-10  bottom-5 sm:bottom-10 md:bottom-20 lg:bottom-40 ">
              <h1 className="font_poppins text-wrap text-xl sm:text-4xl  sm:mb-2 font-bold">
                A Space For
              </h1>
              <h1 className="font_poppins text-wrap text-xl sm:text-4xl font-bold">
                Idea And Inspiration
              </h1>
              <p className="hidden [@media(min-width:120px)]:block sm:block text-xs font_poppins text-[#CBD5E1] pt-1 sm:pt-5">
                A curated space for ideas, stories, and insights{" "}
              </p>
              <p className="hidden [@media(min-width:120px)]:block sm:block text-xs font_poppins text-[#CBD5E1] sm:pb-5">
                from curious minds in the digital world.{" "}
              </p>
              <div className="flex relative hidden [@media(min-width:320px)]:block sm:block">
                <div className="flex w-8.5 h-6.5 my-3 relative">
                  <img
                    className="rounded-full absolute left-0 top-1 bottom-0"
                    src={image1}
                    alt=""
                  />
                  <img
                    className="rounded-full absolute left-5 top-1 bottom-0"
                    src={image2}
                    alt=""
                  />
                  <img
                    className="rounded-full absolute left-10 top-1 bottom-0"
                    src={image3}
                    alt=""
                  />
                  <img
                    className="rounded-full absolute left-15 top-1 bottom-0"
                    src={image4}
                    alt=""
                  />
                  <img
                    className="rounded-full absolute left-20 top-1 bottom-0"
                    src={image5}
                    alt=""
                  />
                </div>
                <div className="flex absolute left-30 top-5">
                  <IoIosStar className="text-red-600" />
                  <IoIosStar className="text-red-600" />
                  <IoIosStar className="text-red-600" />
                  <IoIosStar className="text-red-600" />
                  <IoIosStar className="text-red-600" />
                </div>
                <p className="absolute top-10 left-30 text-wrap text-xs font_poppins">
                  5.0 from over 100,000 reviews
                </p>
              </div>
            </div>
            {/*  */}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* END RIGHT SIDE */}
    </div>
  );
};

const NOTIFICATION_TTL = 5000;

const Notification = ({ text, id, removeNotif }) => {
  useEffect(() => {
    const timeoutRef = setTimeout(() => {
      removeNotif(id);
    }, NOTIFICATION_TTL);

    return () => clearTimeout(timeoutRef);
  }, []);

  return (
    <motion.div
      layout
      initial={{ y: -15, scale: 0.95 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="p-2 flex items-start rounded gap-2 text-xs font-medium shadow-lg text-white bg-[#F05252] pointer-events-auto"
    >
      <FiCheckSquare className=" mt-0.5" />
      <span>{text}</span>
      <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
        <FiX />
      </button>
    </motion.div>
  );
};

const Card = ({ Icon, href }) => {
  return (
    <>
      <a
        className={`${href === "google" ? "p-2" : "p-2"} w-full rounded border-[1px] border-gray-400 relative overflow-hidden group bg-black`}
      >
        <div className=" absolute  inset-0 bg-gradient-to-r from-white  to-red translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-200" />

        <Icon className="absolute  z-10 -top-12 -right-12 text-9xl text-black group-hover:text-red-500 group-hover:rotate-12 transition-transform duration-300" />
        <Icon className="mb-1 text-2xl text-white group-hover:text-black transition-colors relative z-10 duration-300 mx-auto " />
      </a>
    </>
  );
};

const generateRandomNotif = (ErrorMessages) => {
  const data = {
    id: Math.random(),
    text: ErrorMessages,
  };

  return data;
};
