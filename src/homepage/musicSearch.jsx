import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { PauseIcon, PlayIcon, SearchIconOutline } from "./icons";

const MusicSearch = ({ onSelectSong }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPlaying, setIsPlaying] = useState({});
  const audioRef = useRef({});

  useEffect(() => {
    if (!query) return;

    // Deezer API endpoint for searching tracks
    axios
      .get(
        "https://cors-anywhere.herokuapp.com/https://api.deezer.com/search",
        {
          params: { q: query, limit: 5 },
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
    return setIsPlaying((prev) => ({
      ...prev,
      [id]: !prev[id],
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
    <div className="w-82 p-4 bg-white shadow rounded-lg">
      <div className="relative">
        <div className="absolute top-2.75 left-3">
          <SearchIconOutline size={5} />
        </div>

        <input
          type="text"
          placeholder="Search music"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 bg-[#FAFAFA] border border-[#DEDEDE] rounded-md px-3 py-2"
        />
      </div>

      <ul className="mt-4">
        {results.map((song) => (
          <li
            key={song.id}
            className="cursor-pointer hover:bg-[#EEEEEE] transition-all duration-300 p-2 rounded-md flex justify-between items-center"
            onClick={() => onSelectSong(song)}
          >
            <div className="flex gap-4 items-center">
              <div className="">
                <img
                  src={song.albumCover}
                  className="object-cover h-12 w-12 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <div className="font-semibold text-sm w-40 truncate">
                  {song.name}
                </div>
                <div className="text-xs">{song.artist}</div>
              </div>
            </div>

            <button
              onClick={() => togglePlayPause(song.id, song.previewUrl)}
              className="cursor-pointer text-white px-4 py-2 rounded-md"
            >
              {isPlaying[song.id] ? (
                <PauseIcon color={"black"} />
              ) : (
                <PlayIcon color={"black"} />
              )}
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

export default MusicSearch;
