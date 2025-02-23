import React, { useContext } from "react";
import UserActivity from "./UserActivity";
import { WindowContext } from "../utils";

const ActivityList = () => {
  const windowSize = useContext(WindowContext);
  const DailyTabStyles = `${
    windowSize >= 1110
      ? "w-[60vw]"
      : windowSize >= 800
      ? "w-[60vw]"
      : "w-[80vw]"
  } h-full overflow-y-auto`;
  return (
    <div className={DailyTabStyles}>
      <div className="mt-24 mb-24">
        <UserActivity />
      </div>
    </div>
  );
};

export default ActivityList;
