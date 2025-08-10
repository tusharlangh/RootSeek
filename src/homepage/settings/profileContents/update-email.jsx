import React, { useEffect, useState } from "react";
import axios from "axios";
import { CloseIcon } from "../../icons";

const UpdateEmail = ({ currEmail, setUpdateEmail }) => {
  const token = localStorage.getItem("token");

  const [newEmail, setNewEmail] = useState("" || currEmail);
  const [verifCode, setVerifCode] = useState("");
  const [showVerif, setShowVerif] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const DailyTabStyles =
    "h-full w-full gap-4 flex flex-col justify-center p-3.5 rounded-xl bg-[#FCFCFC] dark:bg-[#181818] relative";
  const BtnStyle =
    "mt-18 rounded-md p-2 bg-black dark:bg-white text-white dark:text-black cursor-pointer transition duration-300 ease-in-out hover:scale-101";

  const onVerif = () => {
    const DataToSend = {
      email: newEmail.trim(),
      verificationCode: verifCode,
    };

    axios
      .post("http://localhost:5002/user/verify-email", DataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log(response.data.message);
        setMessage(response.data.message);
        setUpdateEmail(false);
      })
      .catch((error) => {
        const message = error.response.data.message;
        console.error(message);
        setMessage(message);
      });
  };

  const onSubmit = () => {
    if (newEmail.trim() === currEmail) {
      setMessage("Your new email is the same as the current email.");
      return;
    }

    setLoading(true);

    axios
      .post(
        "http://localhost:5002/user/updateEmail",
        {
          newEmail: newEmail.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response?.data?.message);
        setShowVerif(true);
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
            onClick={() => setUpdateEmail(false)}
          >
            <CloseIcon size={7} />
          </div>
          {!showVerif && (
            <div className="">
              <h1 className="text-3xl font-bold mt-8">Email</h1>
              <form
                className="flex flex-col gap-4 mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
              >
                <p className="-mb-3 text-xs ml-1">Enter your new email.</p>
                <input
                  className="bg-[#F8F8F8] dark:bg-[#121212] py-3 px-2 rounded-md border border-[#E3E3E6] dark:border-[#212121]"
                  required
                  type="email"
                  placeholder="New email"
                  value={newEmail}
                  onChange={(el) => setNewEmail(el.target.value)}
                />
                <button type="submit" className={BtnStyle} disabled={loading}>
                  {loading ? "Loading..." : "Continue"}
                </button>
              </form>
              {message && (
                <p
                  className={`mt-2 text-sm ${
                    message.includes("same") ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          )}

          {showVerif && (
            <div>
              <h1 className="text-3xl font-bold mt-8">
                Please verify your email
              </h1>

              <form
                className="flex flex-col gap-4 mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  onVerif();
                }}
              >
                <p className="-mb-3 text-xs ml-1">
                  Please enter the verification code we sent to your inbox below
                </p>
                <input
                  type="text"
                  placeholder="Enter your code*"
                  className="bg-[#F8F8F8] dark:bg-[#121212] py-3 px-2 rounded-md border border-[#E3E3E6] dark:border-[#212121]"
                  value={verifCode}
                  onChange={(el) => setVerifCode(el.target.value)}
                />
                <p
                  className={`${
                    message.includes("successfully")
                      ? "text-green-600"
                      : "text-red-500"
                  }  mt-2 text-sm ${message === "" ? "hidden" : "block"}`}
                >
                  {message}
                </p>
                <button type="submit" className={BtnStyle}>
                  Verify
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateEmail;
