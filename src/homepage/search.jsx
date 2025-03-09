import React, { useContext, useEffect, useState } from "react";
import { SearchIconOutline } from "./icons";
import { WindowContext } from "../utils";
import axios from "axios";
import DisplayPosts from "./display-posts";

const Search = () => {
  const windowSize = useContext(WindowContext);
  const DailyTabStyles = `mt-24 p-1 ${
    windowSize >= 1110
      ? "w-[60vw]"
      : windowSize >= 800
      ? "w-[60vw]"
      : "w-[80vw]"
  } overflow-y-auto`;

  const token = localStorage.getItem("token");
  const [searchContent, setSearchContent] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5002/search/posts?q=${encodeURIComponent(
          searchContent
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [searchContent]);

  return (
    <div className={DailyTabStyles}>
      <form className="w-full">
        <div className="">
          <input
            placeholder="Search"
            className="border border-[#DEDEDE] rounded-md p-2 w-full "
            value={searchContent}
            onChange={(el) => setSearchContent(el.target.value)}
          />
        </div>
      </form>
      <div className="mt-6 mb-24">
        <DisplayPosts posts={posts} />
      </div>
    </div>
  );
};

export default Search;
