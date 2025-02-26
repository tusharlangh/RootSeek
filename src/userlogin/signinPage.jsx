import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EyeIconClosed, EyeIconOpen } from "../homepage/icons";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seePassword, setSeePassword] = useState(false);

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const DataToSend = {
      email,
      firstName,
      lastName,
      username,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:5002/user/signin",
        DataToSend
      );
      console.log(response.data.message); // Log success message
      navigate("/user/login"); // Redirect to login page after successful registration
    } catch (error) {
      const message = error.response.data.message;
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "bg-[#1F1F1F] border border-[#252525] rounded-sm p-3";

  return (
    <div
      className="flex flex-col p-12 max-sm:p-8 rounded-sm border border-[#252525]"
      style={{ background: "linear-gradient(rgb(21, 21, 21), #121212)" }}
    >
      <p className="font-bold text-4xl">Start your journey today!</p>
      <p className="font-light mt-2">
        Please fill up the form below to register your new account.
      </p>
      <form
        className="flex flex-col gap-4 mt-4 select-none"
        onSubmit={handleSignin}
      >
        <input
          type="email"
          className={inputStyle}
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className={`text-red-500 ${error !== "" ? "" : "hidden"}`}>
          {error}
        </p>
        <div className="flex gap-10">
          <input
            type="text"
            className={inputStyle}
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            className={inputStyle}
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <input
          type="text"
          className={inputStyle}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className="relative">
          <div
            className="absolute right-3 top-3.75 cursor-pointer"
            onClick={() => setSeePassword(!seePassword)}
          >
            {seePassword ? <EyeIconOpen /> : <EyeIconClosed />}
          </div>
          <input
            type={`${seePassword ? "text" : "password"}`}
            className={inputStyle + " w-full"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mt-4 rounded-4xl text-center">
          <button
            type="submit"
            className="font-medium w-full text-black px-8 py-4 cursor-pointer rounded-sm bg-[#2AA3A3] hover:bg-[#E6E6E6] transition-colors"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign in to your account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignInPage;
