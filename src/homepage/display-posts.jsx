import react, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  EditIcon,
  ExpandIcon,
  PauseIcon,
  PlayIcon,
  ThreeDotIcon,
  TrashIcon,
} from "./icons";
import { WindowContext } from "../utils";
import DeletePost from "./deletePost";
import PreviewImage from "./previewImage";

const DisplayPosts = ({ posts }) => {
  const windowSize = useContext(WindowContext);
  const [showOptions, setShowOptions] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isHover, setIsHover] = useState({});

  const handleHoverStart = (postId) => {
    setIsHover((prevState) => ({
      ...prevState,
      [postId]: true,
    }));
  };

  const handleHoverEnd = (postId) => {
    setIsHover((prevState) => ({
      ...prevState,
      [postId]: false,
    }));
  };

  const audioRef = useRef({});
  const trackCache = useRef({});

  const [info, setInfo] = useState({
    seeMore: {},
    showOptions: {},
    previewImages: {},
    isPlaying: {},
    track: {},
  });

  const formatTime = (post) => {
    const formattedTime = new Date(post.date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime;
  };

  if (posts.length === 0) {
    return (
      <div className="w-[100vw] h-[100vh] flex justify-center items-center pb-42 pr-42">
        <motion.div
          className="w-7 h-7 border-3 dark:border-t-[#121200] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  const toggleSeeMore = (post_id) => {
    setInfo((prevInfo) => ({
      ...prevInfo,
      seeMore: {
        ...prevInfo.seeMore,
        [post_id]: !prevInfo.seeMore[post_id],
      },
    }));
  };

  const toggleOptions = (post_id) => {
    setShowOptions((prev) => ({
      ...prev,
      [post_id]: !prev[post_id], //the [] in [post_id] is used because we are trying to get the key using the variable.
    }));
  };

  const toggleImage = (post_id) => {
    setPreviewImages((prev) => ({
      ...prev,
      [post_id]: !prev[post_id],
    }));
  };

  const findRoot = () => {
    for (const key in showOptions) {
      if (showOptions[key]) {
        return key;
      }
    }
  };

  const deletePost = () => {
    const _id = findRoot();
    axios
      .delete(`http://localhost:5002/user/delete/${_id}`)
      .then((response) => console.log(response.data.message))
      .catch((error) => console.error(error.response.data.message));
  };

  if (confirmDelete) {
    deletePost();
  }

  const updateSongPlaying = (id) => {
    setInfo((prevInfo) => ({
      ...prevInfo,
      isPlaying: {
        ...prevInfo.isPlaying,
        [id]: !prevInfo.isPlaying[id],
      },
    }));
  };

  const togglePlayPause = (id, trackId) => {
    const audio = audioRef.current[id];
    if (!audio) return;

    audio.onended = () => {
      audio.play();
    };

    if (audio) {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }
    updateSongPlaying(id);
  };

  const retriveSong = (id, trackId) => {
    if (trackCache.current[id]) return; // Check cache before making request

    trackCache.current[id] = true;

    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/${trackId}`
      )
      .then((response) => {
        const previewUrl = response.data.preview;
        setInfo((prevInfo) => ({
          ...prevInfo,
          track: {
            ...prevInfo.track,
            [id]: previewUrl,
          },
        }));
      })
      .catch((error) => console.error(error));
  };

  const run = () => {
    for (let post of posts) {
      const trackId = post.trackId;
      if (trackId) {
        retriveSong(post._id, trackId);
      }
    }
  };

  run();

  return (
    <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-8 w-full">
      {showDelete && (
        <DeletePost
          setConfirmDelete={setConfirmDelete}
          setShowDelete={setShowDelete}
        />
      )}
      {posts.map((post) => (
        <motion.div
          key={post._id}
          initial={{ scale: 1, height: "100px" }}
          whileHover={{ scale: 1.03, height: "165px" }}
          onHoverStart={() => handleHoverStart(post._id)}
          onHoverEnd={() => handleHoverEnd(post._id)}
          transition={{ duration: 0.4 }}
          className={`w-full py-4 px-4 rounded-lg box_shadow bg-[#FCFCFC] dark:bg-[#181818] dark:hover:bg-[#282828] transition-colors duration-500 group`}
        >
          <div className="font-extrabold text-xs absolute bottom-3 right-3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white dark:text-black bg-black dark:bg-white rounded-full w-8 h-8 flex items-center justify-center leading-2.5 z-[20]">
            <ExpandIcon />
          </div>
          <div className="relative flex flex-col gap-2 justify-between">
            <div className="">
              <div className="relative flex items-center flex-1">
                <span className="text-2xl md:text-3xl font-semibold truncate">
                  {post.title}
                </span>
                <span className="text-xs text-[#737373] shrink-0 mx-2 mt-1">
                  {formatTime(post)}
                </span>
              </div>
              {/*
              <div className="">
                <div
                  className="w-full hover:bg-[#EEEEEE] dark:hover:bg-[#1E2025] transition-all cursor-pointer rounded-md p-1"
                  onClick={() => toggleOptions(post._id)}
                >
                  <ThreeDotIcon />
                </div>
                <motion.div
                  className={`w-42 bg-white dark:bg-[#13151B] border border-[#F0F0F0] dark:border-[#171A21] rounded-md overflow-hidden absolute top-9 select-none right-0 ${
                    showOptions[post._id] ? "opacity-100" : "opacity-0 -z-10"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showOptions[post._id] ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul className="flex flex-col justify-center items-center">
                    <li
                      className="hover:bg-[#EEEEEE] dark:hover:bg-[#1E2025] transition-all cursor-pointer p-2 text-red-500 border-b border-[#E6E6E6] dark:border-[#171A21] w-full text-center"
                      onClick={() => setShowDelete(true)}
                    >
                      <span>Delete</span>
                    </li>
                    <li className="hover:bg-[#EEEEEE] dark:hover:bg-[#1E2025] transition-all cursor-pointer p-2 w-full text-center">
                      <span>Edit</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
              */}
            </div>
            {/*
            <div
              className={`${
                post.picture
                  ? windowSize >= 1110
                    ? "h-[70vh]"
                    : "h-[58vh]"
                  : ""
              } w-full`}
            >
              {post.picture ? (
                <img
                  className="w-full h-full aspect-[16/9] object-cover cursor-pointer"
                  src={"../server/" + post.picture}
                  onClick={() => toggleImage(post._id)}
                />
              ) : (
                ""
              )}
            </div>
            {previewImages[post._id] && (
              <PreviewImage
                image={"../server/" + post.picture}
                setPreview={() => toggleImage(post._id)}
              />
            )}
            */}
            <div className="flex items-center">
              <p className={`text-sm font-light dark:text-[#B3B3B3] truncate`}>
                {post.content}
                <span className="ml-1"></span>
              </p>
            </div>
            {post.trackId !== "undefined" ? (
              <motion.div className="flex items-center gap-2 mt-4 w-full scale-0 group-hover:scale-100 transition-transform duration-400 origin-left">
                <div className="flex items-center justify-center relative group h-10 w-10">
                  <button
                    onClick={() => togglePlayPause(post._id, post.trackId)}
                    className="absolute cursor-pointer text-white rounded-md opacity-0 group-hover:opacity-100 duration-400"
                  >
                    {info["isPlaying"][post._id] ? (
                      <PauseIcon color={"white"} />
                    ) : (
                      <PlayIcon color={"white"} />
                    )}
                  </button>
                  <img
                    className="h-full w-full rounded-md pointer-events-none"
                    src={post.trackAlbumCover}
                  />
                  <audio ref={(el) => (audioRef.current[post._id] = el)}>
                    <source src={info.track[post._id]} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium">{post.trackName}</span>
                  <span className="text-xs">{post.trackArtist}</span>
                </div>
              </motion.div>
            ) : (
              ""
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DisplayPosts;
