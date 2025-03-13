import React, { useState } from "react";
import { motion } from "framer-motion";
import { EditIcon, TrashIcon } from "./icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PostOptions = ({ id, showDeleteMessage }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  const options = [
    {
      icon: <TrashIcon size={5} />,
      name: "Delete root",
    },
    {
      icon: <EditIcon size={5} />,
      name: "Edit",
    },
  ];
  const deletePost = () => {
    axios
      .delete(`http://localhost:5002/user/delete/${id}`)
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error(error.response.data.message);
      });
  };

  const confirmDeleteCont = () => {
    deletePost();
    setConfirmDelete(true);
    showDeleteMessage();
    setTimeout(() => navigate("/home"), 2000);
  };

  return (
    <div className="flex relative">
      <motion.div
        className="flex flex-col items-center bg-[#EBEBEB] dark:bg-[#282828] rounded-md gap-2 p-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <ul className="text-sm font-light">
          {options.map((option, index) => (
            <li
              key={index}
              className="p-3 w-full hover:bg-[#D7D7D7] dark:hover:bg-[#464646] rounded-md cursor-pointer"
              onClick={() => {
                if (option.name.includes("Delete")) {
                  setConfirmDelete(true);
                }
              }}
            >
              <div className="flex gap-2 items-center">
                {option.icon}
                <span>{option.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
      <div className="absolute bg-[#EBEBEB] dark:bg-[#282828] rounded-md">
        {confirmDelete && (
          <div className="flex flex-col gap-2 w-62 text-center font-light p-2">
            <p className="text-md">
              Are you sure you want to permanently remove this root?
            </p>
            <div
              className="flex justify-center text-[#6E5092] p-1 hover:bg-[#D7D7D7] dark:hover:bg-[#464646] rounded-md"
              onClick={confirmDeleteCont}
            >
              <TrashIcon size={5} />
            </div>
            <div
              className="p-1 hover:bg-[#D7D7D7] dark:hover:bg-[#464646] rounded-md"
              onClick={() => setConfirmDelete(false)}
            >
              No
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostOptions;
