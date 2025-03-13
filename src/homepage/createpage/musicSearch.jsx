import React, { useEffect, useState } from "react";
import { Music } from "../icons";
import MusicTimeline from "./musicTimeline";

const MusicSearch = ({ handleSongSelect, selectedSong }) => {
  const [showMusic, setShowMusic] = useState(false);

  useEffect(() => {
    if (Object.keys(selectedSong).length !== 0) {
      setShowMusic(true);
    }
  });

  return (
    <div className="w-full h-full">
      {!showMusic && (
        <div className="flex flex-col justify-center items-center w-full h-full pb-12">
          <div className="w-42">
            <Music size={29} />
          </div>
          <p className="font-medium text-xl mt-2">
            Add music to describe your mood
          </p>
          <button
            className="bg-[#CC99FF] text-white p-1 px-4 rounded-md cursor-pointer hover:scale-103 transition-transform hover:shadow-lg duration-400 mt-4"
            onClick={() => setShowMusic(true)}
          >
            Add music
          </button>
        </div>
      )}

      {showMusic && (
        <div>
          <MusicTimeline onSelectSong={handleSongSelect} />
        </div>
      )}
    </div>
  );
};

export default MusicSearch;
