const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chat(message) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(message);
        const response = result.response.text();

        return response;
    } catch (error) {
        console.error("Error in Gemini chat:", error);
        return "Failed to get a response from Gemini AI.";
    }
}

module.exports = { chat };
