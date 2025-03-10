import React from "react";
import { animate, AnimatePresence, motion } from "framer-motion";
import LoginPage from "./loginPage";
import SignInPage from "./signinPage";
import { Route, Routes, useLocation } from "react-router-dom";
import { HomePageBgVid, LoginPageBg, LoginPageBg2, Rootseeklogo } from "..";
import VerifPage from "./verifPage";

const UserMain = () => {
  const location = useLocation();
  const pageVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
    },
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full rootseekBg">
      <AnimatePresence mode="popLayout">
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
