import React, { useState, useEffect } from "react";
import DisplayPosts from "./display-posts";
import axios from "axios";
import { motion, AnimatePresence, easeInOut } from "framer-motion";

const ActivityList = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  const DailyTabStyles = `md:ml-24 w-full px-2 overflow-y-auto`;

  useEffect(() => {
    axios
      .get("http://localhost:5002/user/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: easeInOut }}
        className={DailyTabStyles}
      >
        <div
          className={`mt-16 bg-[#F6F6F6] dark:bg-[#121212] px-6 py-5 rounded-md w-full min-h-[92vh]`}
        >
          <p className="text-2xl font-bold mb-4">Your daily log</p>
          <div className="mb-24">
            <DisplayPosts posts={posts} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActivityList;
