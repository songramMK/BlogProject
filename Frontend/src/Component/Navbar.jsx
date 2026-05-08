import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import penAndPaper from "../../src/assets/penAndPaper.png";
import { useSelector } from "react-redux";
import { MdOutlineEmail } from "react-icons/md";

import  ProfileImage  from "../assets/image_copy.png";


import {
  FiEdit,
  FiChevronDown,
  FiTrash,
  FiShare,
  FiPlusSquare,
  FiVoicemail,
  FiAtSign,
  FiSkipBack,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
// import { IconType } from "react-icons";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return (
    <div className="flex justify-between border-none bg-black items-center py-5 px-8 sm:px-20 xl:px-32 ">
      <div>
        <img
          onClick={() => navigate("/")}
          src={penAndPaper}
          alt="logo "
          className="w-10 sm:w-14 cursor-pointer"
        />
      </div>

      {currentUser ? (
        <div className=" flex items-center justify-center bg-black z-10">
          <motion.div animate={open ? "open" : "closed"} className="relative">
            <button
              onClick={() => setOpen((pv) => !pv)}
              className="flex items-center gap-2  text-indigo-50 bg-[#f05252] rounded-full hover:text-black transition-colors"
            >
              <img
                alt="user-phot"
                src={currentUser.profilePicture || ProfileImage}
                className="w-10 h-10 rounded-full "
              ></img>
              <motion.span variants={iconVariants}>
                <FiChevronDown />
              </motion.span>
            </button>

            <motion.ul
              initial={wrapperVariants.closed}
              variants={wrapperVariants}
              style={{ originY: "top", translateX: "-50%" }}
              className="flex flex-col gap-2 p-1 rounded-lg bg-[#FFE0B2] shadow-xl absolute top-[120%] left-[50%] w-44 overflow-hidden"
            >
              <Option
                setOpen={setOpen}
                Icon={FiEdit}
                text={`${currentUser.UserName}`}
              />
              <Option
                setOpen={setOpen}
                Icon={FiAtSign}
                text={`${currentUser.email}`}
              />
              <Option setOpen={setOpen} Icon={FiShare} text="Profile" />
              <Option setOpen={setOpen} Icon={FiSkipBack} text="SignOut" />
            </motion.ul>
          </motion.div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/signIn")}
          className="flex items-center gap-2 rounded-full text-sm  cursor-pointer bg-[#f05252] text-white px-10 py-2.5"
        >
          Login
        </button>
      )}
    </div>
  );
};

const Option = ({ text, Icon, setOpen }) => {
  return (
    <motion.li
      variants={itemVariants}
      onClick={() => setOpen(false)}
      className="flex text-wrap items-center gap-2 w-full p-0 md:p-1 text-xs font-medium whitespace-nowrap rounded-md hover:bg-[#F05252] hover:text-white text-slate-700  transition-colors cursor-pointer"
    >
      <motion.span variants={actionIconVariants}>
        <Icon />
      </motion.span>
      <span>{text}</span>
    </motion.li>
  );
};

// export default StaggeredDropDown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  closed: {
    scaleY: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -15,
    transition: {
      when: "afterChildren",
    },
  },
};

const actionIconVariants = {
  open: { scale: 1, y: 0 },
  closed: { scale: 0, y: -7 },
};