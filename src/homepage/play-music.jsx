import React, { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "./icons";
import axios from "axios";

const PlayMusic = ({ trackId }) => {
  const audioRef = useRef(null);
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackCached, setTrackCached] = useState(false);

  useEffect(() => {
    if (trackCached) return;

    axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/${trackId}`
      )
      .then((response) => {
        setSong(response.data.preview);
        setTrackCached(true);
      })
      .catch((error) => console.error(error));
  }, [trackCached, trackId]);

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
    <div>
      <div className="text-white cursor-pointer" onClick={togglePlayPause}>
        {isPlaying ? <PauseIcon size={8} /> : <PlayIcon size={8} />}
      </div>
      <audio ref={audioRef} src={song} onEnded={() => setIsPlaying(false)} />
    </div>
  );
};

export default PlayMusic;
