import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreateIconOutline,
  CreateIconSolid,
  HomeIconOutline,
  HomeIconSolid,
  LogoutIcon,
  MenuIcon,
  SearchIconOutline,
  SearchIconSolid,
  SettingsIconOutline,
  SettingsIconSolid,
} from "./icons";
import { RootSeekTransparent } from "..";
import { useLocation, useNavigate } from "react-router-dom";
import { path } from "framer-motion/client";
import { WindowContext } from "../utils";

const Navbar = ({ showCreate, setShowCreate, setShowLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const windowSize = useContext(WindowContext);
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
      outline: <SearchIconOutline />,
    },
    {
      name: "Create",
      path: "",
      solid: <CreateIconSolid />,
      outline: <CreateIconOutline />,
    },
    {
      name: "Settings",
      path: "",
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
    <>
      <div
        className={`${
          windowSize >= 1110
            ? "h-[100vh] fixed left-0 top-0 pt-[35vh] border-r"
            : windowSize >= 800
            ? "h-[100vh] fixed left-0 top-0 pt-[35vh] border-r"
            : "w-full fixed left-0 bottom-0 py-2 border-t"
        } ${
          windowSize >= 1110 ? "px-4" : "px-2"
        } bg-[#121212] border-[#252525] z-40 rounded-xl`}
      >
        <ul
          className={`flex ${
            windowSize >= 1110
              ? "flex-col"
              : windowSize >= 800
              ? "flex-col"
              : ""
          } justify-center items-center gap-4`}
        >
          {menuItems.map(({ name, path, solid, outline }) => (
            <li
              key={path}
              className={`flex gap-4 ${windowSize >= 1110 ? "w-32" : ""} ${
                location.pathname !== path
                  ? "hover:bg-[#242424] cursor-pointer"
                  : ""
              } transition-colors p-3 rounded-lg`}
              onClick={() => {
                if (name === "Create") {
                  setShowCreate(true);
                } else if (name === "Logout") {
                  setShowLogout(true);
                } else {
                  navigate(path);
                }
              }}
            >
              <div className="">
                {path === "" && name === "Create"
                  ? showCreate
                    ? solid
                    : outline
                  : location.pathname === path
                  ? solid
                  : outline}
              </div>
              {windowSize >= 1110 ? name : ""}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
