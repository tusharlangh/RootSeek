import React from "react";
import { RootSeekLoginPageBg, RootSeekLogo } from "./index";
import { animate, AnimatePresence, motion } from "framer-motion";
import LoginPage from "./loginPage";
import SignInPage from "./signinPage";
import { Route, Routes, useLocation } from "react-router-dom";

const UserMain = () => {
  const location = useLocation();
  const pageVariants = {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)", transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 1 } },
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <video
        className="w-full h-full absolute -z-1 object-cover"
        muted
        autoPlay
        loop
        playsInline
      >
        <source src={RootSeekLoginPageBg} type="video/mp4" />
      </video>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Routes location={location}>
            <Route path="login" element={<LoginPage />} />
            <Route path="signin" element={<SignInPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserMain;
