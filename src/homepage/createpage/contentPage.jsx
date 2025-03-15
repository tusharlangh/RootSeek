import React, { useEffect, useState } from "react";
import { Hashtag, SmileIcon } from "../icons";
import EmojiPicker from "emoji-picker-react";

const ContentPage = ({
  mood,
  setMood,
  title,
  content,
  setTitle,
  setContent,
  handleHashTags,
}) => {
  const [countChar, setCountChar] = useState(content.length);

  useEffect(() => {
    setCountChar(content.length);
  }, [content]);

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
          onChange={(e) => {
            if (e.target.value.length <= 2000) {
              setContent(e.target.value);
            }
          }}
          required
        />
        <div className="w-full flex items-center">
          <div className="cursor-pointer">
            <div className="flex relative items-center">
              <SmileIcon />
              <input
                className="text-sm p-1 outline-none ml-1.25"
                type="text"
                placeholder="Add mood"
                value={mood}
                onChange={(el) => setMood(el.target.value)}
              />
            </div>
          </div>
          <div className="w-full flex justify-end text-xs">
            {countChar}/2000
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Hashtag />
          <input
            className="text-sm p-1 outline-none"
            type="text"
            placeholder="Add hashtags"
            onChange={handleHashTags}
          />
        </div>
      </form>
    </div>
  );
};

export default ContentPage;
