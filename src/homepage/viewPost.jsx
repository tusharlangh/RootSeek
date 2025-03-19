import React, { useEffect, useState } from "react";
import { AnimatePresence, easeInOut, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { HeartIcon, ThreeDotIcon, TrashIcon } from "./icons";
import PlayMusic from "./play-music";
import PostOptions from "./post-options";

const ViewPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const DailyTabStyles = `md:ml-26 mx-2 overflow-y-auto`;
  const options =
    "cursor-pointer hover:scale-104 transition-transform duration-300 rounded-full px-2 sm:px-4 py-1 text-xs sm:text-sm ";
  const [showOptions, setShowOptions] = useState(false);
  const [like, setLike] = useState(false);

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

  const getHashTags = () => {
    const hashTags = post.hashTags.split("#").filter((h) => h.length > 0);
    return hashTags;
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
            <div className="relative">
              <ul className="flex items-center gap-2 mt-8">
                <li
                  className={
                    options + "bg-[#E53981] text-white flex items-center gap-1"
                  }
                  onClick={() => setLike(!like)}
                >
                  <HeartIcon size={5} fill={like} />
                  Like
                </li>

                {post.hashTags &&
                  getHashTags().map((hashTag, index) => (
                    <li
                      key={index}
                      className={
                        "rounded-full px-2 sm:px-4 py-1 text-xs sm:text-sm bg-black dark:bg-white text-white dark:text-black"
                      }
                    >
                      #{hashTag}
                    </li>
                  ))}

                <li className="relative">
                  <div
                    className="p-1 rounded-lg hover:bg-[#EEEEEE] dark:hover:bg-[#2A2A2A] hover:scale-104 transition-transform duration-300 cursor-pointer"
                    onClick={() => setShowOptions(!showOptions)}
                  >
                    <ThreeDotIcon />
                  </div>

                  <div className="absolute top-12 w-42">
                    {showOptions && <PostOptions id={id} />}
                  </div>
                </li>
              </ul>
            </div>

            <div className="text-lg font-normal dark:text-[#B3B3B3] mt-6">
              {post.content}
            </div>
            <div className="mt-12">
              <ul className="flex gap-24 flex-wrap max-lg:gap-12">
                {post.trackId !== "undefined" && (
                  <li>
                    <h1 className="text-2xl max-md:text-xl font-semibold mb-2">
                      Song of the moment
                    </h1>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
                        <img
                          className="rounded-lg"
                          src={post.trackAlbumCover}
                        />
                        <div className="text-white w-8 sm:w-9 absolute top-6 left-6 sm:top-7.5 sm:left-7.5 hover:scale-120 transition-transform duration-500">
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
