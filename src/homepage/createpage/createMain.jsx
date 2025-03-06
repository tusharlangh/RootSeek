import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon, Music, PictureIcon } from "../icons";

import PictureSearch from "./pictureSearch";
import MusicSearch from "./musicSearch";
import ContentPage from "./contentPage";

const CreateMain = ({ setShowCreate }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const [selectedSong, setSelectedSong] = useState({});
  const [picture, setPicture] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const pages = [
    {
      name: "picture",
      component: () => <PictureSearch onSelectPicture={handlePictureSelect} />,
    },
    {
      name: "music",
      component: () => <MusicSearch handleSongSelect={handleSongSelect} />,
    },
    {
      name: "content",
      component: () => (
        <ContentPage
          title={title}
          content={content}
          setTitle={setTitle}
          setContent={setContent}
        />
      ),
    },
  ];

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  const handlePictureSelect = (picture) => {
    setPicture(picture);
  };

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    console.log(selectedSong);
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-60">
      <div className="relative absolute inset-0"></div>
      <div className="relative overflow-hidden z-60 w-full h-full flex justify-center items-center">
        <div
          className="absolute top-4 right-4 z-[80] cursor-pointer"
          onClick={() => setShowCreate(false)}
        >
          <CloseIcon size={7} />
        </div>

        <div
          className="rounded-xl bg-white
          border border-[#F0F0F0] relative p-1 overflow-hidden"
        >
          <div className="flex border-b border-[#F0F0F0] p-1 w-full">
            <button
              className="pl-2 font-medium hover:underline cursor-pointer text-[#00b4d8]"
              onClick={previousPage}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <p className="pr-6 text-center font-semibold text-xl w-full">
              Create a root
            </p>
            <button
              className="pr-2 font-medium hover:underline cursor-pointer text-[#00b4d8]"
              onClick={nextPage}
              disabled={currentPage === pages.length - 1}
            >
              Next
            </button>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={pages[currentPage].name}
            className="max-sm:w-[80vw] w-[55vw] h-[80vh] overflow-hidden"
          >
            {pages[currentPage].component()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CreateMain;
