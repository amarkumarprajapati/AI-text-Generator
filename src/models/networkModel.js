const mongoose = require("mongoose");

const TrainingDataSchema = new mongoose.Schema({
  input: { type: String, required: true, unique: true },
  output: { type: String, required: true }
});

const TrainingData = mongoose.model("TrainingData", TrainingDataSchema);

module.exports = TrainingData;
