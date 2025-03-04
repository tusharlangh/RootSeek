import React, { useEffect, useState } from "react";
import axios from "axios";
import { SearchIconOutline } from "./icons";

const MusicSearch = ({ onSelectSong }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  const getAccessToken = () => {
    axios
      .post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: "d154b6caeb8f4c10a4f420247e5e191c",
          client_secret: "8519e476ccf04b74aa0319822aadbe23",
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      )
      .then((response) => {
        setAccessToken(response.data.access_token);
      })
      .catch((error) => {
        console.error("Error getting Spotify token:", error);
      });
  };

  useEffect(() => {
    if (!query || !accessToken) return;

    axios
      .get("https://api.spotify.com/v1/search", {
        params: { q: query, type: "track", limit: 5 },
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        const tracks = response.data.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          previewUrl: track.preview_url, // Short preview clip
          spotifyUrl: track.external_urls.spotify, // Full song link
          albumCover:
            track.album.images.length > 0 ? track.album.images[0].url : null, // Album cover
          durationMs: track.duration_ms, // Duration in milliseconds
        }));
        setResults(tracks);
      })
      .catch((error) => {
        console.error("Error searching music:", error);
      });
  }, [query]);

  // Fetch access token when component mounts
  React.useEffect(() => {
    getAccessToken();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
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
            className="cursor-pointer hover:bg-[#EEEEEE] transition-all duration-300 p-2 rounded-md flex items-center gap-4"
            onClick={() => onSelectSong(song)}
          >
            <div>
              <img src={song.albumCover} className="h-12 w-12 rounded-md" />
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-sm">{song.name}</div>
              <div className="text-xs">{song.artist}</div>
            </div>

            {song.previewUrl ? (
              <audio controls>
                <source src={song.spotifyUrl} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div className="text-sm text-gray-500">{song.previewUrl}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MusicSearch;
