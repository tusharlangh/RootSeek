import React, { useContext } from "react";
import { DefaultPfp } from "..";
import { WindowContext } from "../utils";

const Sidebar = () => {
  const windowSize = useContext(WindowContext);
  const sidebarStyles = `flex justify-end items-center gap-2 rounded-2xl`;
  return (
    <div className={`fixed top-0 right-6 w-full bg-black p-4 py-4`}>
      <div className={sidebarStyles}>
        <div className="flex rounded-full w-10 overflow-hidden">
          <img src={DefaultPfp} draggable={false} />
        </div>
        <div className="">
          <p className="text-xs">Tushar Langhnoda</p>
          <p className="text-xs">Tushar</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
