import React from "react";
import { motion } from "framer-motion";
import { TrashIcon } from "./icons";

const DeletePost = ({ setShowDelete, setConfirmDelete }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-60">
      <div className="absolute inset-0"></div>

      <motion.div
        className="w-78 bg-white dark:bg-[#13151B] border border-[#F0F0F0] dark:border-[#171A21] rounded-md overflow-hidden z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col justify-center items-center mt-4">
          <p className="text-xl">Delete this root?</p>
          <p className="text-sm mt-2">The root will be permanently deleted.</p>
          <div className="w-full mt-4">
            <button
              className="p-3 text-red-500 hover:bg-[#EEEEEE] dark:hover:bg-[#1E2025] border-t border-[#E6E6E6] dark:border-[#171A21] cursor-pointer flex justify-center transition-all w-full"
              onClick={() => {
                setShowDelete(false);
                setConfirmDelete(true);
              }}
            >
              <TrashIcon />
            </button>
            <button
              className="p-3 hover:bg-[#EEEEEE] dark:hover:bg-[#1E2025] border-t border-[#E6E6E6] dark:border-[#171A21] cursor-pointer transition-all w-full"
              onClick={() => setShowDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeletePost;
