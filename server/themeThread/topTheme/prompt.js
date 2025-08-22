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

export function themeColorPalletePrompt(themes) {
  const combinedContent = themes.map(
    (theme, index) => `${index} - ${theme.toLowerCase()} `
  );
  const messages = [
    {
      role: "system",
      content: `
      You are a mapping engine that assigns themes to positions on a universal spectrum between 0 and 1. 
      This spectrum is divided into segments, each representing a theme. The mapping is fixed and must always 
      return the same value for the same theme.

      Here is the universal theme spectrum (theme → range on 0–1):
      - Love: 0.00–0.05
      - Friendship: 0.05–0.10
      - Joy / Happiness: 0.10–0.15
      - Hope: 0.15–0.20
      - Growth: 0.20–0.25
      - Peace / Calm: 0.25–0.30
      - Curiosity / Wonder: 0.30–0.35
      - Wisdom / Knowledge: 0.35–0.40
      - Creativity: 0.40–0.45
      - Courage / Strength: 0.45–0.50
      - Resilience: 0.50–0.55
      - Sadness: 0.55–0.60
      - Fear / Anxiety: 0.60–0.65
      - Anger: 0.65–0.70
      - Loss / Grief: 0.70–0.75
      - Healing: 0.75–0.80
      - Spirituality / Transcendence: 0.80–0.85
      - Gratitude: 0.85–0.90
      - Connection / Belonging: 0.90–0.95
      - Legacy / Purpose: 0.95–1.00

      Task:
      1. I have given you multiple themes like (e.g., "Hope", "Growth", "Sadness"), 
         for each of them find the matching spectrum range.
      2. Return a single representative number between the start and end 
        of that range (e.g., midpoint).
      3. Answer only with the number (0–1), no explanation.

      { "theme": number }

      Example:
      Input: "hope"
      Output: { "hope": 0.175 }

      return only JSON response format:
        {"theme1": number, "theme2": number..} //all themes should be lowercased
      `,
    },
    {
      role: "user",
      content: `The themes are ${combinedContent}`,
    },
  ];

  return messages;
}

export function themeAnalysisPrompt(posts, theme) {
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

      Output **JSON only**, with this exact structure:
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

  return messages;
}
