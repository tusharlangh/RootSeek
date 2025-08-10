import moment from "moment";

export function getPast60DaysPosts(posts, lastPost) {
  return posts.filter(
    (post) =>
      moment(lastPost.createdAt).diff(moment(post.createdAt), "days") < 60
  );
}

export function getSequentialData(posts, lastPost, label) {
  const periods = {
    "1_10": [],
    "11_20": [],
    "21_30": [],
    "31_40": [],
    "41_50": [],
    "51_60": [],
  };

  for (let post of posts) {
    const diff = moment(lastPost.createdAt).diff(
      moment(post.createdAt),
      "days"
    );

    if (diff > 50) periods["1_10"].push(post.nlpInsights[label]);
    else if (diff > 40) periods["11_20"].push(post.nlpInsights[label]);
    else if (diff > 30) periods["21_30"].push(post.nlpInsights[label]);
    else if (diff > 20) periods["31_40"].push(post.nlpInsights[label]);
    else if (diff > 10) periods["41_50"].push(post.nlpInsights[label]);
    else periods["51_60"].push(post.nlpInsights[label]);
  }

  return periods;
}
