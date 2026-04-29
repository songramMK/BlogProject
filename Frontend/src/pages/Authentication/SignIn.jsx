import React, { useEffect, useRef, useState } from "react";
import { FiCreditCard, FiMail, FiUser, FiUsers } from "react-icons/fi";
import { Link, Links, useNavigate } from "react-router";
import "./authentication.css";
import { FaFacebook } from "react-icons/fa";
import { FaSquareGithub } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";


import { FiCheckSquare, FiX } from "react-icons/fi";

import useMeasure from "react-use-measure";
import {
  useDragControls,
  useMotionValue,
  useAnimate,
  motion,
  AnimatePresence,
} from "framer-motion"; 


import { signInFailure , signInStart, signInSuccess } from "../../redux/feature/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "flowbite-react";
import { FacebookAuthProvider, getAuth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";

export const SignIn = () => {
  const [open, setOpen] = useState(false);
  const [oopen, setOOpen] = useState(false);
  const [formData, setFormData] = useState({});

    const [notifications, setNotifications] = useState([]);
    const removeNotif = (id) => {
       setNotifications((pv) => pv.filter((n) => n.id !== id));
    };

  const navigate = useNavigate();
  const Dispatch = useDispatch() ; 

  
  const { loading, error: errorMessage } = useSelector((state) => state.user); 
  

  const handleChange = (e) => {
    const FormData = { ...formData, [e.target.id]: e.target.value.trim() };
    console.log('FormData: ' , FormData);
    setFormData(FormData);
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
        Dispatch(signInSuccess(data));
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
        Dispatch(signInSuccess(data));
        navigate("/");
      }
      console.log(firebaseResponse);
    } catch (error) {
      console.log(error);
    }
    console.log("GOOGLE");
  };

  const handleSubmit = async (e) => {

   try{

     e.preventDefault();
     Dispatch(signInStart()); // signIn start Action কে বলে দেওয়া হচ্ছে signIn start। 
     console.log("HELLO");
     console.log(formData);
     const res = await fetch("/api/auth/signIn", {
       method: "POST",
       headers: { "Content-type": "application/json" },
       body: JSON.stringify({
         email: formData.email,
         password: formData.password,
       }),
     });
     console.log("Res: ", res);
     const data = await res.json();
     console.log("data: ", data);
     if (data.success === false) {
            setNotifications((pv) => [
              generateRandomNotif(data.message),
              ...pv,
            ]);

       Dispatch(signInFailure(data.message)); // signInFailure action এ বলে দিচ্ছি কি error আসছে। 
      //  alert("Failed");
       return ;
     }
     if (res.ok) {
      setNotifications((pv) => [generateRandomNotif("SignIn Successfully..."), ...pv]);

       Dispatch(signInSuccess(data.user));
       navigate("/");
     }

   }catch(error){
    setNotifications((pv) => [generateRandomNotif(error.message), ...pv]);

    Dispatch(signInFailure(error.message)); 
   }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        exit={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className=" h-full w-full bg-black">
          <div className="min-h-screen  py-20  flex justify-center items-start">
            <div className=" w-150 gap-4  flex flex-col justify-center ">
              <h1 className="font-pacifico font-bold text-3xl start">
                DarkSphere
              </h1>
              <h1 className="font-bold text-3xl my-1">
                Sign in to your account
              </h1>
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link to={"/signUp"} className="text-red-400">
                  Create one.
                </Link>
              </p>
              {/* <form onSubmit={handleSubmit}> */}

              <div className="flex gap-3  justify-between">
                <button onClick={HandleFacebook} className="flex w-full">

                <Card  href="facebook" Icon={FaFacebook} />

                </button>

                <button onClick={HandleGithub} className="flex w-full">

                <Card  href="github" Icon={FaSquareGithub} />
                </button>
              </div>

              <button onClick={HandleGoogle} className="flex">
                <Card href="google" Icon={FaGoogle} />
              </button>

              <div className="divider text-gray-400">OR</div>

              <label htmlFor="email" className="text-gray-400">
                Email
              </label>
              <input
                id="email"
                onChange={handleChange}
                className="border border-gray-400 rounded py-3 px-2 outline-red-300"
                type="email"
                placeholder="Your.email@provider.com"
                required
              />
              <label htmlFor="email" className="text-gray-400">
                Password
              </label>
              <input
                onChange={handleChange}
                id="password"
                type="password"
                placeholder="Enter Your Password"
                className="border border-gray-400 rounded py-3 px-2 outline-red-300"
                required
              />
              <Link
                to={"/forgetPassword"}
                className="text-xs text-red-500 hover:underline"
              >
                Forgot Password ?
              </Link>

              <button
                disabled={loading}
                onClick={handleSubmit}
                type="submit"
                className="border py-5  border-gray-400 transition-all  rounded btn bg-error text-white  text-xl "
              >
                {loading ? (
                  <>
                    <Spinner size="sm">
                      <span className="pl-3">Loading...</span>
                    </Spinner>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* </form> */}
              <p className="text-gray-400 text-xs">
                By signing in, you agree to our{" "}
                <Link onClick={() => setOOpen(true)} className="text-red-500">
                  {" "}
                  Terms & Conditions{" "}
                </Link>{" "}
                and{" "}
                <span
                  onClick={() => setOpen(true)}
                  className="text-red-500  hover:bg-black-600 hover:cursor-pointer"
                >
                  Privacy Policy.
                </span>
                <DragCloseDrawer open={open} setOpen={setOpen}>
                  <div className="mx-auto max-w-2xl space-y-4 text-neutral-400">
                    <h2 className="text-4xl font-bold text-neutral-200">
                      🔐 Privacy Policy
                    </h2>
                    <p>
                      DarkSphere values your privacy and is committed to
                      protecting your personal information. We may collect basic
                      information such as your name, email address, and any
                      content you choose to publish on our platform. This
                      information is used only to provide a better user
                      experience, manage accounts, and improve our services.
                    </p>
                    <p>
                      We do not sell, trade, or share your personal data with
                      third parties. Cookies may be used to maintain login
                      sessions and understand how users interact with the
                      website. You can disable cookies at any time from your
                      browser settings. While we take reasonable measures to
                      protect your data, please note that no method of
                      transmission over the internet is completely secure. We
                      reserve the right to update this Privacy Policy at any
                      time. Any changes will be reflected on this page.
                    </p>
                    <p>
                      📜 Terms & Conditions By accessing or using DarkSphere,
                      you agree to comply with these Terms & Conditions. You are
                      responsible for any content you post on the platform.
                      Content must not be illegal, offensive, or infringe on the
                      rights of others. We reserve the right to remove any
                      content that violates these rules.
                    </p>
                    <p>
                      Sit laborum molestias ex quisquam molestiae cum fugiat
                      praesentium! Consequatur excepturi quod nemo harum
                      laudantium accusantium nisi odio?
                    </p>
                    <p>
                      You are responsible for maintaining the confidentiality of
                      your account and password. Any activity under your account
                      is your responsibility.
                    </p>
                    <p>
                      You agree not to misuse the website, attempt unauthorized
                      access, or disrupt the platform’s functionality.
                    </p>
                    <p>
                      DarkSphere shall not be held liable for any direct or
                      indirect damages arising from the use of this website.
                    </p>
                    <p>
                      These terms may be updated at any time without prior
                      notice. Continued use of the site means you accept the
                      updated terms.
                    </p>
                  </div>
                </DragCloseDrawer>
                <DragCloseDrawer open={oopen} setOpen={setOOpen}>
                  <div className="mx-auto max-w-2xl space-y-4 text-neutral-400">
                    <h2 className="text-4xl font-bold text-neutral-200">
                      📜 Terms & Conditions – DarkSphere
                    </h2>
                    <p>
                      1. Acceptance of Terms By accessing or using DarkSphere,
                      you agree to be bound by these Terms & Conditions. If you
                      do not agree with any part of these terms, please do not
                      use our website.
                    </p>
                    <p>
                      2. Use of the Website DarkSphere is a blogging platform
                      intended for sharing ideas, knowledge, and creative
                      content. You agree to use the website only for lawful
                      purposes and in a way that does not harm, disrupt, or
                      interfere with other users or the platform itself.
                    </p>
                    <p>
                      3. User Accounts When you create an account on DarkSphere,
                      you are responsible for maintaining the confidentiality of
                      your login credentials. You are fully responsible for all
                      activities that occur under your account. We reserve the
                      right to suspend or terminate accounts that violate these
                      terms.
                    </p>
                    <p>
                      4. User Content You are responsible for any content you
                      post, publish, or share on DarkSphere. Content must not:
                      Be illegal, abusive, hateful, or offensive Violate
                      copyright or intellectual property rights Contain malware,
                      spam, or misleading information DarkSphere reserves the
                      right to remove any content that violates these rules
                      without prior notice.
                    </p>
                    <p>
                      5. Intellectual Property All website design, logos,
                      branding, and original content created by DarkSphere
                      remain the intellectual property of DarkSphere unless
                      otherwise stated. You may not copy or reuse them without
                      permission.
                    </p>
                    <p>
                      6. Privacy Your use of DarkSphere is also governed by our
                      Privacy Policy, which explains how we collect, use, and
                      protect your personal information.
                    </p>
                    <p>
                      7. Limitation of Liability DarkSphere is provided on an
                      “as is” basis. We do not guarantee uninterrupted or
                      error-free service. We shall not be held liable for any
                      direct or indirect damages arising from the use or
                      inability to use the platform.
                    </p>
                    <p>
                      8. Changes to Terms We may update or modify these Terms &
                      Conditions at any time. Continued use of the website after
                      changes means you accept the updated terms.
                    </p>
                  </div>
                </DragCloseDrawer>
                <div className="flex flex-col gap-1 w-72 fixed top-2 right-2 z-50 pointer-events-none">
                  <AnimatePresence>
                    {notifications.map((n) => (
                      <Notification
                        removeNotif={removeNotif}
                        {...n}
                        key={n.id}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const Card = ({ Icon, href }) => {
  
  
  return (
    <>
      <a
        href={href}
        className={`${href === "google" ? "p-2" : "p-2"} w-full rounded border-[1px] relative overflow-hidden group bg-black`}
      >
        <div className=" absolute  inset-0 bg-gradient-to-r from-white  to-red translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-200" />

        <Icon className="absolute  z-10 -top-12 -right-12 text-9xl text-black group-hover:text-red-500 group-hover:rotate-12 transition-transform duration-300" />
        <Icon className="mb-1 text-2xl text-white group-hover:text-black transition-colors relative z-10 duration-300 mx-auto " />
      </a>
    </>
  );
};



const DragCloseDrawer = ({ open, setOpen, children }) => {
  const [scope, animate] = useAnimate();
  const [drawerRef, { height }] = useMeasure();

  const y = useMotionValue(0);
  const controls = useDragControls();

  const handleClose = async () => {
    animate(scope.current, {
      opacity: [1, 0],
    });

    const yStart = typeof y.get() === "number" ? y.get() : 0;

    await animate("#drawer", {
      y: [yStart, height],
    });

    setOpen(false);
  };

  return (
    <>
      {open && (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 bg-neutral-950/70"
        >
          <motion.div
            id="drawer"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{
              ease: "easeInOut",
            }}
            className="absolute bottom-0 h-[75vh] w-full overflow-hidden rounded-t-3xl bg-neutral-900"
            style={{ y }}
            drag="y"
            dragControls={controls}
            onDragEnd={() => {
              if (y.get() >= 100) {
                handleClose();
              }
            }}
            dragListener={false}
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
            dragElastic={{
              top: 0,
              bottom: 0.5,
            }}
          >
            <div className="absolute left-0 right-0 top-0 z-10 flex justify-center bg-neutral-900 p-4">
              <button
                onPointerDown={(e) => {
                  controls.start(e);
                }}
                className="h-2 w-14 cursor-grab touch-none rounded-full bg-neutral-700 active:cursor-grabbing"
              ></button>
            </div>
            <div className="relative z-0 h-full overflow-y-scroll p-4 pt-12">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
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
      className="p-2 flex items-start rounded gap-2 text-xs font-medium shadow-lg text-white bg-[#a02038] pointer-events-auto"
    >
      <FiCheckSquare className=" mt-0.5" />
      <span>{text}</span>
      <button onClick={() => removeNotif(id)} className="ml-auto mt-0.5">
        <FiX />
      </button>
    </motion.div>
  );
};


const generateRandomNotif = (NotificationMessage) => {

  const data = {
    id: Math.random(),
    text: NotificationMessage,
  };

  return data;
};