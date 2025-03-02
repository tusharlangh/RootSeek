import React, { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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
      console.log(response.data.message);
      navigate(`/user/verify?email=${email}`);
    } catch (error) {
      const message = error.response.data.message;
      setError(message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "border border-[#252525] rounded-md p-3";

  return (
    <div className="flex flex-col max-sm:w-92">
      <p className="font-bold text-4xl text-center">Create an account</p>
      <form
        className="flex flex-col gap-4 mt-10 select-none"
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
        <div className="flex max-sm:gap-4 gap-10 max-sm:flex-col">
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
            className="text-white font-medium w-full px-8 py-4 cursor-pointer rounded-md bg-[#0000CD] hover:bg-[#0404B5] transition-colors"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign in to your account"}
          </button>
        </div>
      </form>
      <p className="mt-4 text-center">
        Have an account?{" "}
        <span className="hover:underline cursor-pointer text-[#0000CD]">
          <Link to="/user/login">Login</Link>
        </span>
      </p>
    </div>
  );
};

export default SignInPage;
