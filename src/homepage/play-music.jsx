import React, { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "./icons";
import axios from "axios";

const PlayMusic = ({ trackId }) => {
  const audioRef = useRef(null);
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5002/deezer-search-song?trackId=${trackId}`)
      .then((response) => {
        setSong(response.data);
      })
      .catch((error) => {
        console.error("Error searching music:", error);
      });
  }, [trackId]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="">
      <div className="cursor-pointer" onClick={togglePlayPause}>
        {isPlaying ? <PauseIcon size={8} /> : <PlayIcon size={8} />}
      </div>
      <audio ref={audioRef} src={song} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default PlayMusic;
