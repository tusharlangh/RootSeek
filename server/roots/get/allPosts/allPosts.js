import Post from "../../../models/post-model.js";

export async function allPosts(userId) {
  const posts = await Post.find({ user: userId });
  return posts;
}
