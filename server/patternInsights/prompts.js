export function tagPrompt(posts, randomPost) {
  const randomPostSummary = `id: ${randomPost._id}, tags: ${randomPost.hashTags}, root-summary: ${randomPost.nlpInsights.summary}}`;

  const tagsSummary = posts.map(
    (post) =>
      `id: ${post._id}, tags: ${post.hashTags}, root-summary: ${post.nlpInsights.summary}`
  );

  const tagsMessage = [
    {
      role: "system",
      content: `
      You are given a list of journal roots. Each root has an ID, a list of tags, and a summary. You are also given one root to compare against.

      Your job is to return the IDs of all journal roots that have either:
      - Tags that exactly match any of the tags from the comparison root (MUST include these), OR
      - Tags that are semantically similar in meaning (use synonym or closely related concept matching).
      - IMPORTANT: More than 1 ID must be found.

      Respond ONLY with the IDs in a JSON array like this:
      ["id1", "id2", "id3"]

      Do not return any explanations, just the array.
      `,
    },
    {
      role: "user",
      content: `Here are the journal roots: ${tagsSummary} \n\nCompare them against this root: ${randomPostSummary}`,
    },
  ];

  return tagsMessage;
}

export function moodPrompt(posts, randomPost) {
  let randomPostSummary = `id: ${randomPost._id}, mood: ${randomPost.nlpInsights.mood}, intensity: ${randomPost.nlpInsights.intensity}, tone: ${randomPost.nlpInsights.tone}`;

  const moodsSummary = posts.map(
    (post) =>
      `id: ${post._id}, mood: ${post.nlpInsights.mood}, intensity: ${post.nlpInsights.intensity}, tone: ${post.nlpInsights.tone}`
  );

  const moodsMessage = [
    {
      role: "system",
      content: `
      You are given a list of journal roots. Each root has:
      - an ID
      - a mood
      - an intensity
      - a tone

      You are also given one root to compare against.

      Your job:
      - Return the IDs of all journal roots that either:
        - Have the **same** mood, tone, and intensity as the comparison root
        - OR have **similar** mood, tone, and intensity (use natural language understanding to decide what is similar)

      Rules:
      - IMPORTANT: Return **more than 1 ID**
      - Respond ONLY with the IDs in a JSON array, like this: ["id1", "id2", "id3"]
      - Do not return any explanations or extra content
      `,
    },
    {
      role: "user",
      content: `Here are the journal roots:\n${moodsSummary}\n\nCompare them against this root:\n${randomPostSummary}`,
    },
  ];

  return moodsMessage;
}

export function insightPrompt(posts) {
  const insightSummary = posts.map(
    (insight) =>
      `id: ${insight._id}, 
      content: ${insight.content}, 
      topics: ${insight.nlpInsights.topics.join(", ")}, 
      entities: ${insight.nlpInsights.entities.join(", ")}, 
      time: ${insight.createdAt}`
  );

  const insightMessage = [
    {
      role: "system",
      content: `
      You are given a collection of personal journal roots. Each root contains a user’s reflection or memory, 
      including details such as mood, tone, intensity, topics, and emotional content.
      Your task is to analyze all the roots together and find any emerging patterns — these can be 
      emotional habits, recurring struggles, positive shifts, mindset loops, repeated behaviors, or themes. 
      Patterns can be either helpful or unhelpful, clear or subtle — but must be meaningful.
      For each pattern insight, provide:
      A clear and reflective statement about the pattern you've observed (concise but insightful). less than 40 words.
      A short, motivational or gentle life lesson that speaks directly to that pattern — something encouraging, less than 20 words
      thoughtful, and non-judgmental.
      Use calm, simple language as if you're helping a thoughtful 14-year-old understand themselves better. Think of yourself as a professional senior therapist.

      You can generate as how many insights you can find between the roots but give me the best 2 only.

      This exact JSON structure:
        Only give me 2 of the best insights. 
        {
        "insight1": "Your first insight here\n\n\nMotivational message for insight1", 
        "insight2": "Your first insight here\n\n\nMotivational message for insight2", 
        }
      `,
    },
    {
      role: "user",
      content: `Here are the journal roots:\n${insightSummary}`,
    },
  ];

  return insightMessage;
}
