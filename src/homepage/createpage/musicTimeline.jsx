import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchIconOutline } from "../icons";
import { motion } from "framer-motion";

import PlayMusic from "../../homepage/play-music";

const MusicTimeline = ({ onSelectSong }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/deezer-proxy?q=${query}&limit=8`)
      .then((response) => {
        setResults(response.data.data);
      })
      .catch((error) => {
        console.error("Error searching music:", error);
      });
  }, [query]);

  if (!results || results.length === 0) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full px-10 max-sm:px-6 mt-8 max-md:mt-4">
      <div className="relative">
        <div className="absolute top-2.5 left-3">
          <SearchIconOutline size={6} />
        </div>
        <input
          type="text"
          placeholder="Search root"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-lg font-light pl-10 bg-[#F9F9F9] dark:bg-[#181818] 
             border border-[#F0F0F0] dark:border-[#121212] 
             hover:border-[#F0F0F0] dark:hover:border-[#404040] 
             hover:bg-white dark:hover:bg-[#2A2A2A] 
             transition-colors duration-400 rounded-md p-2"
        />
      </div>

      <ul className="mt-4 max-h-120 overflow-y-auto pb-4">
        {results.map((song) => (
          <li
            key={song.id}
            className={`${
              selectedSongId === song.id ? "bg-[#EEEEEE] dark:bg-[#2A2A2A]" : ""
            } cursor-pointer hover:bg-[#F7F7F7] dark:hover:bg-[#222222] transition-all duration-300 p-2 rounded-md flex justify-between items-center`}
            onClick={() => {
              setSelectedSongId(song.id);
              onSelectSong(song);
            }}
          >
            <div className="flex gap-4 items-center">
              <div className="">
                <img
                  src={song.album.cover}
                  className="object-cover h-12 w-12 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-sm w-44 truncate">
                  {song.title}
                </div>
                <div className="text-xs">{song.artist.name}</div>
              </div>
            </div>
            {selectedSongId === song.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="w-5 cursor-pointer mr-2"
              >
                <PlayMusic trackId={selectedSongId} />
              </motion.div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicTimeline;
