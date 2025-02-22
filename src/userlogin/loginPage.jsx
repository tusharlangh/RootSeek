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
    "w-full flex flex-col justify-center items-center bg-[#F9F9F9] p-18 rounded-xl drop-shadow-2xl shadow-xl opacity-96";

  return (
    <div className={boxStyle}>
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
            <input
              type="email"
              className="p-3 text-black rounded-md border border-gray-300 drop-shadow-xl w-92 h-12"
              placeholder="E-mail address"
              style={{ backgroundColor: "rgb(232, 232, 232)" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              className="p-3 text-black rounded-md border border-gray-300 drop-shadow-xl w-92 h-12"
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
