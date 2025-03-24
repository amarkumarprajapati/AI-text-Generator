const thinkingModel = (query, webResults) => {
    if (!webResults || Object.values(webResults).every((v) => v === null)) {
        return "I couldn't find enough reliable information to provide a detailed answer.";
    }

    let answer = "";
    let hasContent = false;

    // Combine all available data into a cohesive narrative
    const allData = [
        webResults.wikipedia,
        webResults.stackOverflow,
        webResults.reddit,
        webResults.github,
        webResults.google,
        webResults.duckDuckGo,
    ].filter(Boolean); // Filter out null values

    if (allData.length > 0) {
        // Synthesize the data into a single thoughtful response
        answer = allData
            .map((snippet) => snippet.trim())
            .join(" ")
            .replace(/\s+/g, " ") // Normalize whitespace
            .slice(0, 1000); // Limit length for readability

        // Add a thoughtful summary based on the query
        answer += `\n\nTo sum it up, "${query}" seems to cover a lot of ground, offering a mix of practical insights and broader context. ${
            allData.length > 2
                ? "It’s a topic with plenty of depth and varied angles."
                : "There’s some info out there, though it’s a bit more focused."
        }`;
        hasContent = true;
    }

    return hasContent ? answer : "I couldn’t piece together a clear answer from what I found.";
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

module.exports = { thinkingModel, refineAnswer };