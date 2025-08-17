import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;

export async function callOpenAI(
  messages,
  model = "gpt-4.1-mini",
  temperature = 0.4,
  maxTokens = 300
) {
  const res = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    { model, messages, temperature, max_tokens: maxTokens },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return JSON.parse(res.data.choices[0].message.content);
}
