const { GenerativeNetwork } = require('../models/generativeNetwork/generativeNetwork');
const NetworkModel = require('../models/networkModel');

let net = new GenerativeNetwork();
net.initializeWithData(); // Pre-load training data

const initializeModel = async () => {
  await loadModel();
};

const loadModel = async () => {
  try {
    const savedNet = await NetworkModel.findOne();
    if (savedNet) {
      net.knowledgeBase = savedNet.knowledgeBase || {};
      console.log('Model loaded from DB');
    } else {
      console.log('No saved model found. Using pre-trained knowledge.');
    }
  } catch (error) {
    console.error('Error loading model:', error);
  }
};

const saveModel = async () => {
  try {
    await NetworkModel.findOneAndUpdate(
      {},
      { knowledgeBase: net.knowledgeBase },
      { upsert: true }
    );
    console.log('Model saved to DB');
  } catch (error) {
    console.error('Error saving model:', error);
  }
};

const processText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Input must be a string in the "text" field' });
    }

    let responseText = net.forward(text);
    
    if (!responseText || responseText.length < 5) {
      responseText = "I don't know yet, but I'll learn!";
      net.train(text, responseText);
    }

    await saveModel();
    res.status(200).json({ message: 'Processed successfully', text: responseText });
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
};

initializeModel();

module.exports = { processText };
