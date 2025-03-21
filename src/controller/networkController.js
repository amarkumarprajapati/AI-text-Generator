const TextData = require("../models/networkModel");
const { fetchFromWeb, refineAnswer } = require("../service/chatService");

const getResponse = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    let data = await TextData.findOne({ question: question.toLowerCase() });

    if (data) {
      return res.json({ answer: data.answer });
    }

    const webData = await fetchFromWeb(question);
    const refinedAnswer = refineAnswer(webData);

    const newTextData = new TextData({
      question: question.toLowerCase(),
      answer: refinedAnswer,
    });
    await newTextData.save();

    return res.json({ answer: refinedAnswer });
  } catch (error) {
    console.error("Error fetching response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addTrainingData = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res
        .status(400)
        .json({ error: "Both question and answer are required" });
    }

    const existingData = await TextData.findOne({
      question: question.toLowerCase(),
    });
    if (existingData) {
      return res
        .status(400)
        .json({ error: "This question already exists in the database." });
    }

    const newTextData = new TextData({
      question: question.toLowerCase(),
      answer,
    });
    await newTextData.save();

    res.json({ message: "Training data added successfully!" });
  } catch (error) {
    console.error("Error adding training data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getResponse, addTrainingData };
