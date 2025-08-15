import { getPast60DaysPosts, getSequentialData } from "./utility.js";
import { getAggregatedEmotionalData, getGrowthTrace } from "./collecter.js";

export async function growthTrace(posts) {
  const lastPost = posts[posts.length - 1];

  const past60Days = getPast60DaysPosts(posts, lastPost);

  const moodSequential = getSequentialData(past60Days, lastPost, "mood");
  const toneSequential = getSequentialData(past60Days, lastPost, "tone");
  const intensitySequential = getSequentialData(
    past60Days,
    lastPost,
    "intensity"
  );

  const aggregatedData = await getAggregatedEmotionalData(
    moodSequential,
    toneSequential,
    intensitySequential
  );

  return await getGrowthTrace(lastPost, aggregatedData);
}
