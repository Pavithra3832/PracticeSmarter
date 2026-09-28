const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function testAI() {

    try {

        const response = await openai.responses.create({
            model: "gpt-5",
            input: "Generate one simple JavaScript interview question."
        });

        console.log("AI RESPONSE:");
        console.log(response.output_text);

    } catch (error) {

        console.error("AI ERROR:");
        console.error(error);

    }

}

testAI();