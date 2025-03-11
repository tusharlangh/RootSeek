import React, { useContext, useEffect, useState } from "react";
import { SearchIconOutline } from "./icons";
import { WindowContext } from "../utils";
import axios from "axios";
import DisplayPosts from "./display-posts";
import { motion, AnimatePresence, easeInOut } from "framer-motion";

const Search = ({ posts }) => {
  const windowSize = useContext(WindowContext);
  const DailyTabStyles = `md:ml-26 mx-2 overflow-y-auto`;

  const token = localStorage.getItem("token");

  return (
    <div className="w-full h-[100vh]">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          className={DailyTabStyles}
        >
          <div className="mt-16 bg-[#F6F6F6] dark:bg-[#121212] rounded-md px-5 py-1 w-full min-h-[92vh]">
            <div className="mt-6 mb-24">
              <DisplayPosts posts={posts} />
            </div>
          </div>
        </motion.div>
        l
      </AnimatePresence>
    </div>
  );
};

export default Search;
