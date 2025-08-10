import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

export async function getAggregatedEmotionalData(
  moodSequential,
  toneSequential,
  intensitySequential
) {
  const formedRoot = `here is the JSON data: mood: ${JSON.stringify(
    moodSequential
  )}, tone: ${JSON.stringify(toneSequential)}, intensity: ${JSON.stringify(
    intensitySequential
  )}`;

  const messages = [
    {
      role: "system",
      content: `
        You are an expert in emotional data aggregation and analysis.

        You will be given three JSON objects representing a user’s emotional data over 60 days, divided into sequential 10-day segments:

        1. Moods by segment: each key maps to a list of mood labels (strings), e.g. { '1_10': ['thoughtful', 'peaceful'], ... }  
        2. Tones by segment: each key maps to a list of tone descriptions (strings), e.g. { '1_10': ['reflective and curious', 'calm and appreciative'], ... }  
        3. Intensities by segment: each key maps to a list of numeric intensity values (floats between 0 and 1), e.g. { '1_10': [0.6, 0.4], ... }

        Your task:

        For each 10-day segment (keys like '1_10', '11_20', etc.):  
        - Determine the **dominant mood** by selecting the mood label that appears most frequently;  
          - If multiple moods tie, select a single mood that best represents or combines the tied moods semantically (choose one existing mood word, not a phrase).  
          - If the list is empty, the dominant mood for that segment is "null".

        - Determine the **dominant tone** by selecting the tone description that appears most frequently;  
          - If multiple tones tie, select the tone that best captures the overall emotional style of the segment.  
          - If the list is empty, the dominant tone for that segment is "null".

        - Calculate the **average intensity** for the segment rounded to two decimal places;  
          - If the intensity list is empty, the average intensity for that segment is "null".

        Additionally, compute the following **overall metrics across all segments**:  
        - The dominant mood across all moods in all segments combined, using the same tie-breaking logic as above.  
        - The dominant tone across all tones in all segments combined, using the same tie-breaking logic as above.  
        - The average intensity across all intensity values from all segments, rounded to two decimals.

        Output only valid JSON in this exact structure:

        {
          "overall": {
            "mood": "dominant mood or null",
            "tone": "dominant tone or null",
            "intensity": average intensity or null
          },
          "segments": {
            "1_10": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            },
            "11_20": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            },
            "21_30": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            },
            "31_40": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            },
            "41_50": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            },
            "51_60": {
              "mood": "dominant mood or null",
              "tone": "dominant tone or null",
              "intensity": average intensity or null
            }
          }
        }
        `,
    },
    {
      role: "user",
      content: formedRoot,
    },
  ];

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4.1-mini",
      messages,
      temperature: 0,
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return JSON.parse(response.data.choices[0].message.content);
}

export async function getGrowthTrace(lastPost, aggregatedData) {
  const messages = [
    {
      role: "system",
      content: `
        You are an expert in emotional trend analysis and personal growth detection.

        You will be given:
        1. The most dominant mood, tone, and intensity across the last 60 days.
        2. The most dominant mood, tone, and intensity for each sequential 10-day period within those 60 days (some periods may be null if no entries).
        3. The latest entry, with its mood label, tone description, and intensity value.

        Your task:
        1. Compare the latest entry’s mood, tone, and intensity to:
          - The overall dominant mood, tone, and intensity across 60 days.
          - The dominant mood, tone, and intensity of the most recent 10-day period (or the last non-null period if the most recent is null).

        2. Determine whether there is:
          - **Positive growth** → The latest mood and tone show improvement toward more positive or balanced states, and/or the intensity reflects healthier emotional regulation compared to recent or long-term patterns.
          - **Regression** → The latest mood and tone reflect a decline toward more negative or unstable states, and/or the intensity indicates escalating emotional distress.
          - **Stability** → The latest mood and tone align with past positive trends, and intensity remains consistent, showing emotional steadiness.
          - **Recovery** → The latest mood and tone are more positive after a recent negative trend, and intensity shows decreasing negative emotional intensity or increasing positive emotional energy.

        3. Incorporate semantic similarity when comparing moods and tones:
          - If moods or tones are semantically close (e.g., "calm" and "peaceful", "reflective" and "thoughtful"), treat them as aligned.
          - If moods or tones are distinctly different (e.g., "calm" and "anxious", "reflective" and "frustrated"), treat them as a meaningful change in emotional state or mindset.

        4. Use intensity to assess emotional strength:
          - Higher intensity in positive moods/tone can indicate greater emotional engagement or growth.
          - Lower intensity in negative moods/tone can indicate improved coping or reduced distress.
          - Sudden spikes or drops in intensity should be noted as signs of change or volatility.

        5. Use natural, empathetic language and avoid exaggerated language to summarize the personal growth insight in **1–3 sentences**, referencing time naturally when relevant (e.g., “over the past month,” “in the last two weeks,” “today”).
        6. Do not reference 60 days pattern or recent 10 days pattern. Sound it trustworthy 

        Output format:
        Return only valid JSON in this exact structure:
        {
          "growth_type": "positive_growth | regression | stability | recovery",
          "insight": "Brief natural-language insight summarizing the change or stability in the user's emotional state, incorporating mood, tone, and intensity."
        }
        `,
    },
    {
      role: "user",
      content: `latest root's mood ${
        lastPost.nlpInsights.mood
      }, latest root's tone ${
        lastPost.nlpInsights.tone
      }, latest root's intensity ${
        lastPost.nlpInsights.intensity
      }, the most dominant mood, tone, intensity across 60 days is ${JSON.stringify(
        aggregatedData.overall
      )} and the most dominant mood, tone and intensity across 10 days sequencial is in this object: ${JSON.stringify(
        aggregatedData.segments
      )}`,
    },
  ];

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4.1-mini",
      messages,
      temperature: 0,
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return JSON.parse(response.data.choices[0].message.content);
}
