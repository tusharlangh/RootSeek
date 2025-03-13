import React, { useEffect, useState } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ThreeDotIcon, TrashIcon } from "./icons";
import PlayMusic from "./play-music";
import PostOptions from "./post-options";

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const DailyTabStyles = `md:ml-26 mx-2 overflow-y-auto`;
  const options =
    "cursor-pointer hover:scale-104 transition-transform duration-300 rounded-full px-4 py-1 text-sm ";
  const [showOptions, setShowOptions] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const navigate = useNavigate();

  const formatTime = () => {
    const formattedTime = new Date(post.date).toLocaleTimeString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5002/user/post/${id}`)
      .then((response) => {
        setPost(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  if (!post) {
    return (
      <div className="w-full flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  const showDeleteMessage = () => {
    setDeleteMessage(true);
    setTimeout(() => navigate("/home"), 3000);
  };

  return (
    <div className="w-full h-[100vh] scroll-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: easeInOut }}
          className={DailyTabStyles + " relative"}
        >
          {deleteMessage && (
            <div className="absolute flex items-center justify-center h-[100vh] w-full bg-red-900/10 z-[100] pr-4">
              <AnimatePresence mode="popLayout">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, ease: easeInOut }}
                  className="w-20 bg-red-500 p-3 rounded-lg"
                >
                  <TrashIcon size={4} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {post.picture && (
            <img
              className="mt-16 absolute inset-0 w-full h-full object-cover opacity-40 -z-10 rounded-md"
              src={"/server/" + post.picture}
              alt="User's uploaded image"
            />
          )}

          <div
            className={`mt-16 ${
              post.picture ? "" : "bg-[#F8F8F8] dark:bg-[#121212] "
            } rounded-md px-6 py-10 w-full min-h-[92vh] py-4 px-4`}
          >
            <div className="flex-col gap-2 items-center">
              <div className="text-4xl sm:text-5xl font-bold">{post.title}</div>
              <div className="font-light mt-2">{formatTime()}</div>
            </div>

            <ul className="flex items-center gap-4 mt-8">
              <li
                className={
                  options + "bg-[#3EA1D2] dark:bg-[#2F85B0] text-white"
                }
              >
                Bookmark
              </li>
              <li
                className={
                  options + "bg-black dark:bg-white text-white dark:text-black"
                }
              >
                #
              </li>
              <li
                className="p-1 rounded-lg hover:bg-[#EEEEEE] dark:hover:bg-[#2A2A2A] hover:scale-104 transition-transform duration-300 cursor-pointer"
                onClick={() => setShowOptions(!showOptions)}
              >
                <ThreeDotIcon />
              </li>
            </ul>
            <div className="absolute left-52">
              {showOptions && (
                <PostOptions id={id} showDeleteMessage={showDeleteMessage} />
              )}
            </div>

            <div className="text-lg font-normal dark:text-[#B3B3B3] mt-6">
              {post.content}
            </div>
            <div className="mt-12">
              <ul className="flex gap-24 flex-wrap max-lg:gap-12">
                {post.picture && (
                  <li className="hidden">
                    <h1 className="text-2xl max-md:text-xl font-semibold mb-2">
                      Featured Image
                    </h1>
                    <img
                      className="rounded-lg w-120 h-120 aspect-[16/9] object-cover"
                      src={"/server/" + post.picture}
                    />
                  </li>
                )}
                {post.trackId !== "undefined" && (
                  <li>
                    <h1 className="text-2xl max-md:text-xl font-semibold mb-2">
                      Song of the moment
                    </h1>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-24 relative">
                        <img
                          className="rounded-lg"
                          src={post.trackAlbumCover}
                        />
                        <div className="absolute top-8 left-8 hover:scale-120 transition-transform duration-500">
                          <PlayMusic trackId={post.trackId} />
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-md font-semibold">
                          {post.trackName}
                        </span>
                        <span className="text-xs text-[#B3B3B3]">
                          {post.trackArtist}
                        </span>
                      </div>
                    </div>
                  </li>
                )}
                {post.mood && (
                  <li>
                    <h1 className="text-2xl max-md:text-xl font-semibold mb-2">
                      Mood of the moment
                    </h1>
                    {post.mood}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ViewPost;
