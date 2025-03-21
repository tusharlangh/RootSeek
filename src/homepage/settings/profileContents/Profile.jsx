import React, { useEffect, useState } from "react";
import { EnterIcon } from "../../icons";
import axios from "axios";
import DefaultPfp from "../../../assets/images/defaultpfp.jpeg";
import UpdateUsername from "./update-username";

const Profile = () => {
  const [userInformation, setUserInformation] = useState({});
  const token = localStorage.getItem("token");
  const [updateUsername, setUpdateUsername] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5002/user/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserInformation(response.data);
      })
      .catch((error) => {});
  });

  if (!userInformation) {
    return <p>Loading...</p>;
  }

  const emailPassword = [
    {
      title: "Email",
      data: userInformation.email,
    },
    {
      title: "Password",
      data: "*********",
    },
    {
      title: "Username",
      data: userInformation.username,
    },
    {
      title: "First name",
      data: userInformation.firstName,
    },
    {
      title: "Last name",
      data: userInformation.lastName,
    },
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className={`w-full max-w-150`}>
        <h1 className="font-bold text-2xl">Edit profile</h1>
        <div className="flex justify-center items-center gap-2">
          <div className="relative group flex rounded-full w-24 overflow-hidden border-2 border-[#E4E4E4] dark:border-[#121212] mt-10">
            <img
              className="opacity-100 group-hover:opacity-40 duration-300"
              src={DefaultPfp}
              draggable={false}
            />
            <div className="absolute bottom-2 left-8.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm cursor-pointer">
              Edit
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-sm w-full mt-2 justify-center items-center">
          <div className="font-bold">Tushar Langhnoda</div>
          <div>tusharlanghnoda@gmail.com</div>
        </div>
        <div className="mt-6 flex flex-col gap-12 mt-10">
          <div className="flex flex-col gap-4">
            <p className="font-bold text-xl mt-4">Personal information</p>
            {emailPassword.map((option, index) => (
              <div
                key={index}
                className={`flex flex-1 justify-between py-3 px-2 bg-[#F8F8F8] dark:bg-[#121212] rounded-md border border-[#E3E3E6] dark:border-[#212121]`}
              >
                <div className="flex items-center text-sm">
                  <p className="text-md ml-1">{option.title}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm mr-2">{option.data}</p>
                  <button
                    className="cursor-pointer text-xs hover:underline"
                    onClick={() => {
                      if (option.title === "Username") {
                        setUpdateUsername(true);
                      }
                    }}
                  >
                    <EnterIcon size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {updateUsername && (
        <div className="w-full h-full absolute top-0 ">
          <UpdateUsername
            currUsername={emailPassword[2].data}
            setUpdateUsername={setUpdateUsername}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
