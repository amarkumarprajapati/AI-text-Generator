const { sigmoid, dotProduct } = require('./utils');

class NetworkCore {
  constructor(inputSize, hiddenSize, outputSize, weights1, weights2, bias1, bias2) {
    this.inputSize = inputSize;
    this.hiddenSize = hiddenSize;
    this.outputSize = outputSize;
    this.weights1 = weights1;
    this.weights2 = weights2;
    this.bias1 = bias1;
    this.bias2 = bias2;
  }

  forward(input, textEncoder) {
    const hidden = dotProduct(this.weights1, input).map((v, i) => sigmoid(v + this.bias1[i]));
    const output = dotProduct(this.weights2, hidden).map((v, i) => sigmoid(v + this.bias2[i]));
    return textEncoder.numbersToText(output);
  }

  train(input, target, learningRate = 0.05) {
    const hidden = dotProduct(this.weights1, input).map((v, i) => sigmoid(v + this.bias1[i]));
    const output = dotProduct(this.weights2, hidden).map((v, i) => sigmoid(v + this.bias2[i]));

    const outputErrors = output.map((o, i) => target[i] - o);
    const outputDelta = outputErrors.map((e, i) => e * output[i] * (1 - output[i]));

    const hiddenErrors = dotProduct(this.weights2.map(row => row.slice()), outputDelta);
    const hiddenDelta = hiddenErrors.map((e, i) => e * hidden[i] * (1 - hidden[i]));

    for (let i = 0; i < this.outputSize; i++) {
      for (let j = 0; j < this.hiddenSize; j++) {
        const delta = learningRate * outputDelta[i] * hidden[j];
        this.weights2[i][j] = isNaN(this.weights2[i][j] + delta) ? this.weights2[i][j] : this.weights2[i][j] + delta;
      }
      const biasDelta = learningRate * outputDelta[i];
      this.bias2[i] = isNaN(this.bias2[i] + biasDelta) ? this.bias2[i] : this.bias2[i] + biasDelta;
    }

    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.inputSize; j++) {
        const delta = learningRate * hiddenDelta[i] * input[j];
        this.weights1[i][j] = isNaN(this.weights1[i][j] + delta) ? this.weights1[i][j] : this.weights1[i][j] + delta;
      }
      const biasDelta = learningRate * hiddenDelta[i];
      this.bias1[i] = isNaN(this.bias1[i] + biasDelta) ? this.bias1[i] : this.bias1[i] + biasDelta;
    }
  }
}

module.exports = NetworkCore;