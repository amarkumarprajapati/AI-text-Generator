const Datastore = require("nedb");
const path = require("path");

// Create a NeDB database file
const db = new Datastore({
  filename: path.join(__dirname, "../../data/trainingData.db"), 
  autoload: true 
});

// Ensure indexing for faster search
db.ensureIndex({ fieldName: "question", unique: true }, (err) => {
  if (err) console.error("Indexing Error:", err);
});

module.exports = db;
