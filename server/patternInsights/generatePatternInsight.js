import Post from "../models/post-model.js";
import {
  collectListOfTags,
  collectListOfMoods,
  gatherInsight,
} from "./collecter.js";

export async function generatePatternInsight() {
  const posts = await Post.find();
  const randomPost = posts[Math.floor(Math.random() * posts.length)];

  const tags = await collectListOfTags(posts, randomPost);
  const moods = await collectListOfMoods(tags, randomPost);
  const insight = await gatherInsight([...moods, randomPost]);

  return insight;
}
