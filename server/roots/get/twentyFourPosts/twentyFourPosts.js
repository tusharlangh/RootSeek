import Post from "../../../models/post-model.js";
import moment from "moment";

export async function twentyFourPosts(userId) {
  const twentyfourhoursago = moment().subtract(24, "hours");

  const userPosts = await Post.find({
    user: userId,
    date: { $gte: twentyfourhoursago },
  });

  return userPosts; 
}
