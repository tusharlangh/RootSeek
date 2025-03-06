import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  HomePageBgVid,
  LoginPageBg2,
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
  });
  return (
    <>
      <div
        className={`bg-white flex justify-center items-center w-full h-screen`}
      >
        <div
          className={`fixed top-3 left-5 z-[100] cursor-pointer ${
            windowSize >= 1110 ? "block" : "hidden"
          }`}
        >
          <img src={Rootseeklogo} className="object-cover h-10" />
        </div>
        <div className={`h-full`}>
          <Navbar
            showCreate={showCreate}
            setShowCreate={setShowCreate}
            setShowLogout={setShowLogout}
          />
          <Routes>
            <Route path="" element={<ActivityList showCreate={showCreate} />} />
            {/*<Route path="create" element={<Create />} />*/}
          </Routes>
          <Sidebar />
          {showCreate && <CreateMain setShowCreate={setShowCreate} />}
          {showLogout && <Logout setShowLogout={setShowLogout} />}
        </div>
      </div>
    </>
  );
};

export default Home;
