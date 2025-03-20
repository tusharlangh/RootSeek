import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import SettingsOptions from "./settings-options";
import SettingsPage from "./settings-page";
import Profile from "./Profile";

const Settings = () => {
  const location = useLocation();
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="md:ml-26 mx-2"
        >
          <div className="mt-16 flex gap-2 flex-1">
            <div className="mb-24 bg-[#F8F8F8] dark:bg-[#121212] rounded-md px-3 sm:px-5 py-1 min-h-[92vh]">
              <SettingsOptions />
            </div>
            <div className="rounded-md px-5 w-full py-1 h-screen overflow-y-auto">
              <Routes location={location}>
                <Route path="/account/:path" element={<SettingsPage />} />
              </Routes>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Settings;
