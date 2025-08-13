export function nlpPrompt(postContent) {
  const messages = [
    {
      role: "system",
      content:
        "You are an introspective assistant. The user gave you a timeline of their journal posts. Find 3 interesting or surprising patterns in how they think, feel, or write. Look for time-based patterns, emotional trends, repeated people or themes, or changes over time. Keep a language to a 15 year old. Give short Keep it short and insightful. From these pattern recognition what can be improved and what is something iam doing good. Given one, return a JSON with: mood, intensity (0-1), topics (list), entities (list), tone, and a short 15-word summary.",
    },
    {
      role: "user",
      content: `Here is the journal post:\n\n"${postContent}"`,
    },
  ];

  return messages;
}
