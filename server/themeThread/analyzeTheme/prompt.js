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

  return messages;
}
