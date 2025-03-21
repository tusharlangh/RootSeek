import React, { useState, useContext, useEffect } from "react";
import { HelpIcon, LanguageIcon, PrivacyIcon, ProfileIcon } from "../icons";
import { useNavigate } from "react-router";
import { WindowContext } from "../../utils";

const SettingsOptions = () => {
  const windowSize = useContext(WindowContext);
  const [currentPage, setCurrentPage] = useState("profile");
  const iconSize = 6;
  const options = [
    { name: "Profile", path: "profile", icon: <ProfileIcon size={iconSize} /> },
    {
      name: "Language",
      path: "language",
      icon: <LanguageIcon size={iconSize} />,
    },
    { name: "Privacy", path: "privacy", icon: <PrivacyIcon size={iconSize} /> },
    { name: "Help", path: "help", icon: <HelpIcon size={iconSize} /> },
  ];
  const navigate = useNavigate();

  const isSmallScreen = windowSize <= 800;

  useEffect(() => {
    navigate(`/home/settings/account/${currentPage}`);
  }, [currentPage]);

  return (
    <ul className="flex flex-col gap-3 mt-6">
      {options.map((option, index) => (
        <li
          key={index}
          className={`flex items-center gap-1 cursor-pointer hover:bg-[#EEEEEE] dark:hover:bg-[#2A2A2A] px-3 py-2 rounded-md ${
            currentPage === option.path ? "bg-[#EEEEEE] dark:bg-[#2A2A2A]" : ""
          }`}
          onClick={() => setCurrentPage(option.path)}
        >
          <span>{option.icon}</span>
          <span className={`max-sm:text-sm ${isSmallScreen ? "hidden" : ""}`}>
            {option.name}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default SettingsOptions;
