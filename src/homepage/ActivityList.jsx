import React, { useContext } from "react";
import UserActivity from "./UserActivity";
import { WindowContext } from "../utils";
import Create from "./createpage/create";

const ActivityList = ({ showCreate }) => {
  const windowSize = useContext(WindowContext);
  const DailyTabStyles = `${
    windowSize >= 1110
      ? "w-[60vw]"
      : windowSize >= 800
      ? "w-[60vw]"
      : "w-[80vw]"
  } overflow-y-auto `;
  return (
    <div className="">
      <div className={DailyTabStyles}>
        <div className={`mt-24 mb-24`}>
          <p className="text-2xl font-bold mb-4">Your daily log</p>
          <UserActivity />
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
