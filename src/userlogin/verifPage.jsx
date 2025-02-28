import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifPage = () => {
  const [verifCode, setVerifCode] = useState("");
  const [extrEmail, setExtrEmail] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const boxStyle =
    "border border-[#252525] w-full flex flex-col justify-center items-center p-12 max-sm:p-8 rounded-sm";

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
        setTimeout(() => navigate("/user/login"), 500);
      })
      .catch((error) => {
        const message = error.response.data.message;
        console.error(message);
        setMessage(message);
      });
  };

  return (
    <div
      className={boxStyle}
      style={{ background: "linear-gradient(rgb(21, 21, 21), #121212)" }}
    >
      <div className="flex flex-col gap-4 justify-center items-center">
        <h1 className="font-bold text-4xl">Please verify yourself</h1>
        <h3 className="">
          Please enter the verification code we sent to your inbox below
        </h3>
        <form className="flex flex-col mt-4" onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Code"
            className={`w-62 h-12 bg-[#1F1F1F] border border-[#252525] rounded-sm p-3`}
            value={verifCode}
            onChange={(el) => setVerifCode(el.target.value)}
          />
          <p
            className={`${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            }  mt-4 ${message === "" ? "hidden" : "block"}`}
          >
            {message}
          </p>
          <button className="mt-4 text-black font-medium px-8 py-4 cursor-pointer rounded-sm bg-[#2AA3A3] hover:bg-[#E6E6E6] transition-colors w-62">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifPage;
