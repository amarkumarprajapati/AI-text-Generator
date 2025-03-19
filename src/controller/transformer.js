const modelPromise = require("../models/XTransformer/xtransformers"); // Import the model loader

const xtransformater = {};

xtransformater.chatdata = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
        const model = await modelPromise; // Wait for the model to load
        const response = await model(prompt, { max_length: 100 });
        res.json({ text: response[0].generated_text });
    } catch (error) {
        console.error("Error generating text:", error);
        res.status(500).json({ error: "Error generating text" });
    }
};

module.exports = xtransformater;
