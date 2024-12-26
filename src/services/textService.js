const tf = require("@tensorflow/tfjs-node");
const path = require("path");

let model;

async function loadModel() {
  if (!model) {
    const modelPath = path.join(
      __dirname,
      "../../models/my-text-model/model.json"
    );
    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log("Model loaded successfully.");
  }
  return model;
}

exports.generateTextService = async (input) => {
  const model = await loadModel();
  const inputTensor = tf.tensor([
    input.split("").map((char) => char.charCodeAt(0)),
  ]);
  const prediction = model.predict(inputTensor);
  const outputArray = prediction.arraySync();
  const generatedText = outputArray
    .map((value) => String.fromCharCode(Math.round(value)))
    .join("");

  return generatedText;
};
