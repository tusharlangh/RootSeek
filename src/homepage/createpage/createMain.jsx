import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloseIcon } from "../icons";
import PictureSearch from "./pictureSearch";
import MusicSearch from "./musicSearch";
import ContentPage from "./contentPage";

import axios from "axios";

const CreateMain = ({ setShowCreate }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [creating, setCreating] = useState(false);

  const [selectedSong, setSelectedSong] = useState({});
  const [picture, setPicture] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState();
  const [hashTags, setHashTags] = useState("");

  const token = localStorage.getItem("token");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSongSelect = useCallback((song) => {
    setSelectedSong(song);
  }, []);

  const handlePictureSelect = useCallback((picture) => {
    setPicture(picture);
  }, []);

  const handleHashTags = useCallback((event) => {
    let input = event.target.value.replace(/\s/g, "");
    setHashTags(input);
  });

  useEffect(() => {
    console.log(hashTags);
  }, [hashTags]);

  const pages = [
    {
      name: "picture",
      component: () => (
        <PictureSearch
          onSelectPicture={handlePictureSelect}
          picture={picture}
        />
      ),
    },
    {
      name: "music",
      component: () => (
        <MusicSearch
          handleSongSelect={handleSongSelect}
          selectedSong={selectedSong}
        />
      ),
    },
    {
      name: "content",
      component: () => (
        <ContentPage
          mood={mood}
          setMood={setMood}
          title={title}
          content={content}
          setTitle={setTitle}
          setContent={setContent}
          handleHashTags={handleHashTags}
        />
      ),
    },
  ];

  const onClick = () => {
    if (title === "" || content === "") {
      setErrorMessage("Please fill up the title and the content.");
      return;
    }
    const formData = new FormData();

    setCreating(true);

    formData.append("title", title);
    formData.append("content", content);
    formData.append("mood", mood);
    formData.append("trackId", selectedSong?.id);
    formData.append("trackName", selectedSong?.title);
    formData.append("trackArtist", selectedSong?.artist?.name);
    formData.append("trackAlbumCover", selectedSong?.album?.cover);

    if (picture) {
      formData.append("image", picture);
    }

    axios
      .post("http://localhost:5002/user/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setTitle("");
        setContent("");
        setPicture(null);
        setShowCreate(false);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Something went wrong. Please try again later.");
      });
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
    if (errorMessage !== "") {
      const timeoutId = setTimeout(() => setErrorMessage(""), 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [errorMessage]);

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
          className={`absolute h-full w-full flex justify-center items-center z-[40] ${
            errorMessage === "" ? "hidden" : "block"
          }`}
        >
          <div
            className={`text-white p-3 bg-red-500 rounded-md drop-shadow-xl`}
          >
            {errorMessage}
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-[#121212] relative overflow-hidden">
          <div className="flex border-b border-[#F0F0F0] dark:border-[#171A21] p-1.5 w-full">
            <button
              className={`${
                currentPage === 0 ? "opacity-0" : ""
              } text-sm pl-3 font-medium hover:underline cursor-pointer`}
              onClick={previousPage}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <p className="pr-6 text-center font-semibold text-lg w-full">
              Create a root
            </p>
            <button
              className={`${
                currentPage === pages.length - 1 ? "hidden" : ""
              } text-sm pr-3 font-medium hover:underline cursor-pointer`}
              onClick={nextPage}
              disabled={currentPage === pages.length - 1}
            >
              Next
            </button>
            {currentPage === pages.length - 1 && (
              <button
                className={`pr-2 font-medium hover:underline cursor-pointer`}
                onClick={onClick}
              >
                {creating ? "Creating" : "Create"}
              </button>
            )}
          </div>
          <AnimatePresence mode="popLayout">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              key={pages[currentPage].name}
              className="max-sm:w-[90vw] w-[55vw] h-[80vh] overflow-hidden"
            >
              {pages[currentPage].component()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CreateMain;
