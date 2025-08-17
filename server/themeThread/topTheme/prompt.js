export function topThemePrompt(posts) {
  const content = posts.map((post) => ({
    _id: post._id,
    topics: post.nlpInsights.topics,
  }));

  const messages = [
    {
      role: "system",
      content: `
        You are given posts with:
          - _id (string)
          - topics (array of strings)

          Task:
          1. Identify the top 4 recurring themes.
          2. Merge semantically similar topics into one theme (e.g., "love", "like" → "love").
          3. Return strictly valid JSON. Each theme key maps to an array of _id strings of posts containing at least one topic in that theme.
          4. Escape all quotes and special characters in strings.
          5. Do not include explanations, Markdown, or any text outside the JSON object.

          Example format:
          {"love": ["id1","id2"], "work": ["id3"], "travel": ["id4"], "music": ["id5"]}
        `,
    },
    {
      role: "user",
      content: `Here are the post ids with topics. ${JSON.stringify(content)}`,
    },
  ];

  return messages;
}
