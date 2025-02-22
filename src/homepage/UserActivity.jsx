import react, { useState, useEffect } from "react";
import axios from "axios";

const UserActivity = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

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

  return (
    <div className="flex flex-col gap-4 h-3/4 overflow-y-scroll">
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
