import { insightPrompt, moodPrompt, tagPrompt } from "./prompts.js";
import { callOpenAI } from "./aiClient.js";
import { extractposts } from "./utility.js";

export async function collectListOfTags(posts, randomPost) {
  const messages = tagPrompt(posts, randomPost);
  const result = await callOpenAI(messages);
  return await extractposts(result);
}

export async function collectListOfMoods(posts, randomPost) {
  const messages = moodPrompt(posts, randomPost);
  const result = await callOpenAI(messages);
  return await extractposts(result);
}

export async function gatherInsight(posts) {
  const messages = insightPrompt(posts);
  return await callOpenAI(messages);
}
