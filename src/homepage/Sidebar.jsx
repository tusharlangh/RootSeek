import React, { useContext, useEffect, useState } from "react";
import { DefaultPfp } from "..";
//import { WindowContext } from "../utils";
import axios from "axios";

const Sidebar = () => {
  const [userdata, setUserdata] = useState([]);
  //const windowSize = useContext(WindowContext);
  const sidebarStyles = `flex justify-end items-center gap-2 rounded-2xl`;
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5002/user/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserdata(response.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={`fixed top-0 right-6 w-full bg-black p-4 py-4`}>
      <div className={sidebarStyles}>
        <div className="flex rounded-full w-10 overflow-hidden">
          <img src={DefaultPfp} draggable={false} />
        </div>
        <div className="">
          <p className="text-xs">
            {userdata.firstName} {userdata.lastName}
          </p>
          <p className="text-xs">{userdata.username}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
