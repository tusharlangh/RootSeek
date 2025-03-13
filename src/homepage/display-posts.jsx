import react, { useState } from "react";
import { motion } from "framer-motion";
import { ExpandIcon } from "./icons";
import { useNavigate } from "react-router-dom";

const DisplayPosts = ({ posts }) => {
  const [isHover, setIsHover] = useState({});
  const navigate = useNavigate();

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

  const formatTime = (post) => {
    const formattedTime = new Date(post.date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime;
  };

  if (!posts) {
    return (
      <div className="absolute top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center sm:pl-24">
        <motion.div
          className="w-7 h-7 border-3 dark:border-t-[#121200] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="">
        <p>No roots are made</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-8 w-full">
      {posts.map((post) => (
        <motion.div
          key={post._id}
          initial={{ scale: 1, height: "100px" }}
          whileHover={{ scale: 1.03, height: "165px" }}
          onHoverStart={() => handleHoverStart(post._id)}
          onHoverEnd={() => handleHoverEnd(post._id)}
          transition={{ duration: 0.4 }}
          className={`w-full py-4 px-4 rounded-lg box_shadow bg-[#FCFCFC] dark:bg-[#181818] hover:bg-[#F3F3F3] dark:hover:bg-[#282828] transition-colors duration-500 group`}
          onClick={() => navigate(`/home/root/${post._id}`)}
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
            </div>

            <div className="flex items-center">
              <p className={`text-sm font-light dark:text-[#B3B3B3] truncate`}>
                {post.content}
                <span className="ml-1"></span>
              </p>
            </div>

            {post.trackId !== "undefined" ? (
              <motion.div className="flex items-center gap-2 mt-4 w-full scale-0 group-hover:scale-100 transition-transform duration-400 origin-left">
                <div className="flex items-center justify-center relative group h-10 w-10">
                  <img
                    className="h-full w-full rounded-md pointer-events-none"
                    src={post.trackAlbumCover}
                  />
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
