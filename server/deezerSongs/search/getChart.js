import axios from "axios";

export async function getChart() {
  try {
    const response = await axios.get("https://api.deezer.com/chart/0");
    return response.data.tracks;
  } catch (error) {
    console.error(error);
  }
}
