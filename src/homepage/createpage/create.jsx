import React, { useContext, useEffect, useState } from "react";
import {
  GlobeIcon,
  Hashtag,
  MapPin,
  Music,
  PictureIcon,
  RecordIcon,
  SmileIcon,
} from "../icons";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Loading = () => (
  <motion.div
    className="w-6 h-6 border-3 border-gray-300 border-t-black rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

const Create = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [picture, setPicture] = useState(null);
  const token = localStorage.getItem("token");
  const [create, setCreate] = useState("Create");

  const DailyTabStyles =
    "max-sm:w-[80vw] w-[55vw] rounded-xl bg-[#121212] border border-[#252525]";

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
    setPicture(e.target.files[0]);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={DailyTabStyles}>
          <form className="flex flex-col gap-4 px-4 py-4" onSubmit={onClick}>
            <input
              type="text"
              placeholder="Title"
              className="bg-[#1F1F1F] border border-[#252525] rounded-sm p-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              type="text"
              placeholder="Content"
              className="h-40 bg-[#1F1F1F] border border-[#252525] rounded-sm p-3 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="flex justify-between">
              <ul className="flex gap-2 flex-wrap">
                <label className="bg-[#1F1F1F] p-3 rounded-sm cursor-pointer hover:scale-105 transition-all">
                  <PictureIcon />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                <li className="bg-[#1F1F1F] p-3 rounded-sm cursor-pointer hover:scale-105 transition-all">
                  <RecordIcon />
                </li>
                <li className="bg-[#1F1F1F] p-3 rounded-sm cursor-pointer hover:scale-105 transition-all">
                  <SmileIcon />
                </li>
                <li className="bg-[#1F1F1F] p-3 rounded-sm cursor-pointer hover:scale-105 transition-all">
                  <GlobeIcon />
                </li>
                <li className="bg-[#1F1F1F] p-3 rounded-sm cursor-pointer hover:scale-105 transition-all">
                  <MapPin />
                </li>
                <li className="bg-[#1F1F1F] p-3 rounded-sm cursor-pointer hover:scale-105 transition-all">
                  <Hashtag />
                </li>
                <li className="bg-[#1F1F1F] p-3 rounded-sm cursor-pointer hover:scale-105 transition-all">
                  <Music />
                </li>
              </ul>

              <button
                type="submit"
                className="ml-4 bg-[#2AA3A3] hover:bg-[#E6E6E6] transition-all p-2 rounded-sm w-20 h-12 text-black font-medium flex justify-center items-center "
              >
                {create}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Create;
