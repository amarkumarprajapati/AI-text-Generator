const { classifier } = require("./classifier");
const TrainingData = require("../../models/networkModel");

class Trainer {
  constructor() {
    this.trainingData = [];
  }

  async loadFromDatabase() {
    const data = await TrainingData.find();
    data.forEach(({ input, output }) => {
      classifier.addDocument(input.toLowerCase(), output);
    });
    classifier.train();
    console.log("Training data loaded from MongoDB.");
  }

  async addTrainingData(input, output) {
    try {
      const exists = await TrainingData.findOne({ input: input.toLowerCase() });
      if (!exists) {
        await TrainingData.create({ input: input.toLowerCase(), output });
        classifier.addDocument(input.toLowerCase(), output);
        console.log(`Added: ${input} → ${output}`);
      }
    } catch (err) {
      console.error("Error saving training data:", err);
    }
  }

  train() {
    classifier.train();
  }
}

module.exports = new Trainer();
