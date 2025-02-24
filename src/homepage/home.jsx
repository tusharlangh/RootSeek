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
        {showCreate && (
          <div className="absolute z-40 w-[100vw] h-[100vh] flex justify-center items-center">
            <Create />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setShowCreate(false)}
            >
              <CloseIcon />
            </div>
          </div>
        )}
        <div className={showCreate ? "opacity-40 pointer-events-none" : ""}>
          <Navbar showCreate={showCreate} setShowCreate={setShowCreate} />
          <Routes>
            <Route path="" element={<ActivityList showCreate={showCreate} />} />
            {/*<Route path="create" element={<Create />} />*/}
          </Routes>
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default Home;
