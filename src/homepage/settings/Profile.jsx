import React, { useContext } from "react";
import { EmailIcon, EnterIcon, IdIcon } from "../icons";
import { DefaultPfp } from "../..";

const Profile = () => {
  const emailPassword = [
    {
      title: "Email",
      data: "tusharlanghnoda@gmail.com",
    },
    {
      title: "Password",
      data: "*********",
    },
    {
      title: "Username",
      data: "tushxrr_l",
    },
    {
      title: "First name",
      data: "Tushar",
    },
    {
      title: "Last name",
      data: "Langhnoda",
    },
    {
      title: "Birth date",
      data: "11/30/2005",
    },
  ];

  return (
    <div className="lg:px-52">
      <h1 className="font-bold text-2xl">Edit profile</h1>
      <div className="flex justify-center items-center gap-2">
        <div className="relative group flex rounded-full w-24 overflow-hidden border-2 border-[#E4E4E4] dark:border-[#121212] mt-10">
          <img
            className="opacity-100 group-hover:opacity-40 duration-300"
            src={DefaultPfp}
            draggable={false}
          />
          <div className="absolute bottom-1 left-8.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm cursor-pointer">
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
              className={`flex flex-1 justify-between py-3 px-2 bg-[#F8F8F8] dark:bg-[#121212] rounded-md border border-[#E3E3E6] dark:border-[#323236]`}
            >
              <div className="flex items-center text-sm">
                <p className="text-md ml-1">{option.title}</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm mr-2">{option.data}</p>
                <button className="cursor-pointer text-xs hover:underline">
                  <EnterIcon size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
