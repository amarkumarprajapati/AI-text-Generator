const { generateTextService } = require("../services/textService");

exports.generateText = async (req, res, next) => {
  const { inputText } = req.body;

  try {
    const generatedText = await generateTextService(inputText);
    res.send({ inputText, generatedText });
  } catch (error) {
    next(error); 
  }
};
