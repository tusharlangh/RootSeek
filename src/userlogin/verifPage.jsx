import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifPage = () => {
  const [verifCode, setVerifCode] = useState("");
  const [extrEmail, setExtrEmail] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const boxStyle =
    "w-full flex flex-col justify-center items-center p-12 max-sm:p-8";

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const extractedEmail = urlParams.get("email");
    setExtrEmail(extractedEmail);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    const DataToSend = {
      email: extrEmail,
      verificationCode: verifCode,
    };

    axios
      .post("http://localhost:5002/user/verify", DataToSend)
      .then((response) => {
        console.log(response.data.message);
        setMessage(response.data.message);
        setTimeout(() => navigate("/user/login"), 2000);
      })
      .catch((error) => {
        const message = error.response.data.message;
        console.error(message);
        setMessage(message);
      });
  };

  return (
    <div className={boxStyle}>
      <div className="flex flex-col gap-4 justify-center items-center">
        <h1 className="font-bold text-4xl">Please verify yourself</h1>
        <h3 className="">
          Please enter the verification code we sent to your inbox below
        </h3>
        <form className="flex flex-col mt-4" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Enter your code*"
            className={`w-82 h-12 border border-[#252525] rounded-md p-3`}
            value={verifCode}
            onChange={(el) => setVerifCode(el.target.value)}
          />
          <p
            className={`${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-500"
            }  mt-4 ${message === "" ? "hidden" : "block"}`}
          >
            {message}
          </p>
          <button className="text-white dark:text-black bg-black dark:bg-white w-full mt-6 font-medium px-8 py-4 cursor-pointer rounded-md transition duration-300 ease-in-out hover:scale-104 hover:shadow-md">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifPage;
