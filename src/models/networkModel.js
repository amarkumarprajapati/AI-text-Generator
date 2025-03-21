const mongoose = require('mongoose');

const networkSchema = new mongoose.Schema({
  weights1: [[Number]],
  weights2: [[Number]],
  bias1: [Number],
  bias2: [Number],
  generatedText: String,
});

module.exports = mongoose.model('Network', networkSchema);