const mongoose = require('mongoose');

const networkSchema = new mongoose.Schema({
  weights1: { type: [[Number]], required: true },
  weights2: { type: [[Number]], required: true },
  bias1: { type: [Number], required: true },
  bias2: { type: [Number], required: true },
  generatedText: { type: String, default: '' } 
});

const NetworkModel = mongoose.model('GenerativeNetwork', networkSchema);

module.exports = NetworkModel;
