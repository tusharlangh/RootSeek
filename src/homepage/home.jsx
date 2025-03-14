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
import { CloseIcon, LockIcon } from "./icons";
import { jwtDecode } from "jwt-decode";
import WindowSize, { WindowContext } from "../utils";
import Sidebar from "./Sidebar";
import Logout from "./Logout";
import CreateMain from "./createpage/createMain";
import Search from "./search";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import ViewPost from "./viewPost";

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

  const [posts, setPosts] = useState([]);

  const togglePosts = (posts) => {
    setPosts(posts);
  };

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
        {/*
        <div
          className={`text-black dark:text-white logo text-2xl fixed top-4 left-5 z-[100] cursor-pointer ${
            windowSize >= 1110 ? "block" : "hidden"
          }`}
        >
          RootSeek
        </div>
        */}

        <div className={`w-full h-full md:flex md:justify-between`}>
          <Navbar
            showCreate={showCreate}
            setShowCreate={setShowCreate}
            setShowLogout={setShowLogout}
          />

          <Sidebar posts={posts} togglePosts={togglePosts} />

          <Routes location={location}>
            <Route path="/home" element={<ActivityList />} />
            <Route path="/home/search" element={<Search posts={posts} />} />
            <Route path="/home/root/:id" element={<ViewPost />} />
          </Routes>

          {showCreate && <CreateMain setShowCreate={setShowCreate} />}
          {showLogout && <Logout setShowLogout={setShowLogout} />}
        </div>
      </div>
    </>
  );
};

export default Home;
