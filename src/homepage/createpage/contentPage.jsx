import React, { useState } from "react";
import { Hashtag, SmileIcon } from "../icons";

const ContentPage = ({ title, content, setTitle, setContent }) => {
  return (
    <div className="w-full h-full">
      <form className="flex flex-col gap-4 p-5 w-full">
        <input
          type="text"
          placeholder="Title"
          className="p-3 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          type="text"
          placeholder="Content"
          className="h-[40vh] p-3 outline-none resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="w-full flex items-center">
          <div className="cursor-pointer">
            <SmileIcon />
          </div>
          <div className="w-full flex justify-end text-xs">0/5,000</div>
        </div>
        <div className="flex gap-2 mt-4">
          <Hashtag />
          <input
            className="text-sm p-1 outline-none"
            type="text"
            placeholder="Add hashtags"
          />
        </div>
      </form>
    </div>
  );
};

export default ContentPage;
