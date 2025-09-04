import NlpTasks from "../../models/nlptasks.js";

export async function getProgression(theme, userId) {
  const tasks = await NlpTasks.findOne({ user: userId });

  if (!tasks) return null;

  for (let task of tasks.themeThread.data) {
    if (task.theme === theme) {
      return {
        growth_role: task.growth_role,
        summary: task.summary,
        dates: task.dates,
        emoji: task.emoji,
      };
    }
  }
  return null;
}
// {growth_role: [], summary: [], dates: []}
