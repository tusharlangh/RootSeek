import React, { useContext, useEffect, useState } from "react";
import {
  CloseIcon,
  GlobeIcon,
  Hashtag,
  MapPin,
  Music,
  PictureIcon,
  RecordIcon,
  SmileIcon,
  TrashIcon,
} from "../icons";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MusicSearch from "../musicSearch";

const Loading = () => (
  <motion.div
    className="w-6 h-6 border-3 border-gray-200 border-t-white rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

const Create = ({ setShowCreate }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");
  const [create, setCreate] = useState("Create");

  const [picture, setPicture] = useState(null);
  const [pictureURL, setPictureURL] = useState(null);

  const [showSongSelection, selectShowSongSelection] = useState(false);

  const DailyTabStyles =
    "max-sm:w-[80vw] w-[55vw] rounded-xl bg-white border border-[#F0F0F0] relative";

  const btnStyle =
    "btn font-medium px-8 py-3 cursor-pointer rounded-md transition duration-300 ease-in-out hover:scale-104 hover:shadow-md ml-4";

  const onClick = (e) => {
    e.preventDefault();

    setCreate(Loading);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("mood", "happy");
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
        setCreate("Create");
      })
      .catch((error) => {
        setCreate("Error");
        setTimeout(() => setCreate("Create"), 3000);
        console.error(error);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPicture(file);
    setPictureURL(URL.createObjectURL(file));
  };

  const handleDeletePic = () => {
    setPicture(null);
    setPictureURL(null);
  };

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

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

        <AnimatePresence>
          <motion.div
            className={DailyTabStyles}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {showSongSelection && (
              <div className="absolute top-4 right-10 z-[100]">
                <MusicSearch onSelectSong={handleSongSelect} />
              </div>
            )}
            <form className="flex flex-col gap-4 p-5" onSubmit={onClick}>
              <input
                type="text"
                placeholder="Title"
                className="bg-[#FAFAFA] border border-[#DEDEDE] rounded-md p-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                type="text"
                placeholder="Content"
                className="bg-[#FAFAFA] h-52 border border-[#DEDEDE] rounded-md p-3 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div className="flex justify-between">
                <ul className="flex gap-2 flex-wrap">
                  <label className="bg-[#F2F2F2] p-3 rounded-md cursor-pointer hover:scale-105 transition-all">
                    <PictureIcon />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>

                  <li className="bg-[#F2F2F2] p-3 rounded-md cursor-pointer hover:scale-105 transition-all">
                    <SmileIcon />
                  </li>
                  <li className="bg-[#F2F2F2] p-3 rounded-md cursor-pointer hover:scale-105 transition-all">
                    <GlobeIcon />
                  </li>
                  <li className="bg-[#F2F2F2] p-3 rounded-md cursor-pointer hover:scale-105 transition-all">
                    <MapPin />
                  </li>
                  <li
                    className="bg-[#F2F2F2] p-3 rounded-md cursor-pointer hover:scale-105 transition-all"
                    onClick={() => selectShowSongSelection(!showSongSelection)}
                  >
                    <Music />
                  </li>
                </ul>

                <button type="submit" className={btnStyle + " h-12"}>
                  {create}
                </button>
              </div>
              {picture && (
                <div className="relative object-cover flex items-center justify-center bg-[#F2F2F2] rounded-md cursor-pointer w-26 group">
                  <img
                    src={pictureURL}
                    className="rounded-md"
                    alt="your image"
                  />
                  <div
                    className="bg-black/70 p-0.5 rounded-full absolute -top-2 -right-2 z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    onClick={handleDeletePic}
                  >
                    <CloseIcon size={5} />
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Create;
