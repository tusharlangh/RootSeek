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
      outline: <SearchIconOutline size={6} />,
    },
    {
      name: "Create",
      path: "",
      solid: <CreateIconSolid />,
      outline: <CreateIconOutline />,
    },
    {
      name: "Settings",
      path: "/settings",
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
      className={`fixed left-0 ${
        isLargeScreen || isMediumScreen
          ? "top-0 h-[100vh] pt-[35vh] border-r"
          : "bottom-0 w-full py-2 border-t"
      } px-${
        isLargeScreen ? "4" : "2"
      } bg-[#F9F9F9] border border-[#F0F0F0] z-40 rounded-xl`}
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
              className={`flex gap-4 ${isLargeScreen ? "w-32" : ""} ${
                !isActive ? "hover:bg-[#EEEEEE] cursor-pointer" : ""
              } transition-colors p-3 rounded-lg`}
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
              {isLargeScreen && name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navbar;
