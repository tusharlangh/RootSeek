import { getChart } from "./getChart.js";
import axios from "axios";

export async function songSearch(q, limit) {
  if (!q) {
    return await getChart();
  }
  const response = await axios.get("https://api.deezer.com/search", {
    //no cors error will show because cors is only enforced if an request is made from an browser. Server to server no cors will be involved.
    params: { q, limit },
  });

  return response.data;
}
