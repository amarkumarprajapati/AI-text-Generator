class WeightsInitializer {
    randomWeights(rows, cols) {
      return Array(rows).fill().map(() =>
        Array(cols).fill().map(() => Math.random() * 0.1 - 0.05)
      );
    }
  
    zeroVector(size) {
      return Array(size).fill(0);
    }
  }
  
  module.exports = WeightsInitializer;