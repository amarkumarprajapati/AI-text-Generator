const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,!?"; 

function numbersToText(numbers) {
  return numbers.map(n => characters[Math.floor(n * characters.length)] || ' ').join('').trim();
}

function textToNumbers(text) {
  return text.split('').map(char => {
    const index = characters.indexOf(char);
    return index === -1 ? 0 : index / characters.length;
  });
}

function randomWeights(rows, cols) {
  return Array(rows).fill().map(() => Array(cols).fill().map(() => Math.random() * 2 - 1));
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function dotProduct(matrix, vector) {
  return matrix.map(row => row.reduce((sum, val, i) => sum + val * vector[i], 0));
}

class GenerativeNetwork {
  constructor(inputSize = 20, hiddenSize = 10, outputSize = 20) {
    this.inputSize = inputSize;    // Max input length
    this.hiddenSize = hiddenSize;  // Smaller hidden layer
    this.outputSize = outputSize;  // Max output length (e.g., 20 chars)

    this.weights1 = randomWeights(hiddenSize, inputSize);
    this.weights2 = randomWeights(outputSize, hiddenSize);
    this.bias1 = Array(hiddenSize).fill(0);
    this.bias2 = Array(outputSize).fill(0);

    this.initializeWithDummyData();
  }

  initializeWithDummyData() {
    const dummyData = [
      "hi there",
      "how are you",
      "good day",
      "nice to see"
    ];
    dummyData.forEach(text => {
      const input = this.padOrTruncate(textToNumbers(text));
      this.train(input, input, 0.2); // Pre-train with a reasonable learning rate
    });
  }

  padOrTruncate(array) {
    if (array.length > this.inputSize) return array.slice(0, this.inputSize);
    return array.concat(Array(this.inputSize - array.length).fill(0));
  }

  forward(input) {
    const hidden = dotProduct(this.weights1, input).map((v, i) => sigmoid(v + this.bias1[i]));
    const output = dotProduct(this.weights2, hidden).map((v, i) => sigmoid(v + this.bias2[i]));
    return numbersToText(output);
  }

  train(input, target, learningRate = 0.1) {
    const hidden = dotProduct(this.weights1, input).map((v, i) => sigmoid(v + this.bias1[i]));
    const output = dotProduct(this.weights2, hidden).map((v, i) => sigmoid(v + this.bias2[i]));

    const outputErrors = output.map((o, i) => target[i] - o);
    const outputDelta = outputErrors.map((e, i) => e * output[i] * (1 - output[i]));

    const hiddenErrors = dotProduct(this.weights2.map(row => row.slice()), outputDelta);
    const hiddenDelta = hiddenErrors.map((e, i) => e * hidden[i] * (1 - hidden[i]));

    for (let i = 0; i < this.outputSize; i++) {
      for (let j = 0; j < this.hiddenSize; j++) {
        this.weights2[i][j] += learningRate * outputDelta[i] * hidden[j];
      }
      this.bias2[i] += learningRate * outputDelta[i];
    }

    for (let i = 0; i < this.hiddenSize; i++) {
      for (let j = 0; j < this.inputSize; j++) {
        this.weights1[i][j] += learningRate * hiddenDelta[i] * input[j];
      }
      this.bias1[i] += learningRate * hiddenDelta[i];
    }
  }
}

module.exports = { GenerativeNetwork, textToNumbers }; // Export both