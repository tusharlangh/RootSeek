import React from "react";
import { motion } from "framer-motion";

const DeleteDraft = ({ setShowCreate, setDiscardPost }) => {
  return (
    <div className="">
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-60">
        <div className="relative absolute inset-0"></div>
        <motion.div
          className="bg-[#EBEBEB] dark:bg-[#282828] rounded-md p-3.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-medium">
            <p className="font-medium">
              If you leave, your root will not be saved.
            </p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer transition-all"
                onClick={() => setShowCreate(false)}
              >
                Discard root
              </button>
              <button
                className="px-4 py-2 rounded-md cursor-pointer hover:bg-[#D7D7D7] dark:hover:bg-[#464646] transition-all"
                onClick={() => setDiscardPost(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeleteDraft;
