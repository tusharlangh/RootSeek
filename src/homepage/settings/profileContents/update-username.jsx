import React, { useState } from "react";
import axios from "axios";
import { CloseIcon } from "../../icons";

const UpdateUsername = ({ currUsername, setUpdateUsername }) => {
  const token = localStorage.getItem("token");
  const [newUsername, setNewUsername] = useState("" || currUsername);
  const [loading, setLoading] = useState(false);

  const DailyTabStyles =
    "h-full w-full gap-4 flex flex-col justify-center p-3.5 rounded-xl bg-[#FCFCFC] dark:bg-[#181818] relative";

  const BtnStyle =
    "mt-18 rounded-md p-2 bg-black dark:bg-white text-white dark:text-black cursor-pointer transition duration-300 ease-in-out hover:scale-101";

  const onSubmit = (event) => {
    event.preventDefault();

    if (!newUsername.trim() || currUsername === newUsername.trim()) {
      return;
    }

    setLoading(true);
    axios
      .patch(
        "http://localhost:5002/user/updateinformation",
        { username: newUsername.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response?.data?.message);
        setUpdateUsername(false);
      })
      .catch((error) => {
        console.log(error.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-60">
      <div className="relative absolute inset-0"></div>
      <div className="w-120 sm:w-150">
        <div className={DailyTabStyles}>
          <div
            className="absolute top-4 right-3 cursor-pointer"
            onClick={() => setUpdateUsername(false)}
          >
            <CloseIcon size={7} />
          </div>
          <h1 className="text-3xl font-bold mt-8">Username</h1>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <p className="-mb-3 text-xs ml-1">
              Your username is another way of login method.
            </p>
            <input
              className="bg-[#F8F8F8] dark:bg-[#121212] py-3 px-2 rounded-md border border-[#E3E3E6] dark:border-[#212121]"
              required
              type="text"
              placeholder="New username"
              value={newUsername}
              onChange={(el) => setNewUsername(el.target.value)}
            />
            <button type="submit" className={BtnStyle}>
              {loading ? "Loading..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUsername;
