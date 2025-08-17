import Post from "../../models/post-model.js";
import { topThemePrompt } from "./prompt.js";
import { callOpenAI } from "../../aiClient.js";
import NlpTasks from "../../models/nlptasks.js";
import moment from "moment";

async function f(userId) {
  const posts = await Post.find({ user: userId });
  const tasks = await NlpTasks.findOne({ user: userId });

  let date = moment("30-11-2005", "DD-MM-YYYY");

  if (tasks.date) {
    date = moment(tasks.storiesData.date);
  }

  if (moment().diff(date, "days") > 30) {
    const messages = topThemePrompt(posts);
    const result = await callOpenAI(messages, "gpt-4.1-mini", 0, 2000);

    tasks.storiesData.data = result;
    tasks.storiesData.date = moment().toDate();
    await tasks.save();
  }

  return tasks.storiesData.data;
}

export async function topTheme(userId) {
  const tasks = await NlpTasks.findOne({ user: userId });

  let date = moment("30-11-2005", "DD-MM-YYYY");

  if (tasks.storiesData.date) {
    date = moment(tasks.storiesData.date);
  }

  if (moment().diff(date, "days") > 30) {
    const posts = await Post.find({ user: userId });
    const messages = topThemePrompt(posts);
    const result = await callOpenAI(messages, "gpt-4.1-mini", 0, 2000);

    tasks.storiesData.data = result;
    tasks.storiesData.date = moment().toDate();
    await tasks.save();
  }

  return tasks.storiesData.data;
}
