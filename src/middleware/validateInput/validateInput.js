function validateInput(req, res, next) {
  const { input } = req.body;
  if (typeof input !== 'string' || input.trim() === '') {
    return res.status(400).json({ error: 'Input must be a non-empty string' });
  }
  next();
}

module.exports = validateInput;