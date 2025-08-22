import { themeAnalysisPrompt } from "./prompt.js";
import NlpTasks from "../../models/nlptasks.js";

export async function analyzeThemeProgression(
  posts,
  theme,
  userId,
  force = false
) {
  const tasks = await NlpTasks.findOne({ user: userId });

  let date = tasks.themeThread?.date
    ? moment(tasks.themeThread.date)
    : moment(0);

  if (force || moment().diff(date, "days") > 30) {
    const messages = themeAnalysisPrompt(posts, theme);

    const results = await callOpenAI(messages, "gpt-4.1-mini", 0, 2000);

    const filter = { "themeThread.data.theme": theme };
    const updateDoc = {
      $set: {
        "themeThread.data.$.summary": results.summary,
        "themeThread.data.$.growth_role": results.growth_role,
      },
    };
    await tasks.updateOne(filter, updateDoc);
  }

  return;
}
