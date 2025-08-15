import { callOpenAI } from "../../aiClient.js";
import NlpTasks from "../../models/nlptasks.js";
import { storiesPrompt } from "./prompt.js";

export async function stories(userId, posts, theme) {
  const nlpTasks = await NlpTasks.findOne({ user: userId });

  const tasks = nlpTasks.storiesData;

  if (!tasks[theme]) {
    const messages = storiesPrompt(posts, theme);

    const response = await callOpenAI(messages);

    nlpTasks.storiesData[theme] = response;
    nlpTasks.save();
  }

  return nlpTasks.storiesData[theme];
}
