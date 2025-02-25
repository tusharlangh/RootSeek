import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ExclamationIcon } from "../homepage/icons";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const expired = urlParams.get("sessionExpired");
    if (expired === "true") {
      setSessionExpired(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setSessionExpired(false); // Hide the session expired message when attempting to log in

    const DataToSend = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:5002/user/login", DataToSend)
      .then((response) => {
        console.log(response.data.message);
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      })
      .catch((error) => {
        setError(
          error.response?.data?.message ||
            "An error occurred during registration."
        );
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const boxStyle =
    "border border-[#252525] w-full flex flex-col justify-center items-center p-18 rounded-xl";

  return (
    <div
      className={boxStyle}
      style={{ background: "linear-gradient(rgb(21, 21, 21), #121212)" }}
    >
      <h1 className="font-semibold drop-shadow-2xl text-5xl">Welcome back</h1>
      <div className="flex flex-col gap-4 items-end">
        <form className="flex flex-col gap-4 mt-10" onSubmit={handleLogin}>
          {sessionExpired && (
            <div className="flex gap-1 justify-center w-full">
              <ExclamationIcon />
              <p className="text-[#FF2F2F]">Session expired</p>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              className="w-92 h-12 bg-[#1F1F1F] border border-[#252525] rounded-sm p-3"
              placeholder="E-mail address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              className="bg-[#1F1F1F] border border-[#252525] rounded-sm p-3 w-92 h-12"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="hover:underline cursor-pointer text-sm text-end text-blue-400">
            Forgot your password?
          </p>
          <div
            className="text-center"
            style={{
              backgroundColor: "rgb(43, 39, 39)",
            }}
          >
            <button className="text-black font-medium px-8 py-4 cursor-pointer rounded-sm bg-white hover:bg-[#E6E6E6] transition-colors w-full">
              {loading ? "Logging in" : "Log in to your account"}
            </button>
          </div>
          <div className="mt-4 flex justify-center items-center">
            <span className="w-full bg-[#3b3a3a] h-[1px]"></span>
            <span className="px-2">OR</span>
            <span className="w-full bg-[#3b3a3a] h-[1px]"></span>
          </div>
        </form>
      </div>

      <p className="mt-4">
        Just getting started?{" "}
        <span className="hover:underline cursor-pointer text-blue-400">
          <Link to="/user/signin">Create an account</Link>
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
