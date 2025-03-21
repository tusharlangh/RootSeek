import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Profile from "./profileContents/Profile";

const SettingsPage = () => {
  const { page } = useParams();

  useEffect(() => {
    console.log("this is the page:" + page);
  });

  const pageComponents = {
    profile: <Profile />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="mt-6 flex justify-center items-center "
      >
        {pageComponents[page] || <Profile />}
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsPage;
