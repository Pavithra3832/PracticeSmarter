const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("SERVER FILE STARTED");

// ======================================================
// GD FALLBACK SYSTEM
// Used when Gemini quota / temporary service errors occur
// ======================================================

function getGDFallbackResponse(topic, userMessage) {

    const message =
        String(userMessage || "").toLowerCase();

    if (
        message.includes("teamwork") &&
        message.includes("individual")
    ) {
        return "I agree with that point. Teamwork helps people combine different skills, while individual responsibility ensures that every member contributes effectively to the team's success.";
    }

    if (
        message.includes("team")
    ) {
        return "I agree that teamwork is important because people can combine different skills and ideas. At the same time, each member should take responsibility for their own contribution.";
    }

    if (
        message.includes("individual")
    ) {
        return "Individual performance is also important because every person has unique skills and responsibilities. Strong individual contributions can help the entire team achieve better results.";
    }

    if (
        message.includes("important")
    ) {
        return "That is a relevant point. I think the best approach is to consider different perspectives and find a balance that supports the overall objective.";
    }

    const fallbackResponses = [

        "I agree with that perspective. Another important point is that effective participation and cooperation can help achieve better results.",

        "That is a useful point. I would also consider how different skills and viewpoints can contribute to achieving the common goal.",

        "I understand your point. In my opinion, the situation can be improved when people take responsibility while also supporting others.",

        "I agree to some extent. Another perspective is that success depends on both individual contribution and effective coordination with others."

    ];

    const index =
        Math.floor(
            Math.random() *
            fallbackResponses.length
        );

    return fallbackResponses[index];
}


function getGDFallbackEvaluation({
    participantName,
    topic,
    meaningfulMessageCount,
    totalParticipantMessages,
    totalWords
}) {

    // ------------------------------------------
    // VERY LOW ACTIVITY
    // ------------------------------------------

    if (
        meaningfulMessageCount === 0
    ) {

        return {

            overallScore: 1,

            communicationScore:
                totalWords > 0 ? 1 : 0,

            relevanceScore: 0,

            contentScore: 0,

            participationScore:
                totalParticipantMessages > 0
                    ? 1
                    : 0,

            reasoningScore: 0,

            totalScore: 2,

            feedback:
                `${participantName || "The participant"} made very limited meaningful contributions. More topic-related ideas, explanations and examples are needed.`,

            strengths: [],

            improvements: [

                "Share complete and meaningful ideas.",

                "Stay focused on the discussion topic.",

                "Explain opinions with reasons or examples.",

                "Respond meaningfully to other participants."

            ]

        };

    }

    // ------------------------------------------
    // BASIC RULE-BASED FALLBACK SCORING
    // ------------------------------------------

    let communicationScore = 4;
    let relevanceScore = 4;
    let contentScore = 4;
    let participationScore = 4;
    let reasoningScore = 3;


    if (
        meaningfulMessageCount >= 2
    ) {

        participationScore = 6;

    }

    if (
        meaningfulMessageCount >= 3
    ) {

        participationScore = 7;

    }

    if (
        totalWords >= 40
    ) {

        communicationScore = 5;
        contentScore = 5;

    }

    if (
        totalWords >= 80
    ) {

        communicationScore = 6;
        contentScore = 6;

    }

    if (
        totalWords >= 120
    ) {

        communicationScore = 7;
        contentScore = 7;

    }

    if (
        meaningfulMessageCount >= 2 &&
        totalWords >= 60
    ) {

        reasoningScore = 5;

    }

    if (
        meaningfulMessageCount >= 3 &&
        totalWords >= 100
    ) {

        reasoningScore = 6;

        relevanceScore = 6;

    }


    const totalScore =
        communicationScore +
        relevanceScore +
        contentScore +
        participationScore +
        reasoningScore;


    const overallScore =
        Math.round(
            (totalScore / 5) * 10
        ) / 10;


    return {

        overallScore,

        communicationScore,

        relevanceScore,

        contentScore,

        participationScore,

        reasoningScore,

        totalScore,

        feedback:
            `${participantName || "The participant"} made meaningful contributions during the discussion. The evaluation is based on communication, relevance, content, participation and reasoning.`,

        strengths: [

            "Participated in the discussion with meaningful responses.",

            "Shared topic-related ideas.",

            "Attempted to contribute to the discussion."

        ],

        improvements: [

            "Provide more detailed explanations.",

            "Support opinions with relevant examples.",

            "Respond to different viewpoints with stronger reasoning."

        ]

    };

}

function buildGDFallbackEvaluation(body) {

    const {
        topic,
        conversation = [],
        participantName,
        participantUid
    } = body || {};

    const normalizeText = (text) =>
        String(text || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");

    const trivialPatterns = [
        /^hi+$/,
        /^hello+$/,
        /^hey+$/,
        /^hii+$/,
        /^hiii+$/,
        /^helo+$/,
        /^ok+$/,
        /^okay+$/,
        /^yes+$/,
        /^no+$/,
        /^sure+$/,
        /^same+$/,
        /^thanks+$/,
        /^thank you+$/,
        /^thankyou+$/,
        /^i agree+$/,
        /^agree+$/,
        /^i disagree+$/,
        /^disagree+$/
    ];

    const isTrivialMessage = (text) => {

        const normalized = normalizeText(text);

        return trivialPatterns.some(
            pattern => pattern.test(normalized)
        );

    };

    const participantMessages =
        conversation.filter(
            message =>
                message.uid === participantUid &&
                message.type === "user"
        );

    const identifiedMessages =
        participantMessages.length > 0
            ? participantMessages
            : conversation.filter(
                message =>
                    message.sender === participantName &&
                    message.type === "user"
            );

    const meaningfulMessages =
        identifiedMessages.filter(message => {

            const text =
                normalizeText(message.text);

            if (!text) return false;

            if (isTrivialMessage(text)) {
                return false;
            }

            if (text.split(/\s+/).length < 4) {
                return false;
            }

            return true;

        });

    const totalParticipantMessages =
        identifiedMessages.length;

    const meaningfulMessageCount =
        meaningfulMessages.length;

    const totalWords =
        identifiedMessages.reduce(
            (total, message) => {

                return (
                    total +
                    normalizeText(message.text)
                        .split(/\s+/)
                        .filter(Boolean)
                        .length
                );

            },
            0
        );

    return getGDFallbackEvaluation({
        participantName,
        topic,
        meaningfulMessageCount,
        totalParticipantMessages,
        totalWords
    });

}


// ======================================================
// HOME ROUTE
// ======================================================

// ======================================================
// SERVE FRONTEND
// ======================================================

app.use(
    express.static(
        path.join(__dirname, "FrontEnd")
    )
);

app.get("/", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "FrontEnd",
            "index.html"
        )
    );
});


// ======================================================
// GENERATE 30 AI INTERVIEW QUESTIONS
// ======================================================

app.post("/api/generate-question", async (req, res) => {

    try {

        const { topic } = req.body;

        // ------------------------------------------------
        // CHECK INPUT
        // ------------------------------------------------

        if (!topic) {

            return res.status(400).json({
                success: false,
                error: "Topic is required"
            });

        }

        console.log("AI Request:", topic);


        // ------------------------------------------------
        // IMPORT GEMINI SDK
        // ------------------------------------------------

        const { GoogleGenAI } =
            await import("@google/genai");


        // ------------------------------------------------
        // CREATE GEMINI CLIENT
        // ------------------------------------------------

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });


        // ------------------------------------------------
        // JSON SCHEMA
        // ------------------------------------------------
        //
        // Gemini is instructed to return structured JSON.
        // This reduces invalid JSON / wrong format problems.
        // ------------------------------------------------

        const questionSchema = {

            type: "object",

            properties: {

                questions: {

                    type: "array",

                    items: {

                        type: "object",

                        properties: {

                            question: {
                                type: "string"
                            },

                            difficulty: {
                                type: "string",
                                enum: [
                                    "Easy",
                                    "Medium",
                                    "Hard"
                                ]
                            },

                            answer: {
                                type: "string"
                            }

                        },

                        required: [
                            "question",
                            "difficulty",
                            "answer"
                        ]

                    }

                }

            },

            required: [
                "questions"
            ]

        };


        // ------------------------------------------------
        // GEMINI REQUEST
        // ------------------------------------------------

        let response = null;

        let attempts = 0;

        const maxAttempts = 3;


        while (
            attempts < maxAttempts &&
            !response
        ) {

            attempts++;

            try {

                console.log(
                    `🤖 Gemini generation attempt ${attempts}/${maxAttempts}`
                );


                response =
                    await ai.models.generateContent({

                        model: "gemini-3.8-flash",
                      contents: `

Generate exactly 30 technical interview questions
for the topic: ${topic}.

Difficulty distribution:

- Exactly 10 Easy questions
- Exactly 10 Medium questions
- Exactly 10 Hard questions

Every question must contain:

1. question
2. difficulty
3. answer

Difficulty values MUST be exactly:

Easy
Medium
Hard

The questions should be suitable for a technical
interview and should not repeat.

Model answers must be technically correct,
clear and reasonably concise.

Return exactly 30 question objects.

`,

                        config: {

                            responseMimeType:
                                "application/json",

                            responseSchema:
                                questionSchema,

                            temperature: 0.4,

                            maxOutputTokens: 12000

                        }

                    });


                console.log(
                    "GEMINI RESPONSE RECEIVED"
                );


            } catch (error) {

                console.log(
                    `Gemini attempt ${attempts} failed:`,
                    error.status ||
                    error.message
                );


                // ----------------------------------------
                // TEMPORARY GEMINI SERVER ERROR
                // ----------------------------------------

                if (
                    error.status === 503 &&
                    attempts < maxAttempts
                ) {

                    console.log(
                        "Gemini is busy. Retrying in 3 seconds..."
                    );

                    await new Promise(resolve =>
                        setTimeout(resolve, 3000)
                    );

                } else {

                    throw error;

                }

            }

        }


        // ------------------------------------------------
        // CHECK RESPONSE
        // ------------------------------------------------

        if (
            !response ||
            !response.text
        ) {

            throw new Error(
                "Empty response from Gemini"
            );

        }


        const aiText =
            response.text.trim();


        console.log(
            "Raw structured response received."
        );


        // ------------------------------------------------
        // PARSE JSON
        // ------------------------------------------------

        let parsedData;

        try {

            parsedData =
                JSON.parse(aiText);

        } catch (error) {

            console.error(
                "JSON PARSE ERROR:",
                error
            );

            console.error(
                "RAW GEMINI RESPONSE:",
                aiText
            );

            throw new Error(
                "Gemini returned invalid JSON"
            );

        }


        // ------------------------------------------------
        // CHECK QUESTIONS ARRAY
        // ------------------------------------------------

        if (
            !parsedData.questions ||
            !Array.isArray(
                parsedData.questions
            )
        ) {

            throw new Error(
                "Gemini did not return a valid questions array"
            );

        }


        // ------------------------------------------------
        // CHECK QUESTION COUNT
        // ------------------------------------------------

        if (
            parsedData.questions.length !== 30
        ) {

            throw new Error(
                `Expected 30 questions but received ${parsedData.questions.length}`
            );

        }


        // ------------------------------------------------
        // NORMALIZE QUESTIONS
        // ------------------------------------------------

        const normalizedQuestions =
            parsedData.questions.map(
                (item, index) => {

                    return {

                        question:
                            String(
                                item.question || ""
                            ).trim(),

                        difficulty:
                            String(
                                item.difficulty || ""
                            ).trim(),

                        answer:
                            String(
                                item.answer || ""
                            ).trim()

                    };

                }
            );


        // ------------------------------------------------
        // CHECK BASIC QUESTION DATA
        // ------------------------------------------------

        const basicValidation =
            normalizedQuestions.every(
                item => {

                    return (
                        item.question.length > 0 &&
                        item.answer.length > 0 &&
                        [
                            "Easy",
                            "Medium",
                            "Hard"
                        ].includes(
                            item.difficulty
                        )
                    );

                }
            );


        if (!basicValidation) {

            throw new Error(
                "Gemini returned incomplete or invalid question data"
            );

        }


        // ------------------------------------------------
        // COUNT DIFFICULTIES
        // ------------------------------------------------

        const easyQuestions =
            normalizedQuestions.filter(
                q =>
                    q.difficulty === "Easy"
            );

        const mediumQuestions =
            normalizedQuestions.filter(
                q =>
                    q.difficulty === "Medium"
            );

        const hardQuestions =
            normalizedQuestions.filter(
                q =>
                    q.difficulty === "Hard"
            );


        console.log(
            "Difficulty distribution BEFORE normalization:"
        );

        console.log(
            "Easy:",
            easyQuestions.length
        );

        console.log(
            "Medium:",
            mediumQuestions.length
        );

        console.log(
            "Hard:",
            hardQuestions.length
        );


        // ------------------------------------------------
        // REBUILD EXACT 10 / 10 / 10 ORDER
        // ------------------------------------------------
        //
        // This is important.
        //
        // Even if Gemini returns the correct 30 questions
        // in a different order, we arrange them as:
        //
        // 1-10  Easy
        // 11-20 Medium
        // 21-30 Hard
        //
        // ------------------------------------------------

        if (
            easyQuestions.length < 10 ||
            mediumQuestions.length < 10 ||
            hardQuestions.length < 10
        ) {

            throw new Error(
                "Gemini did not generate at least 10 questions for each difficulty"
            );

        }


        const finalQuestions = [

            ...easyQuestions.slice(0, 10),

            ...mediumQuestions.slice(0, 10),

            ...hardQuestions.slice(0, 10)

        ];


        // ------------------------------------------------
        // FINAL COUNT CHECK
        // ------------------------------------------------

        if (
            finalQuestions.length !== 30
        ) {

            throw new Error(
                "Unable to create exactly 30 valid AI questions"
            );

        }


        // ------------------------------------------------
        // FINAL DISTRIBUTION CHECK
        // ------------------------------------------------

        const finalEasyCount =
            finalQuestions.filter(
                q =>
                    q.difficulty === "Easy"
            ).length;

        const finalMediumCount =
            finalQuestions.filter(
                q =>
                    q.difficulty === "Medium"
            ).length;

        const finalHardCount =
            finalQuestions.filter(
                q =>
                    q.difficulty === "Hard"
            ).length;


        if (
            finalEasyCount !== 10 ||
            finalMediumCount !== 10 ||
            finalHardCount !== 10
        ) {

            throw new Error(
                "Final AI difficulty distribution is invalid"
            );

        }


        // ------------------------------------------------
        // SUCCESS LOG
        // ------------------------------------------------

        console.log(
            "======================================"
        );

        console.log(
            "✅ AI QUESTIONS GENERATED SUCCESSFULLY"
        );

        console.log(
            "Topic:",
            topic
        );

        console.log(
            "Total:",
            finalQuestions.length
        );

        console.log(
            "Easy:",
            finalEasyCount
        );

        console.log(
            "Medium:",
            finalMediumCount
        );

        console.log(
            "Hard:",
            finalHardCount
        );

        console.log(
            "======================================"
        );


        // ------------------------------------------------
        // SEND TO FRONTEND
        // ------------------------------------------------

        return res.json({

            success: true,

            topic: topic,

            questions: finalQuestions

        });


    } catch (error) {

        console.error(
            "AI Error:",
            error
        );


        // ------------------------------------------------
        // QUOTA ERROR
        // ------------------------------------------------

        if (
            error.status === 429
        ) {

            return res.status(429).json({

                success: false,

                error:
                    "Gemini API quota exceeded. Please try again later."

            });

        }


        // ------------------------------------------------
        // SERVICE UNAVAILABLE
        // ------------------------------------------------

        if (
            error.status === 503
        ) {

            return res.status(503).json({

                success: false,

                error:
                    "Gemini AI is temporarily busy. Please try again in a moment."

            });

        }


        // ------------------------------------------------
        // GENERAL ERROR
        // ------------------------------------------------

        return res.status(500).json({

            success: false,

            error:
                error.message ||
                "Failed to generate AI interview questions"

        });

    }

});


// ======================================================
// AI ANSWER EVALUATION
// ======================================================

app.post("/api/evaluate-answer", async (req, res) => {

    try {

        const {
            question,
            modelAnswer,
            userAnswer,
            category,
            difficulty
        } = req.body;


        // ------------------------------------------------
        // CHECK INPUT
        // ------------------------------------------------

        if (
            !question ||
            !modelAnswer ||
            !userAnswer
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Question, model answer and user answer are required"

            });

        }


        console.log(
            "AI Answer Evaluation:",
            category,
            difficulty
        );


        // ------------------------------------------------
        // IMPORT GEMINI
        // ------------------------------------------------

        const { GoogleGenAI } =
            await import("@google/genai");


        // ------------------------------------------------
        // CREATE CLIENT
        // ------------------------------------------------

        const ai =
            new GoogleGenAI({

                apiKey:
                    process.env.GEMINI_API_KEY

            });


        // ------------------------------------------------
        // EVALUATION SCHEMA
        // ------------------------------------------------

        const evaluationSchema = {

            type: "object",

            properties: {

                technicalScore: {
                    type: "number"
                },

                communicationScore: {
                    type: "number"
                },

                confidenceScore: {
                    type: "number"
                },

                overallScore: {
                    type: "number"
                },

                feedback: {
                    type: "string"
                },

                strengths: {

                    type: "array",

                    items: {
                        type: "string"
                    }

                },

                improvements: {

                    type: "array",

                    items: {
                        type: "string"
                    }

                }

            },

            required: [

                "technicalScore",

                "communicationScore",

                "confidenceScore",

                "overallScore",

                "feedback",

                "strengths",

                "improvements"

            ]

        };


        // ------------------------------------------------
        // GEMINI EVALUATION
        // ------------------------------------------------

        const response =
            await ai.models.generateContent({

                model: "gemini-3.6-flash",

                contents: `

You are an expert technical interview evaluator.

Evaluate the candidate's answer.

Category:
${category || "Technical"}

Difficulty:
${difficulty || "Not specified"}

QUESTION:
${question}

MODEL ANSWER:
${modelAnswer}

CANDIDATE ANSWER:
${userAnswer}

Evaluate:

1. Technical correctness
2. Understanding
3. Completeness
4. Communication clarity
5. Confidence

Give scores from 0 to 10.

Rules:

- Partial answers should receive partial credit.
- Do not give high scores only because an answer is long.
- Keep feedback short and useful.
- Return structured JSON.

`,

                config: {

                    responseMimeType:
                        "application/json",

                    responseSchema:
                        evaluationSchema,

                    temperature: 0.2,

                    maxOutputTokens: 2000

                }

            });


        // ------------------------------------------------
        // CHECK RESPONSE
        // ------------------------------------------------

        if (
            !response ||
            !response.text
        ) {

            throw new Error(
                "Empty response from Gemini"
            );

        }


        const aiText =
            response.text.trim();


        console.log(
            "GEMINI EVALUATION RECEIVED"
        );


        // ------------------------------------------------
        // PARSE JSON
        // ------------------------------------------------

        let evaluation;

        try {

            evaluation =
                JSON.parse(aiText);

        } catch (error) {

            console.error(
                "AI Evaluation JSON Error:",
                error
            );

            console.error(
                "RAW GEMINI EVALUATION:",
                aiText
            );

            throw new Error(
                "Gemini returned invalid evaluation data"
            );

        }


        // ------------------------------------------------
        // VALIDATE SCORES
        // ------------------------------------------------

        const scoreFields = [

            "technicalScore",

            "communicationScore",

            "confidenceScore",

            "overallScore"

        ];


        const validScores =
            scoreFields.every(
                field => {

                    return (

                        typeof evaluation[field] ===
                            "number"

                        &&

                        evaluation[field] >= 0

                        &&

                        evaluation[field] <= 10

                    );

                }
            );


        if (!validScores) {

            throw new Error(
                "Gemini returned invalid scores"
            );

        }


        // ------------------------------------------------
        // SEND RESULT
        // ------------------------------------------------

        return res.json({

            success: true,

            evaluation: {

                technicalScore:
                    evaluation.technicalScore,

                communicationScore:
                    evaluation.communicationScore,

                confidenceScore:
                    evaluation.confidenceScore,

                overallScore:
                    evaluation.overallScore,

                feedback:
                    evaluation.feedback ||
                    "Good effort. Keep practicing.",

                strengths:
                    Array.isArray(
                        evaluation.strengths
                    )
                        ? evaluation.strengths
                        : [],

                improvements:
                    Array.isArray(
                        evaluation.improvements
                    )
                        ? evaluation.improvements
                        : []

            }

        });

            } catch (error) {

        console.error(
            "AI Evaluation Error:",
            error
        );

        if (error.status === 429) {
            return res.status(429).json({
                success: false,
                error: "Gemini API quota exceeded"
            });
        }

        if (error.status === 503) {
            return res.status(503).json({
                success: false,
                error: "Gemini AI is temporarily busy"
            });
        }

        return res.status(500).json({
            success: false,
            error:
                error.message ||
                "AI answer evaluation failed"
        });

    }
});

// ======================================================
// GROUP DISCUSSION - AI RESPONSE
// ======================================================

app.post("/api/gd-response", async (req, res) => {

    try {

        const {
            topic,
            difficulty,
            conversation
        } = req.body;


        // ------------------------------------------------
        // VALIDATION
        // ------------------------------------------------

        if (
            !topic ||
            !Array.isArray(conversation)
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Topic and conversation are required"

            });

        }


        // ------------------------------------------------
        // FIND LATEST USER MESSAGE
        // ------------------------------------------------

        const latestUserMessage =
            [...conversation]
                .reverse()
                .find(
                    (message) =>
                        message.type === "user"
                );


        if (!latestUserMessage) {

            return res.status(400).json({

                success: false,

                error:
                    "User message is required"

            });

        }


        const userMessage =
            String(
                latestUserMessage.text || ""
            )
                .trim();


        // ------------------------------------------------
        // TRIVIAL / NON-GD MESSAGE CHECK
        // ------------------------------------------------

        const normalizedMessage =
            userMessage
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();


        const trivialPatterns = [

            /^hi+$/,
            /^hello+$/,
            /^hey+$/,
            /^hii+$/,
            /^hiii+$/,
            /^helo+$/,
            /^ok+$/,
            /^okay+$/,
            /^yes+$/,
            /^no+$/,
            /^sure+$/,
            /^same+$/,
            /^thanks+$/,
            /^thank you+$/,
            /^thankyou+$/,
            /^i agree+$/,
            /^agree+$/,
            /^i disagree+$/,
            /^disagree+$/

        ];


        const isTrivialMessage =
            trivialPatterns.some(
                (pattern) =>
                    pattern.test(
                        normalizedMessage
                    )
            );


        // ------------------------------------------------
        // SHORT MESSAGE CHECK
        // ------------------------------------------------

        const wordCount =
            normalizedMessage
                .split(/\s+/)
                .filter(Boolean)
                .length;


        const isVeryShortMessage =
            wordCount <= 2;


        // ------------------------------------------------
        // DO NOT GENERATE A LONG GD ANSWER
        // FOR GREETINGS / VERY SHORT RESPONSES
        // ------------------------------------------------

        if (
            isTrivialMessage ||
            isVeryShortMessage
        ) {

            return res.json({

                success: true,

                response:
                    "Please share your opinion on the discussion topic."

            });

        }


        // ------------------------------------------------
        // GEMINI
        // ------------------------------------------------

        const { GoogleGenAI } =
            await import("@google/genai");


        const ai =
            new GoogleGenAI({

                apiKey:
                    process.env.GEMINI_API_KEY

            });


        // ------------------------------------------------
        // RECENT CONVERSATION
        // ------------------------------------------------

        const recentConversation =
            conversation
                .slice(-12)
                .map(
                    (message) => {

                        return (
                            `${message.sender}: ${message.text}`
                        );

                    }
                )
                .join("\n");


        // ------------------------------------------------
        // AI RESPONSE
        // ------------------------------------------------

        const response =
            await ai.models.generateContent({

                model:
                    "gemini-3.6-flash",

                contents: `

You are a participant in a college-level Group Discussion.

Topic:
${topic}

Difficulty:
${difficulty || "Medium"}

Conversation so far:
${recentConversation}

The latest participant message is:
"${userMessage}"

Your task is to respond naturally to the latest participant's actual idea.

IMPORTANT RULES:

1. Respond ONLY to the latest participant's meaningful idea.
2. Stay directly related to the discussion topic.
3. Do not turn a simple greeting into a full discussion answer.
4. Do not invent opinions that the participant did not express.
5. Do not repeat previous AI statements.
6. Give one useful GD contribution.
7. You may agree, disagree, add a point, give a short example, or introduce another viewpoint.
8. Use simple, professional English.
9. Keep the response to 2 or 3 sentences.
10. Keep the response concise, around 30–60 words.
11. Do not dominate the discussion.
12. Do not act as a teacher or evaluator.
13. Do not mention that you are an AI.
14. Do not give feedback or scores.
15. Return ONLY the response text.

`,

                config: {

                    temperature:
                        0.3,

                    maxOutputTokens:
                        250

                }

            });


        // ------------------------------------------------
        // CHECK RESPONSE
        // ------------------------------------------------

        if (
            !response ||
            !response.text
        ) {

            throw new Error(
                "Empty response from Gemini"
            );

        }


        const aiText =
            response.text
                .trim();


        if (!aiText) {

            throw new Error(
                "Gemini returned an empty response"
            );

        }


        // ------------------------------------------------
        // SEND RESPONSE
        // ------------------------------------------------

        return res.json({

            success: true,

            response:
                aiText

        });


        } catch (error) {

        console.error(
            "GD AI Response Error:",
            error
        );

        if (
            error.status === 429 ||
            error.status === 503
        ) {

            console.log(
                "⚠️ Gemini unavailable. Using GD fallback response."
            );

            const fallbackConversation =
                Array.isArray(req.body?.conversation)
                    ? req.body.conversation
                    : [];

            const fallbackUserMessage =
                [...fallbackConversation]
                    .reverse()
                    .find(
                        message =>
                            message.type === "user"
                    )?.text || "";

            const fallbackResponse =
                getGDFallbackResponse(
                    req.body?.topic || "",
                    fallbackUserMessage
                );

            return res.json({

                success: true,

                fallback: true,

                response:
                    fallbackResponse

            });

        }

        return res.status(500).json({

            success: false,

            error:
                error.message ||
                "GD AI response failed"

        });
     }

    });
/* =========================================
   GROUP DISCUSSION EVALUATION
========================================= */

app.post("/api/gd-evaluate", async (req, res) => {

    try {

        const {
            topic,
            difficulty,
            participants,
            conversation,
            participantName,
            participantUid
        } = req.body;


        /* -----------------------------------------
           BASIC VALIDATION
        ----------------------------------------- */

        if (
            !topic ||
            !Array.isArray(participants) ||
            !Array.isArray(conversation)
        ) {

            return res.status(400).json({

                success: false,

                error:
                    "Topic, participants and conversation are required"

            });

        }


        if (!participantUid) {

            return res.status(400).json({

                success: false,

                error:
                    "Participant information is required"

            });

        }


        /* -----------------------------------------
           FIND CURRENT PARTICIPANT MESSAGES
        ----------------------------------------- */

const participantMessages =
    conversation.filter(
        (message) =>
            message.uid === participantUid &&
            message.type === "user"
    );


        /*
         * Fallback:
         * If UID is unavailable for an old message,
         * match the participant name.
         */
        const identifiedMessages =
            participantMessages.length > 0
                ? participantMessages
                : conversation.filter(
                    (message) =>
                        message.sender ===
                        participantName &&
                        message.type === "user"
                );


        /* -----------------------------------------
           BASIC MESSAGE ANALYSIS
        ----------------------------------------- */

        const normalizeText = (text) => {

            return String(text || "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, " ");

        };


        const trivialPatterns = [

            /^hi+$/,
            /^hello+$/,
            /^hey+$/,
            /^hii+$/,
            /^hiii+$/,
            /^helo+$/,
            /^ok+$/,
            /^okay+$/,
            /^yes+$/,
            /^no+$/,
            /^sure+$/,
            /^same+$/,
            /^thanks+$/,
            /^thank you+$/,
            /^thankyou+$/,
            /^i agree+$/,
            /^agree+$/,
            /^i disagree+$/,
            /^disagree+$/

        ];


        const isTrivialMessage = (text) => {

            const normalized =
                normalizeText(text);

            return trivialPatterns.some(
                (pattern) =>
                    pattern.test(normalized)
            );

        };


        const meaningfulMessages =
            identifiedMessages.filter(
                (message) => {

                    const text =
                        normalizeText(
                            message.text
                        );

                    if (!text) {
                        return false;
                    }

                    if (
                        isTrivialMessage(text)
                    ) {
                        return false;
                    }

                    /*
                     * Very short responses are not
                     * considered strong GD contributions.
                     */
                    if (
                        text.split(/\s+/).length < 4
                    ) {
                        return false;
                    }

                    return true;

                }
            );


        const totalParticipantMessages =
            identifiedMessages.length;


        const meaningfulMessageCount =
            meaningfulMessages.length;


        const totalWords =
            identifiedMessages.reduce(
                (total, message) => {

                    return (
                        total +
                        normalizeText(
                            message.text
                        )
                            .split(/\s+/)
                            .filter(Boolean)
                            .length
                    );

                },
                0
            );


        /* -----------------------------------------
           VERY LOW ACTIVITY PROTECTION
        ----------------------------------------- */

        /*
         * If the participant only says things like
         * "hi", "hello", "okay", etc.,
         * do NOT allow Gemini to give an
         * unrealistically high score.
         */

        if (
            meaningfulMessageCount === 0
        ) {

            return res.json({

                success: true,

                evaluation: {

                    overallScore: 1,

                    communicationScore:
                        totalWords > 0 ? 1 : 0,

                    relevanceScore: 0,

                    confidenceScore: 0,

                    teamworkScore:
                        totalParticipantMessages > 0
                            ? 1
                            : 0,

                    participationScore:
                        totalParticipantMessages > 0
                            ? 1
                            : 0,

                    feedback:
                        "Your discussion contribution was too limited to demonstrate your GD skills. Try to share clear, topic-related ideas, explain your reasoning, and respond to other participants.",

                    strengths: [],

                    improvements: [

                        "Speak more than greetings or very short responses.",

                        "Share relevant ideas about the discussion topic.",

                        "Explain your opinion with reasons or examples.",

                        "Respond meaningfully to other participants."

                    ]

                }

            });

        }


        /* -----------------------------------------
           GEMINI
        ----------------------------------------- */

        const { GoogleGenAI } =
            await import("@google/genai");


        const ai =
            new GoogleGenAI({

                apiKey:
                    process.env.GEMINI_API_KEY

            });


        const participantNames =
            participants
                .map(
                    (participant) =>
                        participant.name
                )
                .join(", ");


        const fullDiscussionText =
            conversation
                .map(
                    (message) => {

                        return (
                            `${message.sender}: ${message.text}`
                        );

                    }
                )
                .join("\n");


        const participantContributionText =
            identifiedMessages
                .map(
                    (message) => {

                        return (
                            `${message.sender}: ${message.text}`
                        );

                    }
                )
                .join("\n");


        /* -----------------------------------------
           EVALUATION SCHEMA
        ----------------------------------------- */

        const evaluationSchema = {

            type: "object",

            properties: {

                communicationScore: {
                    type: "number"
                },

                relevanceScore: {
                    type: "number"
                },

                contentScore: {
                    type: "number"
                },

                participationScore: {
                    type: "number"
                },

                reasoningScore: {
                    type: "number"
                },

                overallScore: {
                    type: "number"
                },

                feedback: {
                    type: "string"
                },

                strengths: {

                    type: "array",

                    items: {
                        type: "string"
                    }

                },

                improvements: {

                    type: "array",

                    items: {
                        type: "string"
                    }

                }

            },

            required: [

                "communicationScore",

                "relevanceScore",

                "contentScore",

                "participationScore",

                "reasoningScore",

                "overallScore",

                "feedback",

                "strengths",

                "improvements"

            ]

        };


        /* -----------------------------------------
   GEMINI EVALUATION WITH RETRY
----------------------------------------- */

let response = null;

let attempts = 0;

const maxAttempts = 3;

while (
    attempts < maxAttempts &&
    !response
) {

    attempts++;

    try {

        console.log(
            `🤖 GD Evaluation attempt ${attempts}/${maxAttempts}`
        );

        response =
            await ai.models.generateContent({

                model:
                    "gemini-3.6-flash",

                contents: `

You are a strict and fair college-level Group Discussion evaluator.

Evaluate ONLY the performance of this participant:

Participant:
${participantName}

Participant UID:
${participantUid}

Topic:
${topic}

Difficulty:
${difficulty || "Medium"}

Participants:
${participantNames}


PARTICIPANT'S OWN CONTRIBUTIONS:
${participantContributionText}


FULL DISCUSSION:
${fullDiscussionText}


SCORING SYSTEM:

Evaluate five areas.

1. Communication & Clarity — /10
- Clear sentences
- Understandable expression
- Professional language
- Ability to communicate an idea clearly

2. Topic Relevance — /10
- Ideas directly related to the topic
- Avoids unnecessary statements
- Understands the discussion subject

3. Ideas & Content — /10
- Quality of ideas
- Examples
- Useful information
- Original or meaningful points

4. Participation & Engagement — /10
- Meaningful participation
- Responding to other participants
- Contributing throughout the discussion
- Do NOT reward greetings or meaningless short messages

5. Reasoning & Response — /10
- Gives reasons
- Explains opinions
- Responds logically to different viewpoints
- Shows critical thinking


STRICT SCORING RULES:

- Score ONLY the selected participant.
- Do not give credit for other participants' messages.
- Do not reward message length alone.
- A greeting such as "hi", "hello", "hey", "hii" gives almost no score.
- "okay", "yes", "no", "same", "sure", "I agree" alone are not meaningful contributions.
- Very short statements without explanation should receive low scores.
- A participant must demonstrate actual GD skills to receive a high score.
- High scores require multiple meaningful, relevant contributions.
- Do not give 7, 8, 9 or 10 simply because the participant participated.
- If the participant has only one meaningful sentence, scores should remain limited.
- If the participant gives several strong, relevant contributions with reasoning and responses, higher scores are appropriate.
- Evaluate the actual evidence in the conversation.
- Do not invent statements that the participant did not say.

IMPORTANT SCORE CALIBRATION:

0–2 = Very weak / almost no meaningful contribution
3–4 = Limited contribution
5–6 = Average / developing
7–8 = Good
9 = Very strong
10 = Exceptional

Return scores from 0 to 10.

The overall score must reflect the participant's actual performance across all five categories.

Keep feedback practical and specific.

Return structured JSON only.

`,

                config: {

                    responseMimeType:
                        "application/json",

                    responseSchema:
                        evaluationSchema,

                    temperature:
                        0.1,

                    maxOutputTokens:
                        3000

                }

            });

        console.log(
            "✅ GD Evaluation response received"
        );

    } catch (error) {

        console.error(
            `GD Evaluation attempt ${attempts} failed:`,
            error.status ||
            error.message
        );

        /*
         * Retry only temporary Gemini
         * service errors.
         */

        if (
            error.status === 503 &&
            attempts < maxAttempts
        ) {

            console.log(
                "⏳ Gemini is temporarily busy. Retrying GD evaluation in 3 seconds..."
            );

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        3000
                    )
            );

        } else {

            throw error;

        }

    }

}


/* -----------------------------------------
   FINAL RESPONSE CHECK
----------------------------------------- */

if (
    !response ||
    !response.text
) {

    throw new Error(
        "Empty GD evaluation response"
    );

}
        /* -----------------------------------------
           PARSE RESPONSE
        ----------------------------------------- */

        let evaluation;


        try {

            evaluation =
                JSON.parse(
                    response.text.trim()
                );

        } catch (error) {

            console.error(
                "GD Evaluation JSON Error:",
                error
            );

            throw new Error(
                "Gemini returned invalid GD evaluation"
            );

        }


        /* -----------------------------------------
           SCORE VALIDATION
        ----------------------------------------- */

        const scoreFields = [

            "communicationScore",

            "relevanceScore",

            "contentScore",

            "participationScore",

            "reasoningScore"

        ];


        const validScores =
            scoreFields.every(
                (field) => {

                    return (

                        typeof evaluation[field] ===
                        "number"

                        &&

                        evaluation[field] >=
                        0

                        &&

                        evaluation[field] <=
                        10

                    );

                }
            );


        if (!validScores) {

            throw new Error(
                "Invalid GD evaluation scores"
            );

        }


        /* -----------------------------------------
           CALCULATE TOTAL /50
        ----------------------------------------- */

        const totalScore =
            evaluation.communicationScore +
            evaluation.relevanceScore +
            evaluation.contentScore +
            evaluation.participationScore +
            evaluation.reasoningScore;


        /*
         * Convert /50 to the existing /10
         * Overall Score UI.
         *
         * Example:
         * 40/50 = 8/10
         */

        const overallScore =
            Math.round(
                (totalScore / 5) *
                10
            ) / 10;


        /* -----------------------------------------
           FINAL RESPONSE
        ----------------------------------------- */

        return res.json({

            success: true,

            evaluation: {

                /*
                 * Existing frontend fields
                 * are preserved.
                 */

                overallScore:
                    Math.min(
                        10,
                        Math.max(
                            0,
                            overallScore
                        )
                    ),

                communicationScore:
                    evaluation.communicationScore,

                relevanceScore:
                    evaluation.relevanceScore,


                /*
                 * New detailed scores.
                 * Existing frontend does not depend
                 * on these, so this is backward compatible.
                 */

                contentScore:
                    evaluation.contentScore,

                participationScore:
                    evaluation.participationScore,

                reasoningScore:
                    evaluation.reasoningScore,

                totalScore:
                    totalScore,


                feedback:
                    evaluation.feedback ||
                    "Continue practicing your communication, reasoning and topic-related discussion skills.",

                strengths:
                    Array.isArray(
                        evaluation.strengths
                    )
                        ? evaluation.strengths
                        : [],

                improvements:
                    Array.isArray(
                        evaluation.improvements
                    )
                        ? evaluation.improvements
                        : []

            }

        });
    } catch (error) {

        console.error(
            "GD Evaluation Error:",
            error
        );

        if (
            error.status === 429 ||
            error.status === 503
        ) {

            console.log(
                "⚠️ Gemini unavailable. Using GD fallback evaluation."
            );

            const fallbackEvaluation =
                buildGDFallbackEvaluation(
                    req.body
                );

            return res.json({

                success: true,

                fallback: true,

                evaluation:
                    fallbackEvaluation

            });

        }

        return res.status(500).json({

            success: false,

            error:
                error.message ||
                "GD evaluation failed"

        });

    }

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});