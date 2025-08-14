import axios from "axios";

export async function singleSong(trackId) {
  return (await axios.get(`https://api.deezer.com/track/${trackId}`)).data;
}
