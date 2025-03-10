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
          <div className="">
            <input
              placeholder="Search"
              className="border border-[#F0F0F0] dark:border-[#252525] rounded-md p-2 w-full "
              value={searchContent}
              onChange={(el) => setSearchContent(el.target.value)}
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
