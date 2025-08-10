import mongoose from "mongoose";

const postScheme = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //this creates a link between models. Here you are linking each post to the creater or the user who created that post.
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    picture: { type: String },
    trackId: { type: String, default: "" },
    trackName: { type: String, default: "" },
    trackArtist: { type: String, default: "" },
    trackAlbumCover: { type: String, default: "" },
    hashTags: { type: String, default: "" },
    albumId: { type: String, default: "" },
    linearGradient: { light: { type: String }, dark: { type: String } },
    nlpInsights: {
      mood: { type: String, default: "" },
      intensity: { type: Number, default: 0 },
      topics: [{ type: String }],
      entities: [{ type: String }],
      tone: { type: String, default: "" },
      summary: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postScheme);

export default Post;
