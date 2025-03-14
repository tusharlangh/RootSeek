import React from "react";
import { motion } from "framer-motion";
import { CloseIcon } from "./icons";

const PreviewImage = ({ image, setPreview }) => {
  const DailyTabStyles = "flex justify-center items-center mx-12 rounded-md";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="absolute inset-0"></div>
      <div
        className="absolute top-4 right-4 z-80 cursor-pointer"
        onClick={setPreview}
      >
        <CloseIcon size={7} />
      </div>
      <motion.div
        className={DailyTabStyles}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <img className="object-fit max-h-[45vw] rounded-md" src={image} />
      </motion.div>
    </div>
  );
};

export default PreviewImage;
