import React from "react";
import UserActivity from "./UserActivity";

const ActivityList = () => {
  const DailyTabStyles = `w-[60vw] h-full overflow-y-auto`;
  return (
    <div className={DailyTabStyles}>
      <div className="mt-24">
        <UserActivity />
      </div>
    </div>
  );
};

export default ActivityList;
