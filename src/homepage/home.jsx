import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { HomePageBgVid, RootSeekTransparentWhite } from "..";
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
import { LockIcon } from "./icons";
import { jwtDecode } from "jwt-decode";

const checkTokenExpiration = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp < currentTime;
};

const Home = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/user/login?sessionExpired=true");
    }

    if (checkTokenExpiration()) {
      localStorage.removeItem("token");
    }
  });
  return (
    <>
      <div className={`flex justify-center items-center w-full h-screen`}>
        <Navbar />
        <video
          className="w-full h-full absolute -z-1 object-cover"
          muted
          autoPlay
          loop
          playsInline
        >
          <source src={HomePageBgVid} type="video/mp4" />
        </video>

        <Routes>
          <Route path="" element={<ActivityList />} />
          <Route path="create" element={<Create />} />
        </Routes>

        {/*
        logo here
        <div className="hidden md:block absolute top-4 h-1 w-10 cursor-pointer ">
          <img src={RootSeekTransparentWhite} />
        </div>
        */}
      </div>
    </>
  );
};

export default Home;
