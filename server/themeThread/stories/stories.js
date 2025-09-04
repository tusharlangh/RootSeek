import { callOpenAI } from "../../aiClient.js";
import NlpTasks from "../../models/nlptasks.js";
import { storiesPrompt } from "./prompt.js";
import Post from "../../models/post-model.js";

export async function stories(userId, theme) {
  const nlpTasks = await NlpTasks.findOne({ user: userId });

  const tasks = nlpTasks.storiesData.data[theme];
  const posts = await Post.find({ _id: { $in: tasks } });

  return posts;
}
