import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { PauseIcon, PlayIcon, SearchIconOutline } from "../icons";

const MusicTimeline = ({ onSelectSong }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const audioRef = useRef({});

  const [songStates, setSongStates] = useState({
    isPlaying: {},
    checkedSongs: {},
  });

  useEffect(() => {
    if (!query) return;

    // Deezer API endpoint for searching tracks
    axios
      .get(
        "https://cors-anywhere.herokuapp.com/https://api.deezer.com/search",
        {
          params: { q: query, limit: 8 },
        }
      )
      .then((response) => {
        const tracks = response.data.data.map((track) => ({
          id: track.id,
          name: track.title,
          artist: track.artist.name,
          previewUrl: track.preview, // Deezer's preview URL
          deezerUrl: track.link, // Full song link on Deezer
          albumCover: track.album.cover_big, // Album cover image
          durationMs: track.duration * 1000, // Duration in milliseconds
        }));
        setResults(tracks);
      })
      .catch((error) => {
        console.error("Error searching music:", error);
      });
  }, [query]);

  const updateSongPlaying = (id) => {
    setSongStates((prev) => ({
      ...prev,
      isPlaying: {
        ...prev.isPlaying,
        [id]: !prev.isPlaying[id],
      },
    }));
  };

  const togglePlayPause = (id) => {
    const audio = audioRef.current[id];
    if (!audio) return;

    audio.onended = () => {
      audio.play();
    };

    if (audio) {
      if (audio.paused) {
        for (const id in audioRef.current) {
          const a = audioRef.current[id];
          if (a && !a.paused) {
            a.pause();
            updateSongPlaying(id);
          }
        }
        audio.play();
      } else {
        audio.pause();
      }
    }
    updateSongPlaying(id);
  };

  return (
    <div className="w-full px-10 max-sm:px-6 mt-8 max-md:mt-4">
      <div className="relative">
        <div className="absolute top-2.75 left-3">
          <SearchIconOutline size={6} />
        </div>

        <input
          type="text"
          placeholder="Search music"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="text-lg font-light w-full pl-10 bg-[#F9F9F9] dark:bg-[#13151B] 
                   border border-[#F0F0F0] dark:border-[#171A21] 
                   hover:border-[#F0F0F0] dark:hover:border-[#171A21] 
                   hover:bg-white dark:hover:bg-[#1A1D24] 
                   transition-colors duration-400 rounded-md p-2"
        />
      </div>

      <ul className="mt-4 max-h-120 overflow-y-auto">
        {results.map((song) => (
          <li
            key={song.id}
            className={`${
              songStates.checkedSongs[song.id] ? "bg-[#EEEEEE]" : ""
            } cursor-pointer hover:bg-[#EEEEEE] dark:hover:bg-[#1E2025] transition-all duration-300 p-2 rounded-md flex justify-between items-center`}
            onClick={() => {
              onSelectSong(song);
              setSongStates((prev) => ({
                ...prev,
                checkedSongs: {
                  ...prev.checkedSongs,
                  [song.id]: !prev.checkedSongs[song.id],
                },
              }));
            }}
          >
            <div className="flex gap-4 items-center">
              <div className="">
                <img
                  src={song.albumCover}
                  className="object-cover h-12 w-12 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-sm w-44 truncate">
                  {song.name}
                </div>
                <div className="text-xs">{song.artist}</div>
              </div>
            </div>

            <button
              onClick={() => togglePlayPause(song.id, song.previewUrl)}
              className="cursor-pointer text-white px-4 py-2 rounded-md"
            >
              {songStates.isPlaying[song.id] ? <PauseIcon /> : <PlayIcon />}
            </button>

            <audio ref={(el) => (audioRef.current[song.id] = el)}>
              <source src={song.previewUrl} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicTimeline;
