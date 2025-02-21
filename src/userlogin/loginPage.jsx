import React, { useState, useEffect } from "react";
import { RootSeekLoginPageBg, RootSeekLogo } from "./index";
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

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <h1
        className="text-5xl font-semibold drop-shadow-2xl lg:text-7xl"
        style={{ color: "rgb(43, 39, 39)" }}
      >
        Welcome back
      </h1>
      <div className="flex flex-col gap-4 items-end">
        <form className="flex flex-col gap-4 mt-10" onSubmit={handleLogin}>
          {sessionExpired && (
            <div className="flex gap-1 justify-center w-full">
              <ExclamationIcon />
              <p className="text-[#FF2F2F]">Session expired</p>
            </div>
          )}

          <div className="relative">
            <div className="absolute top-2.75 left-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                height="20"
              >
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
            </div>
            <input
              type="email"
              className="pl-10 p-2 text-black rounded-xs border border-gray-300"
              placeholder="E-mail address"
              style={{ backgroundColor: "rgb(232, 232, 232)" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <div className="absolute top-2.75 left-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                height="20"
              >
                <path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z" />
              </svg>
            </div>
            <input
              type="password"
              className="pl-10 p-2 text-black rounded-xs border border-gray-300"
              placeholder="Password"
              style={{ backgroundColor: "rgb(232, 232, 232)" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p
            className="hover:underline cursor-pointer text-sm text-end"
            style={{ color: "#4183c4" }}
          >
            Forgot your password?
          </p>
          <div
            className="mt-4 rounded-4xl text-center"
            style={{
              backgroundColor: "rgb(43, 39, 39)",
            }}
          >
            <button className="font-light text-white px-8 py-4 cursor-pointer rounded-4xl hover:bg-[#4E4E4E] transition-colors w-full">
              {loading ? "Logging in" : "Log in to your account"}
            </button>
          </div>
        </form>
      </div>

      <p className="mt-4 text-black">
        Just getting started?{" "}
        <span
          className="hover:underline cursor-pointer"
          style={{ color: "#4183c4" }}
        >
          <Link to="/user/signin">Create an account</Link>
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
