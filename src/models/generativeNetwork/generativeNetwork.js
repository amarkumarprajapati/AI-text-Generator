const TextEncoder = require('../../utils/textEncoder');
const WeightsInitializer = require('../../utils/weightsInitializer');
const NetworkCore = require('../../utils/networkCore');

class GenerativeNetwork {
  constructor(inputSize = 20, hiddenSize = 10, outputSize = 20) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;

    this.textEncoder = new TextEncoder();
    this.weightsInitializer = new WeightsInitializer();

    // Initialize weights and biases
    this.weights1 = this.weightsInitializer.randomWeights(hiddenSize, inputSize);
    this.weights2 = this.weightsInitializer.randomWeights(outputSize, hiddenSize);
    this.bias1 = this.weightsInitializer.zeroVector(hiddenSize);
    this.bias2 = this.weightsInitializer.zeroVector(outputSize);

    this.core = new NetworkCore(inputSize, hiddenSize, outputSize, this.weights1, this.weights2, this.bias1, this.bias2);

    this.initializeWithDummyData();
  }

  initializeWithDummyData() {
    const dummyData = [
      { input: "hi there", output: "Hello there!" },
      { input: "how are you", output: "I'm good, thanks!" },
      { input: "good day", output: "Have a great day!" },
      { input: "what is your name", output: "My name is Grok!" }
    ];
    dummyData.forEach(({ input, output }) => {
      const numericalInput = this.padOrTruncate(this.textEncoder.textToNumbers(input));
      const numericalOutput = this.padOrTruncate(this.textEncoder.textToNumbers(output));
      this.core.train(numericalInput, numericalOutput, 0.2);
    });
  }

  padOrTruncate(array) {
    if (array.length > this.inputSize) return array.slice(0, this.inputSize);
    return array.concat(Array(this.inputSize - array.length).fill(0));
  }

  forward(input) {
    const numericalInput = this.padOrTruncate(this.textEncoder.textToNumbers(input));
    return this.core.forward(numericalInput, this.textEncoder);
  }

  train(input, target, learningRate = 0.05) {
    const numericalInput = this.padOrTruncate(this.textEncoder.textToNumbers(input));
    const numericalTarget = this.padOrTruncate(this.textEncoder.textToNumbers(target));
    this.core.train(numericalInput, numericalTarget, learningRate);
  }
}

module.exports = { GenerativeNetwork, TextEncoder };