const { classifier } = require("../../utils/nautal/classifier");
const knowledgeBase = require("../../utils/nautal/knowledgeBase");
const trainer = require("../../utils/nautal/trainer");

class GenerativeNetwork {
  constructor() {
    this.trainer = trainer;
  }

  initializeWithData() {
    this.trainer.addTrainingData("what is react", "React is a JavaScript library for building UIs.");
    this.trainer.addTrainingData("how does react work", "React works by using a virtual DOM.");
    this.trainer.addTrainingData("what is vue", "Vue.js is a progressive JavaScript framework.");
    this.trainer.addTrainingData("how does vue work", "Vue uses a reactive data system and virtual DOM.");
    this.trainer.addTrainingData("what is angular", "Angular is a TypeScript-based web framework.");

    this.trainer.train();
  }

  forward(input) {
    const response = knowledgeBase.getResponse(input);

    if (response) {
      return response;
    }

    try {
      return classifier.classify(input.toLowerCase());
    } catch (error) {
      return "I'm not sure yet, but I'll learn!";
    }
  }
}

module.exports = { GenerativeNetwork };
