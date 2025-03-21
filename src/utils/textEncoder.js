const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ .,!?";

class TextEncoder {
  constructor() {
    this.characters = characters;
  }

  numbersToText(numbers) {
    return numbers
      .map(n => {
        const index = Math.floor(Math.max(0, Math.min(1, n)) * this.characters.length);
        return this.characters[index] || ' ';
      })
      .join('')
      .trim();
  }

  textToNumbers(text) {
    return text.split('').map(char => {
      const index = this.characters.indexOf(char);
      return index === -1 ? 0 : index / this.characters.length;
    });
  }
}

module.exports = TextEncoder;