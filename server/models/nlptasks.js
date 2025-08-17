import mongoose from "mongoose";

const nlpTasksScheme = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patternInsights: {
    message: { type: Object },
    date: { type: Date, default: Date.now() },
  },
  storiesData: {
    data: { type: Object },
    date: { type: Date, default: Date.now() },
  },
});

const NlpTasks = mongoose.model("NlpTasks", nlpTasksScheme);

export default NlpTasks;
