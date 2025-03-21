import React, { useContext, useEffect, useState } from "react";
import { DefaultPfp } from "..";
//import { WindowContext } from "../utils";
import axios from "axios";
import { SearchIconOutline } from "./icons";
import { WindowContext } from "../utils";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const Sidebar = ({ togglePosts }) => {
  const token = localStorage.getItem("token");
  const windowSize = useContext(WindowContext);
  const [searchContent, setSearchContent] = useState("");
  const location = useLocation();

  useEffect(() => {
    axios
      .get(
        `http://localhost:5002/search/posts?q=${encodeURIComponent(
          searchContent
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        togglePosts(response.data);
      })
      .catch((error) => {
        return;
      });
  }, [searchContent]);

  useEffect(() => {
    console.log(location.pathname);
  });

  return (
    <motion.div
      className={`flex justify-center items-center bg-white dark:bg-black fixed py-2 w-full z-[10]`}
    >
      <div
        className={`text-black dark:text-white logo text-2xl fixed top-4 left-5 z-[100] cursor-pointer ${
          windowSize >= 1110 ? "block" : "hidden"
        }`}
      >
        RootSeek
      </div>

      {location.pathname === "/home/search" && (
        <form>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="absolute top-2.75 left-3">
              <SearchIconOutline size={6} />
            </div>
            <input
              type="text"
              placeholder="Search root"
              value={searchContent}
              onChange={(el) => setSearchContent(el.target.value)}
              className="w-92 md:w-120 text-lg font-light pl-10 bg-[#F9F9F9] dark:bg-[#181818] 
             border border-[#F0F0F0] dark:border-[#121212] 
             hover:border-[#F0F0F0] dark:hover:border-[#404040] 
             hover:bg-white dark:hover:bg-[#2A2A2A] 
             transition-colors duration-400 rounded-md p-2"
            />
          </motion.div>
        </form>
      )}

      <div className="absolute top-2 right-0 flex items-center gap-2 mx-2">
        <div className="flex rounded-full w-12 overflow-hidden border-[#F0F0F0] dark:border-[#282828] border-2">
          <img src={DefaultPfp} draggable={false} />
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
