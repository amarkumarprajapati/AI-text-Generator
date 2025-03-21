const { GenerativeNetwork, textToNumbers } = require('../models/generativeNetwork/generativeNetwork');
const NetworkModel = require('../models/networkModel');

let net = new GenerativeNetwork(20, 10, 20); 

const initializeModel = async () => {
  await loadModel();
};

const loadModel = async () => {
  try {
    const savedNet = await NetworkModel.findOne();
    if (savedNet) {
      net.weights1 = savedNet.weights1;
      net.weights2 = savedNet.weights2;
      net.bias1 = savedNet.bias1;
      net.bias2 = savedNet.bias2;
      console.log('Model loaded from DB');
    } else {
      console.log('No saved model found. Using pre-trained instance.');
    }
  } catch (error) {
    console.error('Error loading model:', error);
  }
};

const saveModel = async (generatedText = '') => {
  try {
    await NetworkModel.findOneAndUpdate(
      {},
      {
        weights1: net.weights1,
        weights2: net.weights2,
        bias1: net.bias1,
        bias2: net.bias2,
        generatedText: generatedText,
      },
      { upsert: true }
    );
    console.log('Model saved to DB');
  } catch (error) {
    console.error('Error saving model:', error);
  }
};

const stringToInput = (str, inputSize) => {
  let input = textToNumbers(str); // Now accessible
  if (input.length > inputSize) return input.slice(0, inputSize);
  return input.concat(Array(inputSize - input.length).fill(0));
};

const trainNetwork = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Input must be a string' });
    }
    const numericalInput = stringToInput(input, net.inputSize);
    net.train(numericalInput, numericalInput);
    await saveModel();
    res.status(200).json({ message: 'Training completed and saved to DB' });
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).json({ error: 'Training failed' });
  }
};

const predict = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Input must be a string' });
    }
    const numericalInput = stringToInput(input, net.inputSize);
    const outputText = net.forward(numericalInput);
    await saveModel(outputText);
    console.log('Predicted output:', outputText);
    res.status(200).json({ text: outputText });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
};

initializeModel();

module.exports = { trainNetwork, predict };