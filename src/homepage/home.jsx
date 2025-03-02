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
import { CloseIcon, LockIcon } from "./icons";
import { jwtDecode } from "jwt-decode";
import WindowSize from "../utils";
import Sidebar from "./Sidebar";
import Logout from "./Logout";
import DeletePost from "./deletePost";

const checkTokenExpiration = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  return decodedToken.exp < currentTime;
};

const Home = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

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
      <div
        className={`bg-white flex justify-center items-center w-full h-screen`}
      >
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
          {showCreate && <Create setShowCreate={setShowCreate} />}
          {showLogout && <Logout setShowLogout={setShowLogout} />}
        </div>
      </div>
    </>
  );
};

export default Home;
