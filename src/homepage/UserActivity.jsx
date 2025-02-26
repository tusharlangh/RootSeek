import react, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { LoginPageBg2 } from "..";
import { ThreeDotIcon } from "./icons";
import { WindowContext } from "../utils";
import DeletePost from "./deletePost";

const UserActivity = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const windowSize = useContext(WindowContext);
  const [seeMore, setSeeMore] = useState({});
  const [showOptions, setShowOptions] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5002/user/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

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
      <motion.div
        className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    );
  } else if (posts.length === 0) {
    return <p>No roots made</p>;
  }

  const toggleSeeMore = (post_id) => {
    setSeeMore((prev) => ({
      ...prev,
      [post_id]: !prev[post_id],
    }));
  };

  const toggleOptions = (post_id) => {
    setShowOptions((prev) => ({
      ...prev,
      [post_id]: !prev[post_id], //the [] in [post_id] is used because we are trying to get the key using the variable.
    }));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-12 h-full w-full">
      {posts.map((post) => (
        <div
          key={post._id}
          className={`w-full bg-[#1F1F1F] border border-[#252525] py-4 px-4 rounded-xl`}
          style={{ background: "linear-gradient(rgb(21, 21, 21), #121212)" }}
        >
          <div className="relative flex flex-col gap-4 justify-between">
            <div className="flex gap-1 text-gray-300">
              <div className="relative flex items-center flex-1">
                <div className="w-4/5">
                  <span className="text-xl text-white">{post.title}</span>
                  <span className="text-sm text-gray-300 mx-1">•</span>
                  <span className="text-sm text-gray-300 shrink-0">
                    {formatTime(post)}
                  </span>
                </div>
              </div>
              <div className="">
                <div
                  className="w-full hover:bg-[#242424] transition-all cursor-pointer rounded-sm p-1"
                  onClick={() => toggleOptions(post._id)}
                >
                  <ThreeDotIcon />
                </div>
                <motion.div
                  className={`absolute top-9 select-none right-0 ${
                    showOptions[post._id] ? "opacity-100" : "opacity-0 -z-10"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showOptions[post._id] ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <DeletePost />
                </motion.div>
              </div>
            </div>

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
                  className="w-full h-full aspect-[16/9] object-cover"
                  src={"server/" + post.picture}
                />
              ) : (
                ""
              )}
            </div>

            <div className="flex items-center">
              <p
                className={`font-light ${seeMore[post._id] ? "" : "truncate"}`}
              >
                {post.content}
              </p>
              {post.content.length > 100 && (
                <button
                  className="text-xs text-gray-300 ml-2 shrink-0 cursor-pointer hover-underline"
                  onClick={() => toggleSeeMore(post._id)}
                >
                  {seeMore[post._id] ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserActivity;
