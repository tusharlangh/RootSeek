import Post from "../models/post-model.js";

export async function extractposts(posts) {
  const extracted = [];

  for (let id of posts) {
    const root = await Post.findById(id);
    extracted.push(root);
  }

  return extracted;
}
