const db = require("../models/networkModel");
const { fetchFromWeb, refineAnswer } = require("../service/chatService");

const addTrainingData = (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res
      .status(400)
      .json({ error: "Both question and answer are required." });
  }

  const lowerCaseQuestion = question.trim().toLowerCase();

  db.insert({ question: lowerCaseQuestion, answer }, (err, newDoc) => {
    if (err) {
      return res.status(400).json({ error: "This question already exists." });
    }
    res.json({ message: "Training data added successfully!" });
  });
};

const getResponse = (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Question is required." });
  }

  const lowerCaseQuestion = question.trim().toLowerCase();

  db.findOne({ question: lowerCaseQuestion }, async (err, existingData) => {
    if (existingData) {
      return res.json({ answer: existingData.answer });
    }

    const webData = await fetchFromWeb(question);
    const refinedAnswer = refineAnswer(webData);

    db.insert({ question: lowerCaseQuestion, answer: refinedAnswer });

    return res.json({ answer: refinedAnswer });
  });
};

module.exports = { addTrainingData, getResponse };
