import { AddIcon } from "./icons";
import UserActivity from "./UserActivity";
import { RootSeekTransparent } from "..";
import { useNavigate } from "react-router-dom";

const ActivityList = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("create");
  };

  const DailyTabStyles = `relative flex flex-col bg-[#F9F9F9] px-12 py-12 max-w-[90vw] lg:max-w-[80vw] max-h-[76vh] lg:max-h-[78vh] w-full h-full rounded-xl drop-shadow-2xl lg:ml-24 overflow-hidden`;
  return (
    <div className={DailyTabStyles}>
      <div className="">
        <h1
          className="text-3xl text-black font-semibold mb-8"
          style={{ textShadow: "2px 2px 30px rgba(0, 0, 0, 0.3)" }}
        >
          Here is your today's activity
        </h1>

        <div className="h-[40vh] inset-shadow-sm p-4 rounded-md">
          <UserActivity />
        </div>
      </div>
      <div className="pt-2 h-24 absolute bottom-0 w-full bg-[#F9F9F9]">
        <div
          className="justify-end cursor-pointer bg-[#171717] hover:bg-[#505050] rounded-3xl p-3 max-w-12 transition-colors"
          onClick={onClick}
        >
          <AddIcon />
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
