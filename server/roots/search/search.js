import Post from "../../models/post-model.js";
import { allPosts } from "../get/allPosts/allPosts.js";

export async function search(searchItem, userId) {
  if (!searchItem) {
    return await allPosts(userId);
  }
  const filter = { user: userId };

  if (searchItem.startsWith("#")) {
    filter.hashTags = { $regex: searchItem, $options: "i" };
  } else {
    filter.$or = [
      { title: { $regex: searchItem, $options: "i" } },
      { content: { $regex: searchItem, $options: "i" } },
    ];
  }

  const userPosts = await Post.find(filter);

  return userPosts;
}
