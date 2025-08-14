import Post from "../../../models/post-model.js";

export async function singlePost(rootId) {
  return await Post.findById(rootId);
}
