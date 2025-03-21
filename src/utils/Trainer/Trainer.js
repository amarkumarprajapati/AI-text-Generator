class Trainer {
    constructor(networkCore) {
      this.core = networkCore;
    }
  
    trainBatch(inputs, targets, learningRate, epochs) {
      for (let epoch = 0; epoch < epochs; epoch++) {
        inputs.forEach((input, i) => this.core.train(input, targets[i], learningRate));
      }
    }
  }
  
  module.exports = Trainer;