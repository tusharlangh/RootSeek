import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  HomePageBgVid,
  LoginPageBg2,
  Rootseekdark,
  Rootseeklogo,
  RootSeekTransparentWhite,
} from "..";
import ActivityList from "./ActivityList";
import {
  Link,
  Route,
  Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Create from "./createpage/create";
import { CloseIcon, LockIcon } from "./icons";
import { jwtDecode } from "jwt-decode";
import WindowSize, { WindowContext } from "../utils";
import Sidebar from "./Sidebar";
import Logout from "./Logout";
import DeletePost from "./deletePost";
import CreateMain from "./createpage/createMain";
import Search from "./search";
import { motion, AnimatePresence, easeInOut } from "framer-motion";

const checkTokenExpiration = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp < currentTime;
};

const Home = () => {
  const windowSize = useContext(WindowContext);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [showCreate, setShowCreate] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    console.log(windowSize);
    if (!token) {
      navigate("/user/login?sessionExpired=true");
    }

    if (checkTokenExpiration()) {
      localStorage.removeItem("token");
    }
  }, [token, navigate]);
  return (
    <>
      <div className={`flex justify-center items-center w-full h-screen`}>
        <div
          className={`text-black dark:text-white logo text-3xl fixed top-4 left-5 z-[100] cursor-pointer ${
            windowSize >= 1110 ? "block" : "hidden"
          }`}
        >
          RootSeek
        </div>

        <div className={`h-full`}>
          <Navbar
            showCreate={showCreate}
            setShowCreate={setShowCreate}
            setShowLogout={setShowLogout}
          />
          <AnimatePresence mode="popLayout">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: easeInOut }}
            >
              <Routes location={location}>
                <Route
                  path=""
                  element={<ActivityList showCreate={showCreate} />}
                />
                <Route path="search" element={<Search />} />
              </Routes>
            </motion.div>
          </AnimatePresence>

          <Sidebar />
          {showCreate && <CreateMain setShowCreate={setShowCreate} />}
          {showLogout && <Logout setShowLogout={setShowLogout} />}
        </div>
      </div>
    </>
  );
};

export default Home;
