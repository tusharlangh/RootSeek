import { callOpenAI } from "../../aiClient.js";
import Post from "../../models/post-model.js";
import { nlpPrompt } from "./prompt.js";
import {
  ligherColorsForLightTheme,
  darkerColorsForDarkTheme,
} from "./utility.js";

export async function createRoot(
  title,
  mood,
  content,
  trackId,
  trackName,
  trackArtist,
  trackAlbumCover,
  hashTags,
  userId,
  file,
  filename
) {
  const nlpInsights = await callOpenAI(nlpPrompt(content));

  const posts = await Post.find({ user: userId });
  const currentIndex = posts.length - 1;

  const post = new Post({
    user: userId,
    title,
    content,
    date: Date.now(),
    mood,
    picture: file ? `/uploads/${filename}` : "", //the filename is changed from the original to the new file. its changed by the mutler
    trackId,
    trackName,
    trackArtist,
    trackAlbumCover,
    hashTags,
    linearGradient: {
      light:
        ligherColorsForLightTheme[
          currentIndex % ligherColorsForLightTheme.length
        ],
      dark: darkerColorsForDarkTheme[
        currentIndex % darkerColorsForDarkTheme.length
      ],
    },
    nlpInsights,
  });
  await post.save();

  return post;
}
