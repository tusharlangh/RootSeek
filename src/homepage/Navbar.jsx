import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreateIconOutline,
  CreateIconSolid,
  HomeIconOutline,
  HomeIconSolid,
  LogoutIcon,
  SearchIconOutline,
  SearchIconSolid,
  SettingsIconOutline,
  SettingsIconSolid,
} from "./icons";
import { WindowContext } from "../utils";

const Navbar = ({ showCreate, setShowCreate, setShowLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const windowSize = useContext(WindowContext);

  const isLargeScreen = windowSize >= 1110;
  const isMediumScreen = windowSize >= 800;

  const menuItems = [
    {
      name: "Home",
      path: "/home",
      solid: <HomeIconSolid />,
      outline: <HomeIconOutline />,
    },
    {
      name: "Search",
      path: "/home/search",
      solid: <SearchIconSolid />,
      outline: <SearchIconOutline size={6.5} />,
    },
    {
      name: "Create",
      path: "",
      solid: <CreateIconSolid />,
      outline: <CreateIconOutline />,
    },
    {
      name: "Settings",
      path: "/home/settings",
      solid: <SettingsIconSolid />,
      outline: <SettingsIconOutline />,
    },
    {
      name: "Logout",
      path: "",
      solid: <LogoutIcon />,
      outline: <LogoutIcon />,
    },
  ];

  return (
    <div
      className={`fixed flex justify-center items-center ${
        isLargeScreen || isMediumScreen
          ? "top-0 h-[100vh]"
          : "bottom-0 w-full py-2"
      } px-${
        isLargeScreen ? "4" : "4"
      } z-40 bg-[#F8F8F8] dark:bg-[#121212] rounded-md mt-16 md:ml-2`}
    >
      <ul
        className={`flex ${
          isLargeScreen || isMediumScreen ? "flex-col" : ""
        } justify-center items-center gap-4`}
      >
        {menuItems.map(({ name, path, solid, outline }) => {
          const isActive = location.pathname === path;
          return (
            <li
              key={name}
              className={`flex gap-4 ${isLargeScreen ? "" : ""} ${
                !isActive
                  ? "hover:bg-[#EEEEEE] dark:hover:bg-[#2A2A2A] duration-400 hover:scale-104 transition-transform duration-300 cursor-pointer"
                  : "bg-[#EEEEEE] dark:bg-[#2A2A2A]"
              } transition-colors p-3.5 rounded-lg`}
              onClick={() => {
                if (name === "Create") setShowCreate(true);
                else if (name === "Logout") setShowLogout(true);
                else if (path) navigate(path);
              }}
            >
              <div>
                {name === "Create" && showCreate
                  ? solid
                  : isActive
                  ? solid
                  : outline}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navbar;
