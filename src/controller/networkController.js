const db = require("../models/networkModel");
const { fetchFromWeb } = require("../service/search");
const { thinkingModel, refineAnswer } = require("../service/thinkModel");

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

const getResponse = async (req, res) => {
  const { question } = req.body;
  if (!question) {
      return res.status(400).json({ error: "Question is required." });
  }

  const lowerCaseQuestion = question.trim().toLowerCase();

  try {
      // Check database first
      const existingData = await new Promise((resolve, reject) => {
          db.findOne({ question: lowerCaseQuestion }, (err, doc) => {
              if (err) reject(err);
              else resolve(doc);
          });
      });

      if (existingData) {
          return res.json({ answer: existingData.answer });
      }

      // Fetch and process new data
      const webData = await fetchFromWeb(lowerCaseQuestion);
      if (!webData || Object.values(webData).every((v) => v === null)) {
          return res.json({ answer: "Sorry, I couldn't find an answer to your question." });
      }

      const processedAnswer = thinkingModel(lowerCaseQuestion, webData);
      const finalAnswer = refineAnswer(processedAnswer);

      // Save to database
      await new Promise((resolve, reject) => {
          db.insert(
              { question: lowerCaseQuestion, answer: finalAnswer },
              (err, newDoc) => {
                  if (err) reject(err);
                  else resolve(newDoc);
              }
          );
      });

      return res.json({ answer: finalAnswer });
  } catch (error) {
      console.error("Error in getResponse:", error);
      return res.status(500).json({ error: "Something went wrong." });
  }
};


module.exports = { addTrainingData, getResponse };
