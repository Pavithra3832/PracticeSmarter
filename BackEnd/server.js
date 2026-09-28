const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("SERVER FILE STARTED");

// ======================================================
// HOME ROUTE
// ======================================================

app.get("/", (req, res) => {
    res.send("PracticeSmarter Backend is Running!");
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


        // ------------------------------------------------
        // QUOTA
        // ------------------------------------------------

        if (
            error.status === 429
        ) {

            return res.status(429).json({

                success: false,

                error:
                    "Gemini API quota exceeded"

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
                    "Gemini AI is temporarily busy"

            });

        }


        // ------------------------------------------------
        // GENERAL ERROR
        // ------------------------------------------------

        return res.status(500).json({

            success: false,

            error:
                error.message ||
                "AI evaluation failed"

        });

    }

});


// ======================================================
// SERVER
// ======================================================

const PORT = 5000;

const server =
    app.listen(
        PORT,
        () => {

            console.log(
                `Server running on port ${PORT}`
            );

        }
    );


// ======================================================
// SERVER ERROR
// ======================================================

server.on(
    "error",
    error => {

        console.error(
            "SERVER ERROR:",
            error
        );

    }
);

