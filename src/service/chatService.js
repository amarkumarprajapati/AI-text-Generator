const axios = require("axios");
const cheerio = require("cheerio");

const fetchFromDuckDuckGo = async (query) => {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return $(".result__snippet").first().text().trim() || null;
  } catch (error) {
    console.error("DuckDuckGo Error:", error);
    return null;
  }
};


const fetchFromWikipedia = async (query) => {
  try {
    const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/ /g, "_"))}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return $("p").first().text().trim() || null;
  } catch (error) {
    console.error("Wikipedia Error:", error);
    return null;
  }
};


const fetchFromStackOverflow = async (query) => {
  try {
    const searchUrl = `https://stackoverflow.com/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl);
    const $ = cheerio.load(response.data);
    return $(".s-post-summary--content-excerpt").first().text().trim() || null;
  } catch (error) {
    console.error("Stack Overflow Error:", error);
    return null;
  }
};


const fetchFromWeb = async (query) => {
  try {
    const [duckDuckGo, wikipedia, stackOverflow] = await Promise.all([
      fetchFromDuckDuckGo(query),
      fetchFromWikipedia(query),
      fetchFromStackOverflow(query),
    ]);

    return wikipedia || stackOverflow || duckDuckGo || "I couldn't find an answer for that.";
  } catch (error) {
    console.error("Error fetching from web:", error);
    return "I'm having trouble retrieving information.";
  }
};


const refineAnswer = (answer) => {
  const prefixes = [
    "🤖 Here's what I found:",
    "💡 Based on my research:",
    "📚 According to multiple sources:",
    "✅ This is what I learned:",
  ];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]}\n\n${answer}`;
};

module.exports = { fetchFromWeb, refineAnswer };
