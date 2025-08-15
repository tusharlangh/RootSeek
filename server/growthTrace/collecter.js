import { aggregatedEmotionalDataPrompt, growthTracePrompt } from "./prompts.js";
import { callOpenAI } from "../aiClient.js";

export async function getAggregatedEmotionalData(
  moodSequential,
  toneSequential,
  intensitySequential
) {
  const messages = aggregatedEmotionalDataPrompt(
    moodSequential,
    toneSequential,
    intensitySequential
  );
  const result = await callOpenAI(messages);
  return result;
}

export async function getGrowthTrace(lastPost, aggregatedData) {
  const messages = growthTracePrompt(lastPost, aggregatedData);
  const result = await callOpenAI(messages);
  return result;
}
