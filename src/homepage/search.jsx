import React, { useContext, useEffect, useState } from "react";
import { SearchIconOutline } from "./icons";
import { WindowContext } from "../utils";
import axios from "axios";
import DisplayPosts from "./display-posts";
import { motion, AnimatePresence, easeInOut } from "framer-motion";

const Search = () => {
  const windowSize = useContext(WindowContext);
  const DailyTabStyles = `${
    windowSize >= 1110
      ? "w-[60vw]"
      : windowSize >= 800
      ? "w-[60vw]"
      : "w-[90vw]"
  } overflow-y-auto`;

  const token = localStorage.getItem("token");
  const [searchContent, setSearchContent] = useState("");
  const [posts, setPosts] = useState([]);

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
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [searchContent]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: easeInOut }}
        className={DailyTabStyles}
      >
        <form className="w-full mt-24 px-1">
          <div className="relative">
            <div className="absolute top-2.75 left-3">
              <SearchIconOutline size={6} />
            </div>

            <input
              type="text"
              placeholder="Search root"
              value={searchContent}
              onChange={(el) => setSearchContent(el.target.value)}
              className="text-lg font-light w-full pl-10 bg-[#F9F9F9] dark:bg-[#13151B] 
             border border-[#F0F0F0] dark:border-[#171A21] 
             hover:border-[#F0F0F0] dark:hover:border-[#171A21] 
             hover:bg-white dark:hover:bg-[#1A1D24] 
             transition-colors duration-400 rounded-md p-2"
            />
          </div>
        </form>
        <div className="mt-6 mb-24">
          <DisplayPosts posts={posts} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Search;
