const dotenv = require("dotenv");

dotenv.config();

async function testGemini() {
    try {
        const { GoogleGenAI } = await import("@google/genai");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: "Generate one simple JavaScript interview question."
        });

        console.log("GEMINI RESPONSE:");
        console.log(response.text);

    } catch (error) {
        console.error("GEMINI ERROR:");
        console.error(error);
    }
}

testGemini();