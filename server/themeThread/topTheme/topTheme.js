import Post from "../../models/post-model.js";
import { themeColorPalletePrompt, topThemePrompt } from "./prompt.js";
import { callOpenAI } from "../../aiClient.js";
import NlpTasks from "../../models/nlptasks.js";
import moment from "moment";
import { colorPallete } from "./colorPallete.js";

async function generateTopThemes(userId) {
  const posts = await Post.find({ user: userId });
  const messages = topThemePrompt(posts);
  return await callOpenAI(messages, "gpt-4.1-mini", 0, 2000);
}

async function assignThemeColors(themes, tasks) {
  const result = await callOpenAI(themeColorPalletePrompt(themes));

  for (let data of tasks.themeThread.data) {
    const themeColor = result[data.theme];
    const number = Math.floor(themeColor * 10) / 10;
    data.color = colorPallete[String(number)];
  }
}

export async function topTheme(userId, force = false) {
  const tasks = await NlpTasks.findOne({ user: userId });

  let date = tasks.themeThread?.date
    ? moment(tasks.themeThread.date)
    : moment(0);

  if (force || moment().diff(date, "days") > 30) {
    tasks.themeThread.data = [];

    const result = await generateTopThemes(userId);

    for (let [theme, postIds] of Object.entries(result)) {
      tasks.themeThread.data.push({ theme: theme.toLowerCase(), postIds });
    }

    tasks.themeThread.date = moment().toDate();

    await assignThemeColors(Object.keys(result), tasks);

    await tasks.save();
  }

  return tasks.themeThread.data.map((data) => ({
    _theme: data.theme,
    _theme_color: data.color,
  }));
}

{
  /*
    const posts = await Post.find({
      _id: { $in: tasks.storiesData.data["personal_growth"] },
    });

    const fun = await f(posts, "personal_growth");
  */
}

async function f(posts, theme) {
  const combinedContent = posts.map(
    (post, index) => `${index}. ${post.content}`
  );

  const messages = [
    {
      role: "system",
      content: `
      Think of yourself as gpt 5 and give answer according to that.
      I will give you a list of journal entries that all contain the theme ${theme}. Your task is to show how each entry plays a role in the progression of this theme. For each entry, do two things:
      Summary: Write a short arrow-based summary that shows the flow of events or realizations. For longer entries, break them into natural steps with arrows (→). For shorter entries, keep the summary short but still arrow-based.
      Growth Role: Explain what role this entry plays in the overall theme of ${theme} growth. Do NOT just repeat what the user already wrote. Be concise (max 20 words). If the entry shows no real growth, clearly state that.
      Explain this in **simple, everyday language** that a **10-year-old** can understand. Avoid jargon, technical terms, or long sentences..

      Give me a JSON only: 
      [
        {
          summary: the summary,
          growth_role: the growth
        }
      ]
      `,
    },
    {
      role: "user",
      content: `Here are the memories and the extracted information from the memories:\n\n"${combinedContent} and the theme is: ${theme}"`,
    },
  ];

  const results = await callOpenAI(messages, "gpt-4.1-mini", 0, 2000);

  for (let i = 0; i < results.length; i++) {
    const pos = results[i];
    pos["date"] = posts[i].createdAt;
    pos["emoji"] = "😃";
  }

  console.log(results);
}
