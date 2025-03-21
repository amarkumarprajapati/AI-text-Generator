const axios = require("axios");
const cheerio = require("cheerio");

const fetchFromWeb = async (query) => {
  try {
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(
      query
    )}`;
    const response = await axios.get(searchUrl);

    if (!response.data) {
      return "I couldn't find an answer for that.";
    }

    const $ = cheerio.load(response.data);
    const results = [];

    $(".result__snippet").each((index, element) => {
      results.push($(element).text().trim());
    });

    if (results.length > 0) {
      return results[0];
    } else {
      return "I couldn't find an answer for that.";
    }
  } catch (error) {
    console.error("Error fetching from DuckDuckGo:", error);
    return "I'm having trouble retrieving information. Please try again later.";
  }
};

const refineAnswer = (answer) => {
  return `🤖 Here's what I found: ${answer}`;
};

module.exports = { fetchFromWeb, refineAnswer };
