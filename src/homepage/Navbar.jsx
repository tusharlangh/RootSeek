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
  const [closeMenu, setCloseMenu] = useState(true);

  const NavBarVariants = {
    initial: { x: "-100%" },
    animate: { x: closeMenu ? "-100%" : "0%" },
    transition: { type: "spring", stiffness: 200, damping: 30 },
  };

  useEffect(() => {
    console.log(location.pathname);
  });

  const menuItems = [
    {
      path: "/home",
      solid: <HomeIconSolid />,
      outline: <HomeIconOutline />,
    },
    {
      path: "/home/search",
      solid: <SearchIconSolid />,
      outline: <SearchIconOutline />,
    },
    {
      path: "/home/create",
      solid: <CreateIconSolid />,
      outline: <CreateIconOutline />,
    },
  ];

  return (
    <>
      <div className="z-50 fixed top-0">
        <div
          className="fixed top-2 left-5 hover:bg-[#242424] cursor-pointer transition-colors p-4 rounded-lg"
          onClick={() => setCloseMenu(!closeMenu)}
        >
          <MenuIcon />
        </div>
      </div>

      <motion.div
        variants={NavBarVariants}
        initial="initial"
        animate="animate"
        transition="transition"
        className="h-full fixed left-0 pt-[35vh] w-24 bg-[#171717] z-40"
      >
        <ul className="flex flex-col justify-center items-center gap-16">
          {menuItems.map(({ path, solid, outline }) => (
            <li
              key={path}
              className={`${
                location.pathname !== path
                  ? "hover:bg-[#242424] cursor-pointer"
                  : ""
              } transition-colors p-4 rounded-lg`}
              onClick={() => {
                navigate(path);
              }}
            >
              {location.pathname === path ? solid : outline}
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
};

export default Navbar;
