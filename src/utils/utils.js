function sigmoid(x) {
    const cappedX = Math.max(-500, Math.min(500, x));
    return 1 / (1 + Math.exp(-cappedX));
  }
  
  function dotProduct(matrix, vector) {
    return matrix.map(row => row.reduce((sum, val, i) => sum + val * vector[i], 0));
  }
  
  module.exports = { sigmoid, dotProduct };