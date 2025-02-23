import React, { useEffect, useState } from "react";
import {
  AddIcon,
  AddIconBlack,
  CheckmarkIcon,
  GlobeIcon,
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
    "relative flex flex-col bg-[#F9F9F9] max-w-[90vw] lg:max-w-[70vw] py-12 w-full rounded-3xl drop-shadow-2xl lg:ml-24 overflow-hidden justify-center items-center shadow-xl";

  const inputStyle =
    "rounded-2xl py-4 px-4 cursor-pointer transition-colors resize-none w-full h-full text-xl outline-none";

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
    <div className={DailyTabStyles}>
      <div className="flex flex-col justify-center items-center h-full w-[80vw] lg:w-[60vw] gap-8">
        <h1 className="text-3xl text-black font-semibold">Create a new Root</h1>
        <form
          className="flex flex-col gap-4 justify-center items-center shadow-sm rounded-2xl border border-gray-300 w-full"
          onSubmit={onClick}
        >
          <input
            className="w-full pt-4 pb-2 px-4 outline-none shadow-xs"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows="3"
            className={inputStyle}
            type="text"
            placeholder="Start typing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="w-full flex p-4 justify-end">
            <button
              className="text-center bg-[#F9F9F9] border border-gray-300 hover:bg-[#F3F3F3] rounded-4xl p-3 max-w-13 transition-colors"
              type="submit"
            >
              {status === "send" ? (
                <SendIcon />
              ) : status === "loading" ? (
                <Loading />
              ) : (
                <CheckmarkIcon />
              )}
            </button>
          </div>
        </form>

        <div className="flex gap-2 cursor-pointer w-full items-center justify-end">
          <div className="text-center bg-[#F9F9F9] border border-gray-300 hover:bg-[#F3F3F3] rounded-4xl p-3 max-w-13 transition-colors">
            <RecordIcon />
          </div>
          <div className="text-center bg-[#F9F9F9] border border-gray-300 hover:bg-[#F3F3F3] rounded-4xl p-3 max-w-13 transition-colors">
            <SmileIcon />
          </div>
          <div className="text-center bg-[#F9F9F9] border border-gray-300 hover:bg-[#F3F3F3] rounded-4xl p-3 max-w-13 transition-colors">
            <AddIconBlack />
          </div>
          <div className="text-center bg-[#F9F9F9] border border-gray-300 hover:bg-[#F3F3F3] rounded-4xl p-3 max-w-13 transition-colors">
            <GlobeIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
