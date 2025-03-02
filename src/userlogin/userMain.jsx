import React from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import LoginPage from "./loginPage";
import SignInPage from "./signinPage";
import { Route, Routes, useLocation } from "react-router-dom";
import { HomePageBgVid, LoginPageBg, LoginPageBg2 } from "..";
import VerifPage from "./verifPage";

const UserMain = () => {
  const location = useLocation();
  const pageVariants = {
    initial: { opacity: 0, x: "100%" },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      x: "-100%",
      transition: { duration: 0.7, ease: "easeInOut" },
    },
  };

  return (
    <div className="flex justify-center items-center h-screen w-full rootseekBg">
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
            <Route path="verify" element={<VerifPage />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserMain;
