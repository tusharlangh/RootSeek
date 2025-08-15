import Post from "../../models/post-model.js";

export async function topTheme(userId) {
  const posts = await Post.find({ user: userId });

  const topicCounts = {};

  posts.forEach((post) => {
    post.nlpInsights.topics.forEach((topic) => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  });

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map((entry) => entry[0]);

  const grouped = {};

  topTopics.forEach((topic) => {
    grouped[topic] = [];
    posts.forEach((post) => {
      if (post.nlpInsights.topics.includes(topic)) {
        grouped[topic].push(post);
      }
    });
  });

  return grouped;
}
