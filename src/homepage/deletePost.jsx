import React, { useState } from "react";
import { motion } from "framer-motion";
import { ThreeDotIcon } from "./icons";

const DeletePost = () => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deletePostStyles = `w-42 bg-[#121212] border border-[#252525] rounded-sm overflow-hidden`;
  return (
    <motion.div
      className={deletePostStyles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ul className="flex flex-col justify-center items-center">
        <li className="hover:bg-[#242424] transition-all cursor-pointer p-2 text-red-500 border-b border-[#252525] w-full text-center">
          Delete
        </li>
        <li className="hover:bg-[#242424] transition-all cursor-pointer p-2 w-full text-center">
          Share
        </li>
      </ul>
    </motion.div>
  );
};

export default DeletePost;
