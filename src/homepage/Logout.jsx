import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Logout = ({ setShowLogout }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const onClick = () => {
    localStorage.removeItem("token");
    navigate("/user/login");
  };

  const DailyTabStyles =
    "flex justify-center items-center p-3.5 rounded-xl bg-[#FCFCFC] dark:bg-[#181818]";
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
      onClick={() => setShowLogout(false)}
    >
      <div className="absolute inset-0"></div>
      <div className="relative overflow-hidden z-50 w-full h-full flex justify-center items-center">
        <motion.div
          className={DailyTabStyles}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-medium">
            <p className="font-medium">Are you sure you want to logout?</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer transition-all"
                onClick={onClick}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 rounded-md cursor-pointer hover:bg-[#EEEEEE] dark:hover:bg-[#2A2A2A] transition-all"
                onClick={() => setShowLogout(false)}
              >
                No
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Logout;
