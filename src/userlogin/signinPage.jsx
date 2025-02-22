import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !firstName || !lastName || !username || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

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
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred during registration."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "p-2 text-black rounded-md border border-gray-300 drop-shadow-xl";

  return (
    <div className="flex flex-col bg-[#F9F9F9] p-12 rounded-xl drop-shadow-2xl shadow-xl opacity-96">
      <p className="font-baseline text-black text-2xl">
        Start your journey today!
      </p>
      <p className="font-light text-black mt-2">
        Please fill up the form below to register your new account.
      </p>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <form className="flex flex-col gap-4 mt-4" onSubmit={handleSignin}>
        <input
          type="email"
          className={inputStyle}
          placeholder="example@gmail.com"
          style={{ backgroundColor: "rgb(232, 232, 232)" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="flex gap-10">
          <input
            type="text"
            className={inputStyle}
            placeholder="First Name"
            style={{ backgroundColor: "rgb(232, 232, 232)" }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            className={inputStyle}
            placeholder="Last Name"
            style={{ backgroundColor: "rgb(232, 232, 232)" }}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <input
          type="text"
          className={inputStyle}
          placeholder="Username"
          style={{ backgroundColor: "rgb(232, 232, 232)" }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          className={inputStyle}
          placeholder="Password"
          style={{ backgroundColor: "rgb(232, 232, 232)" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div
          className="mt-8 rounded-4xl text-center"
          style={{
            backgroundColor: "rgb(43, 39, 39)",
          }}
        >
          <button
            type="submit"
            className="w-full font-light text-white px-8 py-4 cursor-pointer rounded-4xl hover:bg-[#4E4E4E] transition-colors"
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
