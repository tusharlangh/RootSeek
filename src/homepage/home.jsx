import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { HomePageBgVid, LoginPageBg2, RootSeekTransparentWhite } from "..";
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

        <Routes>
          <Route path="" element={<ActivityList />} />
          <Route path="create" element={<Create />} />
        </Routes>
      </div>
    </>
  );
};

export default Home;
