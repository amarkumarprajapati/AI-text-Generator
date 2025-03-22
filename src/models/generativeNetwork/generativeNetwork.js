const db = require("./networkModel");

class GenerativeNetwork {
  forward(input) {
    return new Promise((resolve) => {
      db.findOne({ question: input.toLowerCase() }, (err, existingData) => {
        if (existingData) {
          resolve(existingData.answer);
        } else {
          resolve("I'm not sure yet, but I'll learn!");
        }
      });
    });
  }
}

module.exports = { GenerativeNetwork };
