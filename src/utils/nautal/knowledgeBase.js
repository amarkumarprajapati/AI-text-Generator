class KnowledgeBase {
    constructor() {
      this.data = {};
    }
  
    addEntry(input, output) {
      this.data[input.toLowerCase()] = output;
    }
  
    getResponse(input) {
      return this.data[input.toLowerCase()] || null;
    }
  }
  
  module.exports = new KnowledgeBase();
  