import Post from "../../models/post-model.js";
import {
  themeAnalysisPrompt,
  themeColorPalletePrompt,
  topThemePrompt,
} from "./prompt.js";
import { callOpenAI } from "../../aiClient.js";
import NlpTasks from "../../models/nlptasks.js";
import moment from "moment";
import { colorPallete } from "./colorPallete.js";

async function generateTopThemes(posts) {
  const messages = topThemePrompt(posts);
  return await callOpenAI(messages, "gpt-4.1-mini", 0, 2000);
}

async function assignThemeColors(themes, result) {
  const themeColors = {};

  for (let theme of themes) {
    const themeColor = result[theme.toLowerCase()];
    const number = Math.floor(themeColor * 10) / 10;
    themeColors[theme.toLowerCase()] = colorPallete[String(number)];
  }

  return themeColors;
}

async function analyzeThemes(themes) {
  const themeAnalyses = {};

  for (let [theme, postIds] of Object.entries(themes)) {
    const posts = await getPosts(postIds);
    const messages = themeAnalysisPrompt(posts, theme.toLowerCase());
    const results = await callOpenAI(messages, "gpt-4.1-mini", 0, 2000);

    console.log(results.emoji);
    themeAnalyses[theme.toLowerCase()] = {
      summary: results.map((result) => result.summary),
      growth_role: results.map((result) => result.growth_role),
      dates: posts.map((post) => post.createdAt),
      emoji: results.map((result) => result.emoji),
    };
  }

  return themeAnalyses;
}

async function getPosts(postIds) {
  return await Post.find({ _id: { $in: postIds } });
}

export async function topTheme(userId, force = false) {
  const tasks = await NlpTasks.findOne({ user: userId });
  const posts = await Post.find({ user: userId });

  let date = tasks.themeThread?.date
    ? moment(tasks.themeThread.date)
    : moment(0);

  if (force || moment().diff(date, "days") > 30) {
    tasks.themeThread.data = [];

    const themes = await generateTopThemes(posts);

    const analyses = await analyzeThemes(themes);

    const colors_result = await callOpenAI(
      themeColorPalletePrompt(Object.keys(themes))
    );
    const colors = await assignThemeColors(Object.keys(themes), colors_result);

    tasks.themeThread.data = Object.keys(themes).map((theme) => ({
      theme: theme.toLowerCase(),
      dates: analyses[theme.toLowerCase()]?.dates,
      summary: analyses[theme.toLowerCase()]?.summary,
      growth_role: analyses[theme.toLowerCase()]?.growth_role,
      emoji: analyses[theme.toLowerCase()]?.emoji,
      color: colors[theme.toLowerCase()],
    }));

    tasks.themeThread.date = moment().toDate();

    await tasks.save();
  }

  return tasks.themeThread.data.map((data) => ({
    _theme: data.theme,
    _theme_color: data.color,
  }));
}
