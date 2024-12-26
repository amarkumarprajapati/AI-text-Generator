module.exports = (req, res, next) => {
    const { inputText } = req.body;
  
    if (!inputText) {
      return res.status(400).send({ error: "Input text is required" });
    }
  
    next();
  };
  