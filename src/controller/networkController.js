const { GenerativeNetwork } = require('../models/generativeNetwork/generativeNetwork');
const NetworkModel = require('../models/networkModel');
const textToNumbers = require('../utils/textEncoder')

let net = new GenerativeNetwork(20, 10, 20);
const questionMemory = new Map();

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
    const cleanArray = (arr) => arr.map(row => row.map(val => (isNaN(val) ? 0 : val)));
    const cleanVector = (arr) => arr.map(val => (isNaN(val) ? 0 : val));

    await NetworkModel.findOneAndUpdate(
      {},
      {
        weights1: cleanArray(net.weights1),
        weights2: cleanArray(net.weights2),
        bias1: cleanVector(net.bias1),
        bias2: cleanVector(net.bias2),
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
  let input = textToNumbers(str);
  if (input.length > inputSize) return input.slice(0, inputSize);
  return input.concat(Array(inputSize - input.length).fill(0));
};

const processText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Input must be a string in the "text" field' });
    }

    const numericalInput = stringToInput(text, net.inputSize);
    let responseText;

    const lowerText = text.toLowerCase().trim();
    if (lowerText === 'hii' || lowerText === 'hi there') {
      net.train(numericalInput, stringToInput('Hello there!', net.inputSize));
      responseText = 'Hello there!';
    } else if (lowerText === 'what is your name?' || lowerText === 'what is your name') {
      responseText = 'My name is Grok!';
      net.train(numericalInput, stringToInput(responseText, net.outputSize));
      questionMemory.set(text, responseText);
    } else if (questionMemory.has(text)) {
      responseText = questionMemory.get(text);
    } else {
      responseText = net.forward(numericalInput);
      if (text.trim().endsWith('?')) {
        // For unknown questions, provide a default response and train
        const defaultResponse = "I'm not sure, but I'll learn!";
        responseText = defaultResponse;
        questionMemory.set(text, responseText);
        net.train(numericalInput, stringToInput(responseText, net.outputSize));
      }
    }

    await saveModel(responseText);
    console.log('Processed output:', responseText);
    res.status(200).json({ message: 'Processed successfully', text: responseText });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
};

initializeModel();

module.exports = { processText };