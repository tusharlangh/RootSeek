import React, { useState } from "react";
import axios from "axios";
import { CloseIcon, EyeIconClosed, EyeIconOpen } from "../../icons";
import bcrypt from "bcryptjs";

const UpdatePassword = ({ currPassword, setUpdatePassword }) => {
  const token = localStorage.getItem("token");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reTypedNewPassword, setReTypedNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPasswordOne, setShowPasswordOne] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const [showPasswordThree, setShowPasswordThree] = useState(false);

  const DailyTabStyles =
    "h-full w-full gap-4 flex flex-col justify-center p-3.5 rounded-xl bg-[#FCFCFC] dark:bg-[#181818] relative";

  const BtnStyle =
    "mt-18 rounded-md p-2 bg-black dark:bg-white text-white dark:text-black cursor-pointer transition duration-300 ease-in-out hover:scale-101";

  const onSubmit = async (event) => {
    event.preventDefault();

    const result = await bcrypt.compare(currentPassword, currPassword);
    if (!result) {
      setMessage("Current password is incorrect.");
      return;
    }
    if (newPassword !== reTypedNewPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    setLoading(true);
    axios
      .patch(
        "http://localhost:5002/user/updatePassword",
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setUpdatePassword(false);
      })
      .catch((error) => {
        const m = error.response.data.message;
        setMessage(m || "error occured");
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-60">
      <div className="relative absolute inset-0"></div>
      <div className="w-120 sm:w-150">
        <div className={DailyTabStyles}>
          <div
            className="absolute top-4 right-3 cursor-pointer"
            onClick={() => setUpdatePassword(false)}
          >
            <CloseIcon size={7} />
          </div>
          <h1 className="text-3xl font-bold mt-8">Update password</h1>
          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <p className="-mb-3 text-xs ml-1">Enter your new password.</p>
            <div className="flex w-full relative">
              <input
                className="w-full bg-[#F8F8F8] dark:bg-[#121212] py-3 px-2 rounded-md border border-[#E3E3E6] dark:border-[#212121]"
                required
                type={showPasswordOne ? "text" : "password"}
                placeholder="Current password"
                value={currentPassword}
                onChange={(el) => setCurrentPassword(el.target.value)}
              />
              <div
                className="absolute right-3 top-4"
                onClick={() => setShowPasswordOne(!showPasswordOne)}
              >
                {showPasswordOne ? <EyeIconOpen /> : <EyeIconClosed />}
              </div>
            </div>
            <div className="flex w-full relative">
              <input
                className="w-full bg-[#F8F8F8] dark:bg-[#121212] py-3 px-2 rounded-md border border-[#E3E3E6] dark:border-[#212121]"
                required
                type={showPasswordTwo ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(el) => setNewPassword(el.target.value)}
              />
              <div
                className="absolute right-3 top-4"
                onClick={() => setShowPasswordTwo(!showPasswordTwo)}
              >
                {showPasswordTwo ? <EyeIconOpen /> : <EyeIconClosed />}
              </div>
            </div>
            <div className="flex w-full relative">
              <input
                className="w-full bg-[#F8F8F8] dark:bg-[#121212] py-3 px-2 rounded-md border border-[#E3E3E6] dark:border-[#212121]"
                required
                type={showPasswordThree ? "text" : "password"}
                placeholder="Re-type new password"
                value={reTypedNewPassword}
                onChange={(el) => setReTypedNewPassword(el.target.value)}
              />
              <div
                className="absolute right-3 top-4"
                onClick={() => setShowPasswordThree(!showPasswordThree)}
              >
                {showPasswordThree ? <EyeIconOpen /> : <EyeIconClosed />}
              </div>
            </div>

            <button type="submit" className={BtnStyle}>
              {loading ? "Loading..." : "Update"}
            </button>
          </form>
          <p
            className={`text-red-500 -mt-2 text-sm text-center ${
              message === "" ? "hidden" : "block"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
