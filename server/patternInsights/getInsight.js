import NlpTasks from "../models/nlptasks.js";
import { generatePatternInsight } from "./generatePatternInsight.js";
import moment from "moment";

export async function getInsight(userId) {
  let nlpTasks = await NlpTasks.findOne({ user: userId });
  let lastCreated = moment("2005-11-30");

  if (!nlpTasks) {
    nlpTasks = new NlpTasks({ user: userId });
  } else if (nlpTasks.patternInsights?.date) {
    lastCreated = moment(nlpTasks.patternInsights.date);
  }

  if (!lastCreated.isSame(moment(), "day")) {
    const patternInsights = await generatePatternInsight(userId);
    nlpTasks.patternInsights = {
      message: patternInsights,
      date: moment().toDate(),
    };

    await nlpTasks.save();
  }

  return nlpTasks.patternInsights.message;
}
