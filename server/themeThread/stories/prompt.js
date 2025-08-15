export function storiesPrompt(posts, theme) {
  const combinedContent = posts.map(
    (post, i) =>
      `Post ${i + 1}: mood - ${post.nlpInsights.mood}, intensity - ${
        post.nlpInsights.intensity
      }, topics - ${post.nlpInsights.topics.join(
        ", "
      )}, entities - ${post.nlpInsights.entities.join(", ")}, tone - ${
        post.nlpInsights.tone
      }, summary - ${post.nlpInsights.summary}`
  );

  const messages = [
    {
      role: "system",
      content: `
        You are an introspective assistant helping a user understand their emotional and personal journey through a specific theme, such as "Learning" or "Confidence."

        Below is a personal memory entry written by the user. Your job is to extract a **milestone card** from it that highlights how this moment fits into their larger journey.

        Respond in the following JSON format:

        [
          {
            "title": "<One of: 'Breakthrough', 'Struggle', 'First Step', 'Clarity', 'Setback', 'Insight', 'Looping Pattern'>",
            "emoji": "<Relevant emoji to match the tone or theme>",
            "suspense": "<A short, emotionally loaded teaser line (like an internal voice or hook). Should be 4–8 words, evocative, and hint at tension or change.>",
            "message": "<A reflection or insight about why this moment matters or what it reveals about the user> (less than 40 words)",
            "linearGradient": ["#color1", "#color2"] assign a linear gradient color pair for each memory to visually match the emotional tone or change. Use calm or warm colors (like lavender, teal, rose, gray, navy, peach) avoid neon or saturated ones.
            "isTurningPoint": true/false,
          }
        ]

        first check if the isTurningPoint is true or false for a memory. if true then and only add to the final JSON format otherwise do not add anything and move to the next memory. 

        Keep the language for a 15 year old to understand.

        Maximum amount of milestone cards to produce is 3 and minimum is 1 do not exceed or go below this. 

        At the end take all the generated milestone and create a progression card that would tell the user its progression on that theme. 

        {
          "message": "<tells the user its progression> less than 30 words"
        }

        the final output:
        [
          {miltestone cards},
          {progression card}
        ]

        the progression card should always be at the end. 

        Be thoughtful, emotionally intelligent, and encouraging. If the memory is insightful or shows learning, highlight it. If it shows repetition, struggle, or confusion, mark it honestly but gently.
        `,
    },
    {
      role: "user",
      content: `Here are the memories and the extracted information from the memories:\n\n"${combinedContent} and the theme is: ${theme}"`,
    },
  ];

  return messages;
}
