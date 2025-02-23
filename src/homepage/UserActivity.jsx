import react, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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
    <div className="flex flex-col gap-4 h-full overflow-y-auto pb-2">
      {posts.map((post) => (
        <div
          key={post.title}
          className="bg-[#EBEBEB] hover:bg-[#E8E8E8] rounded-xl py-2 px-4 drop-shadow cursor-pointer w-full transition-colors"
        >
          <h1 className="text-lg font-medium">
            {post.title} - {formatTime(post)}
          </h1>
          <p className="font-light truncate w-3/4">{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default UserActivity;
