import React, { useEffect } from "react";
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
    "flex justify-center items-center p-6 rounded-xl bg-[#121212] border border-[#252525]";
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={DailyTabStyles}>
        <div className="text-lg lg:text-xl">
          <p className="">Are you sure you want to logout?</p>
          <div className="flex gap-4 mt-4">
            <button
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-sm cursor-pointer transition-all"
              onClick={onClick}
            >
              Yes
            </button>
            <button
              className="px-4 py-2 rounded-sm cursor-pointer hover:bg-[#242424] transition-all"
              onClick={() => setShowLogout(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Logout;
