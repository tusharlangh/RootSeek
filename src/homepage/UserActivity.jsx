import react, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ThreeDotIcon } from "./icons";
import { WindowContext } from "../utils";
import DeletePost from "./deletePost";
import PreviewImage from "./previewImage";

const UserActivity = () => {
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");
  const windowSize = useContext(WindowContext);
  const [seeMore, setSeeMore] = useState({});
  const [showOptions, setShowOptions] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
        className="w-7 h-7 border-3 border-gray-300 border-t-black rounded-full"
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

  const toggleImage = (post_id) => {
    setPreviewImages((prev) => ({
      ...prev,
      [post_id]: !prev[post_id],
    }));
  };

  const deletePost = (post_id) => {
    const _id = findRoot();
    axios
      .delete(`http://localhost:5002/user/delete/${_id}`)
      .then((response) => console.log(response.data.message))
      .catch((error) => console.error(error.response.data.message));
  };

  const findRoot = () => {
    for (const key in showOptions) {
      if (showOptions[key]) {
        return key;
      }
    }
  };

  if (confirmDelete) {
    deletePost();
  }

  return (
    <div className="flex flex-col justify-center items-center gap-12 h-full w-full">
      {showDelete && (
        <DeletePost
          setConfirmDelete={setConfirmDelete}
          setShowDelete={setShowDelete}
        />
      )}
      {posts.map((post) => (
        <div
          key={post._id}
          className={`w-full bg-[#F9F9F9] border border-[#F0F0F0] py-4 px-4 rounded-xl shadow-xs`}
        >
          <div className="relative flex flex-col gap-2 justify-between">
            <div className="flex gap-1">
              <div className="relative flex items-center flex-1">
                <div className="w-4/5">
                  <span className="text-xl text-black">{post.title}</span>
                  <span className="text-sm text-black mx-1">•</span>
                  <span className="text-sm text-black shrink-0">
                    {formatTime(post)}
                  </span>
                </div>
              </div>
              <div className="">
                <div
                  className="w-full hover:bg-[#EEEEEE] transition-all cursor-pointer rounded-md p-1"
                  onClick={() => toggleOptions(post._id)}
                >
                  <ThreeDotIcon />
                </div>
                <motion.div
                  className={`w-42 bg-[#F9F9F9] border border-[#F0F0F0] rounded-md overflow-hidden absolute top-9 select-none right-0 ${
                    showOptions[post._id] ? "opacity-100" : "opacity-0 -z-10"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showOptions[post._id] ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ul className="flex flex-col justify-center items-center">
                    <li
                      className="hover:hover:bg-[#EEEEEE] transition-all cursor-pointer p-2 text-red-500 border-b border-[#E6E6E6] w-full text-center"
                      onClick={() => setShowDelete(true)}
                    >
                      Delete
                    </li>
                    <li className="hover:hover:bg-[#EEEEEE] transition-all cursor-pointer p-2 w-full text-center">
                      Edit
                    </li>
                  </ul>
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
                  className="w-full h-full aspect-[16/9] object-cover cursor-pointer"
                  src={"server/" + post.picture}
                  onClick={() => toggleImage(post._id)}
                />
              ) : (
                ""
              )}
            </div>
            {previewImages[post._id] && (
              <PreviewImage
                image={"server/" + post.picture}
                setPreview={() => toggleImage(post._id)}
              />
            )}

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
