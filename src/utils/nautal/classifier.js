const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

module.exports = { tokenizer, classifier };
