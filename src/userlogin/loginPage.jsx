import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ExclamationIcon, EyeIconClosed, EyeIconOpen } from "../homepage/icons";
import { Rootseeklogo } from "..";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [seePassword, setSeePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const expired = urlParams.get("sessionExpired");
    if (expired === "true") {
      setSessionExpired(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);
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
        const message = error.response.data.message;
        if (message.includes("email")) {
          setError(message);
        } else {
          setError(message);
          setIsPasswordError(true);
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const boxStyle =
    "w-full flex flex-col justify-center items-center p-12 max-sm:p-8 rounded-md";

  const btnStyle =
    "btn font-medium px-8 py-4 cursor-pointer rounded-md w-full transition duration-300 ease-in-out hover:scale-104 hover:shadow-md";
  return (
    <div className={boxStyle}>
      <div className="object-cover pointer-events-none">
        <img src={Rootseeklogo} className="object-cover h-18" />
      </div>
      <div className="flex flex-col gap-4 items-end">
        <form
          className="flex flex-col gap-4 mt-8 select-none"
          onSubmit={handleLogin}
        >
          {sessionExpired && (
            <div className="flex gap-1 justify-center w-full">
              <ExclamationIcon />
              <p className="text-[#FF2F2F]">Session expired</p>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              className={`w-92 h-12 border border-[#DEDEDE] rounded-md p-3 ${
                error !== "" && !isPasswordError
                  ? "outline-2 outline-red-500"
                  : ""
              }`}
              placeholder="E-mail address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <div
              className="absolute right-3 top-3.5 cursor-pointer"
              onClick={() => setSeePassword(!seePassword)}
            >
              {seePassword ? <EyeIconOpen /> : <EyeIconClosed />}
            </div>
            <input
              type={`${seePassword ? "text" : "password"}`}
              className={`border border-[#DEDEDE] rounded-md p-3 w-92 h-12 ${
                error !== "" ? "outline-2 outline-red-500" : ""
              }`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="text-sm text-end">
            <span className="hover:underline cursor-pointer">
              Forgot your password?
            </span>
          </p>
          <div className="text-center">
            <button className={btnStyle}>
              {loading ? "Logging in" : "Log in to your account"}
            </button>
          </div>
          <div>
            <p className="text-red-500">{error}</p>
          </div>
          <div className="mt-4 flex justify-center items-center">
            <span className="w-full bg-[#3b3a3a] h-[1px]"></span>
            <span className="px-2">OR</span>
            <span className="w-full bg-[#3b3a3a] h-[1px]"></span>
          </div>
        </form>
      </div>

      <p className="mt-4">
        Don't have an account?{" "}
        <span className="hover:underline cursor-pointer text-[#0077b6]">
          <Link to="/user/signin">Sign Up</Link>
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
