import React, { useEffect, useState } from "react";
import {
  FiBarChart,
  FiChevronDown,
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiMonitor,
  FiShoppingCart,
  FiTag,
  FiUsers,
  FiCreditCard,
  FiBook,
  FiInbox,

} from "react-icons/fi";
import { VscSignOut } from "react-icons/vsc";
import { MdArticle } from "react-icons/md";
import { FaEdit } from "react-icons/fa";



import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";




function DashSidebar() {

  return (
    <div className="flex bg-black">
      <Sidebar></Sidebar>
      <ExampleContent></ExampleContent>
    </div>
  );
}

export default DashSidebar;

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  const {currentUser} = useSelector((state)=> state.user) ; 




  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 500) {
        setOpen(false);
      } else{
        setOpen(true);

      }
    };
    handleResize(); // initial run
    
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navigate = useNavigate() ; 
  return (
    <motion.nav
      layout
      className="sticky top-0 h-auto md:h-screen w-full md:w-[225px] shrink-0 border-r border-slate-300 bg-gray p-2"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <div className="space-y-1">
        <Option
          Icon={FiHome}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
          navigate={navigate}
        />
        <Option
          Icon={FiUsers}
          title="profile"
          selected={selected}
          setSelected={setSelected}
          open={open}
          navigate={navigate}
        />
        {currentUser && currentUser.isAdmin === false && (
          <Option
            Icon={FaEdit}
            title="createpost"
            selected={selected}
            setSelected={setSelected}
            open={open}
            navigate={navigate}
          />
        )}

        {currentUser && currentUser.isAdmin === false && (
          <Option
            Icon={MdArticle}
            title="posts"
            selected={selected}
            setSelected={setSelected}
            open={open}
            navigate={navigate}
          />
        )}
        <Option
          Icon={FiBarChart}
          title="Analytics"
          selected={selected}
          setSelected={setSelected}
          open={open}
          navigate={navigate}
        />
        <Option
          Icon={VscSignOut}
          title="Sign Out"
          selected={selected}
          setSelected={setSelected}
          open={open}
          navigate={navigate}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  notifs,
  navigate , 
}) => {
  const handleOption = (setSelected, title) => {
    console.log("popo");
    setSelected(title);
    console.log(title);
    navigate(`/dashboard?tab=${title}`) 
  };
  return (
    <motion.button
      layout
      onClick={() => handleOption(setSelected, title)}
      // onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title ? "bg-[#f05252]" : "text-slate-500 hover:bg-[#FFE0B2]"}`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}
      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};



const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600"
    >
      <svg
        width="24"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-slate-50"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
          stopColor="#000000"
        ></path>
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          stopColor="#000000"
        ></path>
      </svg>
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className={`absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors text-slate-500 hover:text-black  hover:bg-[#F05252]`}
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

const ExampleContent = () => <div className="h-[200vh] w-full"></div>;