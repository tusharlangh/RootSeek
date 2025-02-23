import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CreateIconOutline,
  CreateIconSolid,
  HomeIconOutline,
  HomeIconSolid,
  MenuIcon,
  SearchIconOutline,
  SearchIconSolid,
} from "./icons";
import { RootSeekTransparent } from "..";
import { useLocation, useNavigate } from "react-router-dom";
import { path } from "framer-motion/client";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
  });

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
      path: "/home/create",
      solid: <CreateIconSolid />,
      outline: <CreateIconOutline />,
    },
  ];

  return (
    <>
      <div className="h-full fixed left-0 top-0 pt-[35vh] w-44 bg-black border-r border-[#252525] z-40">
        <ul className="flex flex-col justify-center items-center gap-4">
          {menuItems.map(({ name, path, solid, outline }) => (
            <li
              key={path}
              className={`flex gap-4 ${
                location.pathname !== path
                  ? "hover:bg-[#242424] cursor-pointer"
                  : ""
              } transition-colors p-4 rounded-lg`}
              onClick={() => {
                navigate(path);
              }}
            >
              {location.pathname === path ? solid : outline} {name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
