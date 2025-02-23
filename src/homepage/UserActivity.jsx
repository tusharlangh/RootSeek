import react, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { LoginPageBg2 } from "..";
import { ThreeDotIcon } from "./icons";

const UserActivity = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

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
  }

  return (
    <div className="flex flex-col justify-center items-center gap-18 h-full w-full">
      {posts.map((post) => (
        <div className="w-[50vw] border border-[#252525] py-4 px-8 rounded-xl">
          <div key={post.title} className="flex flex-col gap-4">
            <div className="flex items-center gap-1 text-gray-300">
              <div className="flex items-center flex-1">
                <span className="text-xl text-white">{post.title}</span>
                <span className="text-sm text-gray-300 mx-1">•</span>
                <span className="text-sm text-gray-300 mt-0.5">
                  {formatTime(post)}
                </span>
              </div>
              <div className="hover:bg-[#242424] cursor-pointer p-1 rounded-sm">
                <ThreeDotIcon />
              </div>
            </div>
            <div>
              <img src={LoginPageBg2} />
            </div>
            <div className="font-light truncate">{post.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserActivity;
