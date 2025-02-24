import React, { useContext, useEffect, useState } from "react";
import {
  AddIcon,
  AddIconBlack,
  CheckmarkIcon,
  GlobeIcon,
  Hashtag,
  MapPin,
  PictureIcon,
  RecordIcon,
  SendIcon,
  SmileIcon,
} from "../icons";
import axios from "axios";
import { motion } from "framer-motion";

const Loading = () => (
  <motion.div
    className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full"
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  />
);

const Create = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState("send");

  const DailyTabStyles =
    "max-sm:w-[80vw] w-[55vw] rounded-xl bg-[#121212] border border-[#252525]";

  const onClick = (e) => {
    e.preventDefault();
    const dataToSend = {
      title: title,
      content: content,
      mood: "happy",
    };
    setStatus("loading");

    axios
      .post("http://localhost:5002/user/create", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setStatus("checked");
        setTitle("");
        setContent("");
        setTimeout(() => setStatus("send"), 3000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="">
      <div className={DailyTabStyles}>
        <form className="flex flex-col gap-4 px-4 py-4">
          <input
            type="text"
            placeholder="Title"
            className="bg-[#1F1F1F] border border-[#252525] rounded-sm p-3"
          />
          <textarea
            type="text"
            placeholder="Content"
            className="h-40 bg-[#1F1F1F] border border-[#252525] rounded-sm p-3 resize-none"
          />
          <div className="flex justify-between">
            <ul className="flex gap-2">
              <li className="bg-[#1F1F1F] p-3 rounded-sm cursor-pointer hover:scale-105 transition-all">
                <PictureIcon />
              </li>
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
            </ul>

            <button
              type="submit"
              className="bg-white hover:bg-[#E6E6E6] transition-all p-2 rounded-sm w-20 text-black font-medium"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
