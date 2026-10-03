// ======================================
// FIREBASE AUTH
// ======================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyDnR_HHjMjsUanr0ZIC1uwyEDJQ2aVxqTU",
    authDomain: "ai-interview-practice-pl-acc38.firebaseapp.com",
    projectId: "ai-interview-practice-pl-acc38",
    storageBucket: "ai-interview-practice-pl-acc38.firebasestorage.app",
    messagingSenderId: "64194969019",
    appId: "1:64194969019:web:83b2addcd10f5a9f74989e",
    measurementId: "G-PL54GCRDF6"
};
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// ======================================
// LOGIN PROTECTION
// ======================================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("login.html");
}
// ======================================
// GET SAVED INTERVIEW DATA
// ======================================

const answers =
    JSON.parse(localStorage.getItem("interviewAnswers")) || [];

const questions =
    JSON.parse(localStorage.getItem("interviewQuestions")) || [];

const category =
    localStorage.getItem("interviewCategory") || "HTML";

const difficulty =
    localStorage.getItem("interviewDifficulty") || "Easy";

const isAIInterview =
    questions.some(
        question => question?.isAI === true
    );

const interviewSessionId =
    sessionStorage.getItem("interviewSessionId") ||
    `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

sessionStorage.setItem(
    "interviewSessionId",
    interviewSessionId
);    


// ======================================
// GET HTML ELEMENTS
// ======================================

const scoreElement =
    document.getElementById("score");

const percentageElement =
    document.getElementById("percentage");

const resultMessage =
    document.getElementById("result-greeting");

const technicalScoreElement =
    document.getElementById("technical-score");

const technicalFeedbackElement =
    document.getElementById("technical-feedback");

const communicationScoreElement =
    document.getElementById("communication-score");

const communicationFeedbackElement =
    document.getElementById("communication-feedback");

const confidenceScoreElement =
    document.getElementById("confidence-score");

const confidenceFeedbackElement =
    document.getElementById("confidence-feedback");

const reviewContainer =
    document.getElementById("answer-review-container");
const aiPercentageElement =
    document.getElementById("aiPercentage");

const aiLevelElement =
    document.getElementById("aiLevel");

const aiScoreCircle =
    document.querySelector(".score-circle");    


// ======================================
// TECHNICAL SCORE
// ======================================

let technicalPoints = 0;

let totalQuestions = questions.length;


// ======================================
// CHECK EACH ANSWER
// ======================================

const answerResults = [];

for (let i = 0; i < totalQuestions; i++) {

    const userAnswer =
        (answers[i] || "").trim();

    const correctAnswer =
        questions[i]?.answer || "";

    let isCorrect = false;

    if (userAnswer !== "" && correctAnswer !== "") {

        const userText =
            userAnswer.toLowerCase();

        const correctText =
            correctAnswer.toLowerCase();

        // Exact match
        if (userText === correctText) {

            isCorrect = true;

        }

        // User answer contains important part
        else {

            const correctWords =
                correctText
                    .replace(/[.,!?]/g, "")
                    .split(/\s+/)
                    .filter(word => word.length > 3);

            let matchedWords = 0;

            correctWords.forEach(word => {

                if (userText.includes(word)) {
                    matchedWords++;
                }

            });

            const matchPercentage =
                correctWords.length > 0
                    ? matchedWords / correctWords.length
                    : 0;

            if (matchPercentage >= 0.45) {
                isCorrect = true;
            }
        }
    }


    if (isCorrect) {
        technicalPoints++;
    }


    answerResults.push({
        question: questions[i]?.question || `Question ${i + 1}`,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect
    });

}

// ======================================
// TECHNICAL SCORE OUT OF 10
// ======================================

let technicalScore = 0;

if (totalQuestions > 0) {

    technicalScore =
        Number(
            (
                (technicalPoints / totalQuestions) * 10
            ).toFixed(1)
        );

}

// ======================================
// COMMUNICATION SCORE
// ======================================

let communicationPoints = 0;

let answeredQuestions = 0;

const fillerWords = [
    "um",
    "uh",
    "hmm",
    "like",
    "actually",
    "basically",
    "you know"
];


answers.forEach(answer => {

    if (!answer || answer.trim() === "") {
        return;
    }

    answeredQuestions++;

    const text =
        answer.trim();

    const words =
        text.split(/\s+/);

    let points = 0;


    // ----------------------------------
    // Answer length
    // ----------------------------------

    if (words.length >= 10) {

        points += 3;

    } else if (words.length >= 5) {

        points += 2;

    } else if (words.length >= 2) {

        points += 1;
    }


    // ----------------------------------
    // Clear explanation
    // ----------------------------------

    if (
        text.includes(".") ||
        text.includes(",") ||
        words.length >= 12
    ) {

        points += 1;
    }


    // ----------------------------------
    // Filler words
    // ----------------------------------

    const lowerText =
        text.toLowerCase();

    let fillerCount = 0;

    fillerWords.forEach(word => {

        const regex =
            new RegExp(`\\b${word}\\b`, "g");

        const matches =
            lowerText.match(regex);

        if (matches) {

            fillerCount += matches.length;
        }

    });


    if (fillerCount === 0) {

        points += 1;

    } else if (fillerCount <= 2) {

        points += 0.5;
    }


    communicationPoints += points;

});
// ======================================
// FINAL COMMUNICATION SCORE
// ======================================

let communicationScore = 0;

if (totalQuestions > 0) {

    const maxPoints =
        totalQuestions * 5;

    communicationScore =
        Number(
            (
                (communicationPoints / maxPoints) * 10
            ).toFixed(1)
        );
}
// ======================================
// CONFIDENCE SCORE
// ======================================
//
// This is a basic text-based estimate.
// Later, camera/voice analysis can make
// this more advanced.
// ======================================

let confidencePoints = 0;

answers.forEach(answer => {

    if (!answer || answer.trim() === "") {
        return;
    }

    const text =
        answer.trim();

    const words =
        text.split(/\s+/);


    // Good answer length
    if (words.length >= 8) {

        confidencePoints += 2;

    } else if (words.length >= 4) {

        confidencePoints += 1;
    }


    // Avoid weak phrases
    const lowerText =
        text.toLowerCase();

    if (
        !lowerText.includes("i don't know") &&
        !lowerText.includes("not sure") &&
        !lowerText.includes("maybe")
    ) {

        confidencePoints += 1;
    }


    // Avoid too many fillers
    let fillerCount = 0;

    fillerWords.forEach(word => {

        const regex =
            new RegExp(`\\b${word}\\b`, "g");

        const matches =
            lowerText.match(regex);

        if (matches) {
            fillerCount += matches.length;
        }

    });


    if (fillerCount === 0) {

        confidencePoints += 1;
    }

});
// ======================================
// FINAL CONFIDENCE SCORE
// ======================================

let confidenceScore = 0;

if (totalQuestions > 0) {

    const maxConfidencePoints =
        totalQuestions * 4;

    confidenceScore =
        Number(
            (
                (confidencePoints /
                    maxConfidencePoints) * 10
            ).toFixed(1)
        );
}
// ======================================
// OVERALL SCORE
// ======================================
//
// Equal weight:
//
// Technical      = 40%
// Communication  = 30%
// Confidence     = 30%
// ======================================

let overallScore =
    Number(
        (
            technicalScore * 0.40 +
            communicationScore * 0.30 +
            confidenceScore * 0.30
        ).toFixed(1)
    );
let overallPercentage =
    Math.round(overallScore * 10);

// ======================================
// GEMINI AI INTERVIEW EVALUATION
// ======================================

async function evaluateInterviewWithAI() {

    console.log("🤖 Starting Gemini AI evaluation...");

    const aiResults = [];

    for (let i = 0; i < questions.length; i++) {

        const question = questions[i];

        const userAnswer =
            (answers[i] || "").trim();

        const modelAnswer =
            question?.answer || "";

        console.log(
            `🤖 Evaluating Question ${i + 1}/${questions.length}`
        );

        // ----------------------------------
        // Empty answer
        // ----------------------------------

        if (!userAnswer) {

            aiResults.push({

                question:
                    question?.question ||
                    `Question ${i + 1}`,

                userAnswer: "",

                technicalScore: 0,

                communicationScore: 0,

                confidenceScore: 0,

                overallScore: 0,

                feedback:
                    "No answer was provided.",

                strengths: [],

                improvements: [
                    "Attempt every question.",
                    "Provide a clear technical explanation."
                ]

            });

            continue;
        }


        try {

            const response =
                await fetch(
                    "https://practicesmarter.onrender.com/api/evaluate-answer",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            question:
                                question?.question || "",

                            modelAnswer:
                                modelAnswer,

                            userAnswer:
                                userAnswer,

                            category:
                                category,

                            difficulty:
                                question?.difficulty ||
                                difficulty

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "AI evaluation failed"
                );

            }


            if (
                !data.evaluation
            ) {

                throw new Error(
                    "Invalid AI evaluation response"
                );

            }


            aiResults.push({

                question:
                    question?.question || "",

                userAnswer:
                    userAnswer,

                technicalScore:
                    Number(
                        data.evaluation
                            .technicalScore || 0
                    ),

                communicationScore:
                    Number(
                        data.evaluation
                            .communicationScore || 0
                    ),

                confidenceScore:
                    Number(
                        data.evaluation
                            .confidenceScore || 0
                    ),

                overallScore:
                    Number(
                        data.evaluation
                            .overallScore || 0
                    ),

                feedback:
                    data.evaluation.feedback ||
                    "",

                strengths:
                    Array.isArray(
                        data.evaluation.strengths
                    )
                        ? data.evaluation.strengths
                        : [],

                improvements:
                    Array.isArray(
                        data.evaluation.improvements
                    )
                        ? data.evaluation.improvements
                        : []

            });


            console.log(
                `✅ Question ${i + 1} evaluated`
            );


        } catch (error) {

            console.error(
                `❌ AI evaluation failed for Question ${i + 1}:`,
                error
            );


            // ----------------------------------
            // Fallback to existing scoring
            // ----------------------------------

            const existingResult =
                answerResults[i];


            aiResults.push({

                question:
                    existingResult?.question ||
                    `Question ${i + 1}`,

                userAnswer:
                    existingResult?.userAnswer ||
                    userAnswer,

                technicalScore:
                    existingResult?.isCorrect
                        ? 10
                        : 0,

                communicationScore:
                    communicationScore,

                confidenceScore:
                    confidenceScore,

                overallScore:
                    existingResult?.isCorrect
                        ? 10
                        : 0,

                feedback:
                    "AI evaluation was unavailable. Basic evaluation was used.",

                strengths:
                    existingResult?.isCorrect
                        ? [
                            "Your answer matched important technical concepts."
                        ]
                        : [],

                improvements:
                    existingResult?.isCorrect
                        ? []
                        : [
                            "Improve your technical explanation and review the model answer."
                        ],

                aiUnavailable:
                    true

            });

        }

    }


    console.log(
        "✅ AI evaluation completed:",
        aiResults
    );


    return aiResults;
}

// ======================================
// FINAL AI EVALUATION + SAVE RESULT
// ======================================

async function runFinalInterviewEvaluation() {

    console.log("======================================");
    console.log("🤖 FINAL INTERVIEW EVALUATION STARTED");
    console.log("======================================");

    let aiEvaluationResults = [];
    let actualAIResults = [];

    // ==================================
    // RUN GEMINI EVALUATION
    // ==================================

    // ==================================
// RUN GEMINI EVALUATION ONLY FOR AI INTERVIEW
// ==================================

if (
    questions.length > 0 &&
    isAIInterview
) {

    try {

        aiEvaluationResults =
            await evaluateInterviewWithAI();

    } catch (error) {

        console.error(
            "❌ AI evaluation process failed:",
            error
        );

        aiEvaluationResults = [];

    }

} else {

    console.log(
        "📝 Normal interview detected. Skipping Gemini AI evaluation."
    );

    aiEvaluationResults = [];

}


    // ==================================
    // CHECK AI RESULTS
    // ==================================

    if (
        !Array.isArray(aiEvaluationResults) ||
        aiEvaluationResults.length === 0
    ) {

        console.log(
            "⚠️ No AI results available. Using basic evaluation."
        );

    } else {

        console.log(
            "🤖 AI evaluation results received:",
            aiEvaluationResults.length
        );

    }


    // ==================================
    // CALCULATE FINAL SCORES
    // ==================================

    let finalTechnicalScore =
        technicalScore;

    let finalCommunicationScore =
        communicationScore;

    let finalConfidenceScore =
        confidenceScore;

    let finalOverallScore =
        overallScore;


    // ==================================
    // USE AI SCORES WHEN AVAILABLE
    // ==================================

    actualAIResults =
    aiEvaluationResults.filter(
        result =>
            result &&
            result.aiUnavailable !== true
    );
if (
    actualAIResults.length ===
    questions.length
) {

       const validResults =
    actualAIResults.filter(
                result =>
                    result &&
                    typeof result.technicalScore === "number" &&
                    typeof result.communicationScore === "number" &&
                    typeof result.confidenceScore === "number"
            );


        if (validResults.length > 0) {

            // ------------------------------
            // Technical
            // ------------------------------

            const technicalTotal =
                validResults.reduce(
                    (sum, result) =>
                        sum +
                        result.technicalScore,
                    0
                );


            finalTechnicalScore =
                Number(
                    (
                        technicalTotal /
                        validResults.length
                    ).toFixed(1)
                );


            // ------------------------------
            // Communication
            // ------------------------------

            const communicationTotal =
                validResults.reduce(
                    (sum, result) =>
                        sum +
                        result.communicationScore,
                    0
                );


            finalCommunicationScore =
                Number(
                    (
                        communicationTotal /
                        validResults.length
                    ).toFixed(1)
                );


            // ------------------------------
            // Confidence
            // ------------------------------

            const confidenceTotal =
                validResults.reduce(
                    (sum, result) =>
                        sum +
                        result.confidenceScore,
                    0
                );


            finalConfidenceScore =
                Number(
                    (
                        confidenceTotal /
                        validResults.length
                    ).toFixed(1)
                );


            // ------------------------------
            // Overall
            // ------------------------------

            finalOverallScore =
                Number(
                    (
                        finalTechnicalScore * 0.40 +
                        finalCommunicationScore * 0.30 +
                        finalConfidenceScore * 0.30
                    ).toFixed(1)
                );


            console.log(
                "🤖 AI FINAL SCORES:"
            );

            console.log(
                "Technical:",
                finalTechnicalScore
            );

            console.log(
                "Communication:",
                finalCommunicationScore
            );

            console.log(
                "Confidence:",
                finalConfidenceScore
            );

            console.log(
                "Overall:",
                finalOverallScore
            );

        }

    }


    // ==================================
    // FINAL PERCENTAGE
    // ==================================

    const finalOverallPercentage =
        Math.round(
            finalOverallScore * 10
        );


    // ==================================
    // UPDATE ORIGINAL VARIABLES
    // ==================================

    technicalScore =
        finalTechnicalScore;

    communicationScore =
        finalCommunicationScore;

    confidenceScore =
        finalConfidenceScore;

    overallScore =
        finalOverallScore;

    overallPercentage =
        finalOverallPercentage;

        // ======================================
// DETECT WEAK TOPICS FOR THIS INTERVIEW
// ======================================

const weakTopicMap = {

    HTML: [
        {
            name: "Semantic HTML",
            keywords: ["semantic", "header", "footer", "section", "article", "nav", "aside"]
        },
        {
            name: "Forms & Inputs",
            keywords: ["form", "input", "textarea", "label", "validation"]
        },
        {
            name: "HTML Attributes",
            keywords: ["attribute", "id", "class", "alt", "href", "src"]
        },
        {
            name: "Multimedia",
            keywords: ["audio", "video", "iframe", "image", "media"]
        },
        {
            name: "Accessibility",
            keywords: ["accessibility", "aria", "screen reader"]
        }
    ],

    CSS: [
        {
            name: "Flexbox",
            keywords: ["flexbox", "justify-content", "align-items", "flex-direction", "flex-wrap"]
        },
        {
            name: "CSS Grid",
            keywords: ["grid", "grid-template", "grid-area", "grid-column", "grid-row"]
        },
        {
            name: "Box Model",
            keywords: ["box model", "margin", "padding", "border", "content box"]
        },
        {
            name: "Selectors & Specificity",
            keywords: ["selector", "specificity", "pseudo-class", "pseudo-element"]
        },
        {
            name: "Responsive Design",
            keywords: ["responsive", "media query", "mobile", "viewport"]
        }
    ],

    JavaScript: [
        {
            name: "Variables & Scope",
            keywords: ["var", "let", "const", "scope", "hoisting"]
        },
        {
            name: "Functions & Closures",
            keywords: ["function", "closure", "callback", "arrow function"]
        },
        {
            name: "DOM & Events",
            keywords: ["dom", "document", "event", "onclick", "addeventlistener"]
        },
        {
            name: "Async JavaScript",
            keywords: ["promise", "async", "await", "fetch", "asynchronous"]
        },
        {
            name: "Arrays & Objects",
            keywords: ["array", "object", "map", "filter", "reduce"]
        }
    ],

    Python: [
        {
            name: "Python Data Types",
            keywords: ["list", "tuple", "set", "dictionary", "data type"]
        },
        {
            name: "Functions",
            keywords: ["function", "def", "lambda", "parameter"]
        },
        {
            name: "Object-Oriented Programming",
            keywords: ["class", "object", "inheritance", "polymorphism", "encapsulation"]
        },
        {
            name: "Exception Handling",
            keywords: ["exception", "try", "except", "finally"]
        },
        {
            name: "Modules & Packages",
            keywords: ["module", "package", "import", "pip"]
        }
    ],

    Java: [
        {
            name: "OOP Concepts",
            keywords: ["class", "object", "inheritance", "polymorphism", "encapsulation"]
        },
        {
            name: "Exception Handling",
            keywords: ["exception", "try", "catch", "finally"]
        },
        {
            name: "Collections",
            keywords: ["arraylist", "hashmap", "collection", "list", "set"]
        },
        {
            name: "Interfaces & Abstraction",
            keywords: ["interface", "abstract", "abstraction"]
        },
        {
            name: "Multithreading",
            keywords: ["thread", "multithreading", "synchronized"]
        }
    ]
};


// ======================================
// DETECT TOPIC FROM QUESTION
// ======================================

function detectInterviewTopic(category, question) {

    const topics =
        weakTopicMap[category] || [];

    const text =
        String(question || "").toLowerCase();

    let bestTopic = null;
    let bestMatches = 0;

    topics.forEach(topic => {

        let matches = 0;

        topic.keywords.forEach(keyword => {

            if (
                text.includes(
                    keyword.toLowerCase()
                )
            ) {
                matches++;
            }

        });

        if (matches > bestMatches) {

            bestMatches = matches;
            bestTopic = topic.name;

        }

    });

    return bestTopic || "Core Concepts";
}


// ======================================
// BUILD WEAK TOPIC DATA
// ======================================

function getWeakTopicsForInterview() {

    const topicCounts = {};

    answerResults.forEach(item => {

        if (item.isCorrect) {
            return;
        }

        const topic =
            detectInterviewTopic(
                category,
                item.question
            );

        topicCounts[topic] =
            (topicCounts[topic] || 0) + 1;

    });

    return Object.entries(topicCounts)
        .map(([topic, count]) => ({
            topic,
            count
        }));

}


const weakTopics =
    getWeakTopicsForInterview();

console.log(
    "🧠 Weak topics for this interview:",
    weakTopics
);



    // ==================================
    // SAVE COMPLETE INTERVIEW RESULT
    // ==================================

    let interviewScores =
        JSON.parse(
            localStorage.getItem(
                "interviewScores"
            )
        ) || [];


    const interviewResult = {

    category:
        category,

    difficulty:
        difficulty,

    technical:
        finalTechnicalScore,

    communication:
        finalCommunicationScore,

    confidence:
        finalConfidenceScore,

    overall:
        finalOverallPercentage,

    weakTopics:
        weakTopics,

    date:
        new Date().toLocaleString(
            [],
            {
                dateStyle: "short",
                timeStyle: "short"
            }
        )
};

// ======================================
// FIREBASE USER + LOCAL RESULT SAVE
// ======================================

return new Promise(resolve => {

    onAuthStateChanged(
        auth,
        async (user) => {

            // ==================================
            // PREVENT DUPLICATE SAVE
            // ==================================

            const savedSessionId =
                sessionStorage.getItem(
                    "savedInterviewSessionId"
                );


            if (
                savedSessionId ===
                interviewSessionId
            ) {

                console.log(
                    "This interview result is already saved."
                );

                resolve();

                return;
            }


            // ==================================
            // SAVE LOCAL RESULT FIRST
            // ==================================

            let localResult = {

                ...interviewResult,

                userId:
                    user?.uid || "local-user",

                sessionId:
                    interviewSessionId

            };


            // ==================================
            // ADD RESULT TO LOCALSTORAGE
            // ==================================

            interviewScores.push(
                localResult
            );


            localStorage.setItem(
                "interviewScores",
                JSON.stringify(
                    interviewScores
                )
            );


            console.log(
                "✅ LOCAL INTERVIEW RESULT SAVED"
            );

            console.log(
                "Interview Category:",
                category
            );

            console.log(
                "Interview Difficulty:",
                difficulty
            );

            console.log(
                "Overall Percentage:",
                finalOverallPercentage
            );


            // ==================================
            // FIREBASE USER NOT AVAILABLE
            // ==================================

            if (!user) {

                console.warn(
                    "⚠️ Firebase user unavailable. Result saved locally."
                );


                // Mark session as saved
                // so refresh does not create duplicate result

                sessionStorage.setItem(
                    "savedInterviewSessionId",
                    interviewSessionId
                );


                console.log(
                    "✅ Result will be available in Progress and Interview History."
                );


                resolve();

                return;
            }


            // ==================================
            // FIRESTORE SAVE
            // ==================================

            try {

                const resultRef =
                    doc(
                        db,
                        "interviewResults",
                        interviewSessionId
                    );


                await setDoc(
    resultRef,
    {

        userId:
            user.uid,

        sessionId:
            interviewSessionId,

        category:
            category,

        difficulty:
            difficulty,

        technical:
            finalTechnicalScore,

        communication:
            finalCommunicationScore,

        confidence:
            finalConfidenceScore,

        overall:
            finalOverallPercentage,

        weakTopics:
            weakTopics,

        totalQuestions:
            totalQuestions,

        correctAnswers:
            technicalPoints,

        answeredQuestions:
            answeredQuestions,

        aiEvaluated:
            actualAIResults.length > 0,

        aiEvaluationCount:
            actualAIResults.length,

        createdAt:
            serverTimestamp()

    }
);


                console.log(
                    "🔥 FIRESTORE WRITE CONFIRMED"
                );

                console.log(
                    "📁 Collection: interviewResults"
                );

                console.log(
                    "🆔 Document ID:",
                    interviewSessionId
                );

                console.log(
                    "👤 User ID:",
                    user.uid
                );


                // ==================================
                // MARK SESSION AS SAVED
                // ==================================

                sessionStorage.setItem(
                    "savedInterviewSessionId",
                    interviewSessionId
                );


                console.log(
                    "======================================"
                );

                console.log(
                    "✅ FINAL INTERVIEW RESULT SAVED"
                );

                console.log(
                    "Interview Category:",
                    category
                );

                console.log(
                    "Interview Difficulty:",
                    difficulty
                );

                console.log(
                    "Technical Score:",
                    finalTechnicalScore
                );

                console.log(
                    "Communication Score:",
                    finalCommunicationScore
                );

                console.log(
                    "Confidence Score:",
                    finalConfidenceScore
                );

                console.log(
                    "Overall Score:",
                    finalOverallScore
                );

                console.log(
                    "Overall Percentage:",
                    finalOverallPercentage
                );

                console.log(
                    "AI Evaluations:",
                    aiEvaluationResults.length
                );

                console.log(
                    "Interview Session ID:",
                    interviewSessionId
                );

                console.log(
                    "Firebase User ID:",
                    user.uid
                );

                console.log(
                    "======================================"
                );


            } catch (error) {

                console.error(
                    "❌ Firestore save error:",
                    error
                );

                // Local result is already saved,
                // so Progress will still work.
            }


            resolve();

        }
    );

});
}
// ======================================
// WAIT FOR FINAL EVALUATION
// ======================================

await runFinalInterviewEvaluation();


// ======================================
// FINAL AI RESULTS FOR UI
// ======================================

console.log(
    "🤖 Result page is ready after evaluation."
);

console.log(
    "Final Technical:",
    technicalScore
);

console.log(
    "Final Communication:",
    communicationScore
);

console.log(
    "Final Confidence:",
    confidenceScore
);

console.log(
    "Final Overall:",
    overallScore
);

console.log(
    "Final Percentage:",
    overallPercentage
);

// ======================================
// DISPLAY PERCENTAGE
// ======================================

if (percentageElement) {

    percentageElement.textContent =
        `${overallPercentage}%`;
}

// ======================================
// DISPLAY OVERALL SCORE OUT OF 10
// ======================================

if (scoreElement) {

    scoreElement.textContent =
        `${overallScore}/10`;
}

// ======================================
// AI PERFORMANCE DISPLAY
// ======================================

if (aiPercentageElement) {

    aiPercentageElement.textContent =
        `${overallPercentage}%`;
}

if (aiLevelElement) {

    if (overallPercentage >= 80) {

        aiLevelElement.textContent =
            "Excellent Performance";

    } else if (overallPercentage >= 60) {

        aiLevelElement.textContent =
            "Good Performance";

    } else if (overallPercentage >= 40) {

        aiLevelElement.textContent =
            "Needs Improvement";

    } else {

        aiLevelElement.textContent =
            "Keep Practicing";

    }
}

if (aiScoreCircle) {

    aiScoreCircle.style.background =
        `conic-gradient(
            #2563eb ${overallPercentage}%,
            #e5e7eb ${overallPercentage}%
        )`;
}


// ======================================
// DISPLAY TECHNICAL SCORE
// ======================================

if (technicalScoreElement) {

    technicalScoreElement.textContent =
        `${technicalScore}/10`;
}


if (technicalFeedbackElement) {

    if (technicalScore >= 8) {

        technicalFeedbackElement.textContent =
            "Strong technical knowledge";

    } else if (technicalScore >= 5) {

        technicalFeedbackElement.textContent =
            "Good, but needs more practice";

    } else {

        technicalFeedbackElement.textContent =
            "Needs more technical practice";
    }
}


// ======================================
// DISPLAY COMMUNICATION SCORE
// ======================================

if (communicationScoreElement) {

    communicationScoreElement.textContent =
        `${communicationScore}/10`;
}


if (communicationFeedbackElement) {

    if (communicationScore >= 8) {

        communicationFeedbackElement.textContent =
            "Clear and well-structured communication";

    } else if (communicationScore >= 5) {

        communicationFeedbackElement.textContent =
            "Good communication, but can be clearer";

    } else {

        communicationFeedbackElement.textContent =
            "Work on clarity and complete explanations";
    }
}


// ======================================
// DISPLAY CONFIDENCE SCORE
// ======================================

if (confidenceScoreElement) {

    confidenceScoreElement.textContent =
        `${confidenceScore}/10`;
}


if (confidenceFeedbackElement) {

    if (confidenceScore >= 8) {

        confidenceFeedbackElement.textContent =
            "Excellent confidence";

    } else if (confidenceScore >= 5) {

        confidenceFeedbackElement.textContent =
            "Good confidence, keep improving";

    } else {

        confidenceFeedbackElement.textContent =
            "Work on confidence and answer delivery";
    }
}


// ======================================
// OVERALL MESSAGE
// ======================================

if (resultMessage) {

    if (overallPercentage >= 80) {

        resultMessage.textContent =
            "Excellent! You performed very well.";

    } else if (overallPercentage >= 60) {

        resultMessage.textContent =
            "Good job! Keep practicing to improve further.";

    } else if (overallPercentage >= 40) {

        resultMessage.textContent =
            "Good attempt! More practice will improve your performance.";

    } else {

        resultMessage.textContent =
            "Keep practicing! Focus on technical knowledge and clear communication.";
    }
}

// ======================================
// DYNAMIC STRENGTHS & IMPROVEMENTS
// ======================================

const strengthsList =
    document.querySelector(".strengths-card ul");

const improvementList =
    document.querySelector(".improvement-card ul");


// ======================================
// STRENGTHS
// ======================================

if (strengthsList) {

    strengthsList.innerHTML = "";

    if (technicalScore >= 8) {

        strengthsList.innerHTML +=
            "<li>Strong technical knowledge</li>";

    }

    if (communicationScore >= 8) {

        strengthsList.innerHTML +=
            "<li>Clear and effective communication</li>";

    }

    if (confidenceScore >= 8) {

        strengthsList.innerHTML +=
            "<li>Good confidence while answering</li>";

    }

    if (technicalScore >= 6) {

        strengthsList.innerHTML +=
            "<li>Good understanding of technical concepts</li>";

    }

    // If no major strength
    if (strengthsList.children.length === 0) {

        strengthsList.innerHTML =
            "<li>Good attempt and willingness to learn</li>";
    }
}


// ======================================
// NEEDS IMPROVEMENT
// ======================================

if (improvementList) {

    improvementList.innerHTML = "";

    if (technicalScore < 8) {

        improvementList.innerHTML +=
            "<li>Improve technical knowledge and practice more questions</li>";
    }

    if (communicationScore < 8) {

        improvementList.innerHTML +=
            "<li>Improve clarity and explanation while answering</li>";
    }

    if (confidenceScore < 8) {

        improvementList.innerHTML +=
            "<li>Build more confidence while answering</li>";
    }

    if (technicalScore < 6) {

        improvementList.innerHTML +=
            "<li>Focus on understanding concepts before memorizing answers</li>";
    }

    // If everything is good
    if (improvementList.children.length === 0) {

        improvementList.innerHTML =
            "<li>Keep practicing to maintain your performance</li>";
    }
}


// ======================================
// ANSWER REVIEW - ACCORDION
// ======================================

if (reviewContainer) {

    reviewContainer.innerHTML = "";

    answerResults.forEach((item, index) => {

        const answerCard =
            document.createElement("div");

        answerCard.className = "answer-card";

        answerCard.innerHTML = `
            <button class="answer-toggle" type="button">

                <span class="answer-question-title">
                    <span class="question-number">
                        ${index + 1}
                    </span>

                    <span>
                        Question ${index + 1}
                    </span>
                </span>

                <span class="answer-status">
                    ${
                        item.isCorrect
                            ? "✓ Correct"
                            : "✗ Needs Improvement"
                    }
                </span>

                <span class="answer-arrow">
                    ›
                </span>

            </button>

            <div class="answer-content">

                <p class="question"></p>

                <div class="answer-box user-answer-box">

                    <strong>Your Answer</strong>

                    <span class="user-answer-text"></span>

                </div>

                <div class="answer-box model-answer-box">

                    <strong>Model Answer</strong>

                    <span class="model-answer-text"></span>

                </div>

            </div>
        `;


        // ----------------------------------
        // QUESTION TEXT
        // ----------------------------------

        const questionElement =
            answerCard.querySelector(".question");

        questionElement.textContent =
            item.question;


        // ----------------------------------
        // USER ANSWER
        // ----------------------------------

        const userAnswerElement =
            answerCard.querySelector(".user-answer-text");

        userAnswerElement.textContent =
            item.userAnswer || "Not answered";


        // ----------------------------------
        // MODEL ANSWER
        // ----------------------------------

        const modelAnswerElement =
            answerCard.querySelector(".model-answer-text");

        modelAnswerElement.textContent =
            item.correctAnswer;


        // ----------------------------------
        // ACCORDION CLICK
        // ----------------------------------

        const toggleButton =
            answerCard.querySelector(".answer-toggle");

        toggleButton.addEventListener("click", function () {

            answerCard.classList.toggle("open");

        });


        reviewContainer.appendChild(answerCard);

    });

}

// ======================================
// CONSOLE INFORMATION
// ======================================

console.log("Interview Category:", category);

console.log("Interview Difficulty:", difficulty);

console.log("Technical Score:", technicalScore);

console.log("Communication Score:", communicationScore);

console.log("Confidence Score:", confidenceScore);

console.log("Overall Score:", overallScore);

console.log("Overall Percentage:", overallPercentage);

// ======================================
// PROFILE + NOTIFICATION DROPDOWN
// ======================================

const profileButton =
    document.getElementById("profile-button");

const profileDropdown =
    document.getElementById("profile-dropdown");

const notificationButton =
    document.getElementById("notification-button");

const notificationDropdown =
    document.getElementById("notification-dropdown");


// ======================================
// PROFILE BUTTON
// ======================================

if (profileButton && profileDropdown) {

    profileButton.addEventListener("click", function (event) {

        event.stopPropagation();

        if (notificationDropdown) {
            notificationDropdown.classList.remove("show");
        }

        profileDropdown.classList.toggle("show");

    });

}


// ======================================
// NOTIFICATION BUTTON
// ======================================

if (notificationButton && notificationDropdown) {

    notificationButton.addEventListener("click", function (event) {

        event.stopPropagation();

        if (profileDropdown) {
            profileDropdown.classList.remove("show");
        }

        notificationDropdown.classList.toggle("show");

    });

}


// ======================================
// PREVENT DROPDOWN CLOSE
// ======================================

if (profileDropdown) {

    profileDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });

}

if (notificationDropdown) {

    notificationDropdown.addEventListener("click", function (event) {
        event.stopPropagation();
    });

}


// ======================================
// CLOSE WHEN CLICKING OUTSIDE
// ======================================

document.addEventListener("click", function () {

    if (profileDropdown) {
        profileDropdown.classList.remove("show");
    }

    if (notificationDropdown) {
        notificationDropdown.classList.remove("show");
    }

});
// ======================================
// LOGOUT
// ======================================

const logoutButton =
    document.getElementById("logout-button");

if (logoutButton) {

    logoutButton.addEventListener("click", async function () {

        try {

            await signOut(auth);

            localStorage.removeItem("isLoggedIn");

            sessionStorage.clear();

            window.location.replace("login.html");

        } catch (error) {

            console.error("Logout Error:", error);

            alert("Logout failed. Please try again.");

        }

    });

}
// ======================================
// PRACTICE AGAIN
// ======================================

const practiceAgainButton =
    document.getElementById(
        "practice-again-button"
    );

if (practiceAgainButton) {

    practiceAgainButton.addEventListener(
        "click",
        function () {

            const category =
                localStorage.getItem(
                    "interviewCategory"
                ) || "HTML";

            const difficulty =
                localStorage.getItem(
                    "interviewDifficulty"
                ) || "Easy";


            const technicalInterviewUrl =
                `technical-interview.html?category=${encodeURIComponent(category)}&difficulty=${encodeURIComponent(difficulty)}`;


            practiceAgainButton.href =
                technicalInterviewUrl;

        }
    );

}