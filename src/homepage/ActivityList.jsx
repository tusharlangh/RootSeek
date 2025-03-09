import React, { useContext, useState, useEffect } from "react";
import UserActivity from "./UserActivity";
import { WindowContext } from "../utils";
import Create from "./createpage/create";
import DisplayPosts from "./display-posts";
import axios from "axios";

const ActivityList = ({ showCreate }) => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const windowSize = useContext(WindowContext);
  const DailyTabStyles = `${
    windowSize >= 1110
      ? "w-[60vw]"
      : windowSize >= 800
      ? "w-[60vw]"
      : "w-[80vw]"
  } overflow-y-auto `;

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

  return (
    <div className="">
      <div className={DailyTabStyles}>
        <div className={`mt-24 mb-24`}>
          <p className="text-2xl font-bold mb-4">Your daily log</p>
          <DisplayPosts posts={posts} />
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
