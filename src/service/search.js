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

const fetchFromReddit = async (query) => {
    try {
        const url = `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        const $ = cheerio.load(response.data);
        const snippet = $("div[class*='search-result']").first().text().trim();
        return snippet ? snippet.slice(0, 200) : null;
    } catch (error) {
        console.error("Reddit Error:", error);
        return null;
    }
};

const fetchFromGitHub = async (query) => {
    try {
        const url = `https://github.com/search?q=${encodeURIComponent(query)}&type=repositories`;
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const description = $(".repo-list-item").first().find("p").text().trim();
        return description || null;
    } catch (error) {
        console.error("GitHub Error:", error);
        return null;
    }
};

const fetchFromGoogle = async (query) => {
    try {
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" } });
        const $ = cheerio.load(response.data);
        const snippet = $("div[class*='BNeawe']").first().text().trim();
        return snippet || null;
    } catch (error) {
        console.error("Google Error:", error);
        return null;
    }
};

const fetchFromWeb = async (query) => {
    try {
        const [duckDuckGo, wikipedia, stackOverflow, reddit, github, google] = await Promise.all([
            fetchFromDuckDuckGo(query),
            fetchFromWikipedia(query),
            fetchFromStackOverflow(query),
            fetchFromReddit(query),
            fetchFromGitHub(query),
            fetchFromGoogle(query),
        ]);

        return {
            duckDuckGo,
            wikipedia,
            stackOverflow,
            reddit,
            github,
            google,
        };
    } catch (error) {
        console.error("Error fetching from web:", error);
        return null;
    }
};

module.exports = { fetchFromWeb };