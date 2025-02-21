import { AddIcon } from "./icons";
import UserActivity from "./UserActivity";
import { RootSeekTransparent } from "..";
import { useNavigate } from "react-router-dom";

const ActivityList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const onClick = () => {
    navigate("create");
  };

  const DailyTabStyles = `relative flex flex-col bg-[#F9F9F9] px-12 py-12 max-w-[90vw] lg:max-w-[80vw] max-h-[76vh] lg:max-h-[78vh] w-full h-full rounded-xl drop-shadow-2xl lg:ml-24 overflow-hidden ${
    token ? "" : "blur-xs"
  }`;
  return (
    <div className={DailyTabStyles}>
      <div className="">
        <h1
          className="text-3xl text-black font-semibold mb-8"
          style={{ textShadow: "2px 2px 30px rgba(0, 0, 0, 0.3)" }}
        >
          Here is your today's activity
        </h1>
        <UserActivity />
      </div>
      <div
        className="pt-2 h-24 absolute bottom-0 cursor-pointer w-full bg-[#F9F9F9]"
        onClick={onClick}
      >
        <div className="bg-[#171717] hover:bg-[#505050] rounded-3xl p-3 max-w-12 transition-colors">
          <AddIcon />
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
