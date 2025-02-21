import React from "react";
import {
  AddIcon,
  AddIconBlack,
  GlobeIcon,
  RecordIcon,
  SendIcon,
  SmileIcon,
} from "../icons";

const Create = () => {
  const DailyTabStyles =
    "relative flex flex-col bg-[#F9F9F9] max-w-[90vw] lg:max-w-[80vw] max-h-[500px] lg:max-h-[78vh] w-full h-full rounded-3xl drop-shadow-2xl lg:ml-24 overflow-hidden justify-center items-center";

  const inputStyle =
    "rounded-2xl py-4 px-4 cursor-pointer transition-colors resize-none w-full h-full text-xl outline-none";
  return (
    <div className={DailyTabStyles}>
      <div className="flex flex-col justify-center items-center h-full w-[80vw] lg:w-[60vw] gap-8">
        <h1 className="text-3xl text-black font-semibold">Create a new Root</h1>
        <form className="flex flex-col gap-4 justify-center items-center shadow-sm rounded-2xl border border-gray-300 w-full">
          <input
            className="w-full pt-4 pb-2 px-4 outline-none shadow-xs"
            type="text"
            placeholder="Title"
          />
          <textarea
            rows="6"
            className={inputStyle}
            type="text"
            placeholder="Start typing..."
          />
        </form>

        <div className="flex gap-2 cursor-pointer w-full items-center justify-end">
          <div className="text-center bg-[#F9F9F9] border border-gray-300 hover:bg-[#F3F3F3] rounded-4xl p-3 max-w-13 transition-colors">
            <RecordIcon />
          </div>
          <div className="text-center bg-[#F9F9F9] border border-gray-300 hover:bg-[#F3F3F3] rounded-4xl p-3 max-w-13 transition-colors">
            <SmileIcon />
          </div>
          <div className="text-center bg-[#F9F9F9] border border-gray-300 hover:bg-[#F3F3F3] rounded-4xl p-3 max-w-13 transition-colors">
            <AddIconBlack />
          </div>
          <div className="text-center bg-[#F9F9F9] border border-gray-300 hover:bg-[#F3F3F3] rounded-4xl p-3 max-w-13 transition-colors">
            <GlobeIcon />
          </div>
          <div className="text-center bg-[#F9F9F9] border border-gray-300 hover:bg-[#F3F3F3] rounded-4xl p-3 max-w-13 transition-colors">
            <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
