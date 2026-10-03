// ======================================
// PRACTICESMARTER - OVERALL WEAK TOPICS
// ======================================

import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


// ======================================
// FIREBASE CONFIG
// ======================================

const firebaseConfig = {
    apiKey: "AIzaSyDnR_HHjMjsUanr0ZIC1uwyEDJQ2aVxqTU",
    authDomain: "ai-interview-practice-pl-acc38.firebaseapp.com",
    projectId: "ai-interview-practice-pl-acc38",
    storageBucket: "ai-interview-practice-pl-acc38.firebasestorage.app",
    messagingSenderId: "64194969019",
    appId: "1:64194969019:web:83b2addcd10f5a9f74989e",
    measurementId: "G-PL54GCRDF6"
};


// ======================================
// FIREBASE INITIALIZATION
// ======================================

const app =
    getApps().length > 0
        ? getApp()
        : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


// ======================================
// TOPIC ADVICE
// ======================================

const advice = {

    "Semantic HTML":
        "Review semantic elements and practice accessible page structures.",

    "Forms & Inputs":
        "Practice HTML forms, input types and validation.",

    "HTML Attributes":
        "Review commonly used HTML attributes and their purposes.",

    "Multimedia":
        "Practice images, audio, video and embedded content.",

    "Accessibility":
        "Review ARIA basics and accessible HTML practices.",

    "Flexbox":
        "Practice alignment, direction, wrapping and responsive layouts.",

    "CSS Grid":
        "Practice grid columns, rows, areas and responsive layouts.",

    "Box Model":
        "Review margin, padding, border and content with examples.",

    "Selectors & Specificity":
        "Practice selectors, specificity and pseudo-classes.",

    "Responsive Design":
        "Practice media queries and responsive layouts.",

    "Variables & Scope":
        "Review var, let, const, scope and hoisting.",

    "Functions & Closures":
        "Practice functions, callbacks, arrow functions and closures.",

    "DOM & Events":
        "Practice DOM selection, manipulation and event handling.",

    "Async JavaScript":
        "Practice Promises, async/await and asynchronous operations.",

    "Arrays & Objects":
        "Practice array methods and object manipulation.",

    "Python Data Types":
        "Review lists, tuples, sets and dictionaries.",

    "Functions":
        "Practice function definitions, parameters and return values.",

    "Object-Oriented Programming":
        "Review classes, objects and the main OOP concepts.",

    "Exception Handling":
        "Practice exception handling with real examples.",

    "Modules & Packages":
        "Review modules, packages and imports.",

    "OOP Concepts":
        "Review inheritance, polymorphism, abstraction and encapsulation.",

    "Collections":
        "Practice Java collections and choosing the right collection.",

    "Interfaces & Abstraction":
        "Review interfaces, abstract classes and abstraction.",

    "Multithreading":
        "Review threads, synchronization and concurrency.",

    "Self Introduction":
        "Practice a clear, structured self-introduction.",

    "Strengths & Weaknesses":
        "Prepare specific examples for your strengths and improvement areas.",

    "Career Goals":
        "Practice explaining your short-term and long-term goals.",

    "Behavioral Questions":
        "Practice behavioral questions using real examples.",

    "Company & Role":
        "Practice explaining your interest in the company and role.",

    "Core Concepts":
        "Review the core concepts of this interview category and practice related questions."
};


// ======================================
// GET CONTAINER
// ======================================

const container =
    document.getElementById(
        "overall-weak-topic-container"
    );


// ======================================
// SHOW MESSAGE
// ======================================

function showMessage(icon, message) {

    if (!container) {
        return;
    }

    container.innerHTML = `

        <div class="overall-weak-empty">

            <span>
                ${icon}
            </span>

            <p>
                ${message}
            </p>

        </div>

    `;
}


// ======================================
// ADD TOPIC DATA
// ======================================

function addTopicData(
    topicData,
    topic,
    sessionId,
    count
) {

    if (!topic || !sessionId) {
        return;
    }

    if (!topicData[topic]) {

        topicData[topic] = {

            interviews: new Set(),

            questions: 0

        };

    }

    topicData[topic]
        .interviews
        .add(sessionId);

    topicData[topic]
        .questions +=
        Number(count) || 1;
}


// ======================================
// LOAD FIRESTORE WEAK TOPICS
// ======================================

async function loadFirestoreWeakTopics(userId) {

    const topicData = {};

    try {

        const resultsQuery =
            query(
                collection(
                    db,
                    "interviewResults"
                ),

                where(
                    "userId",
                    "==",
                    userId
                )
            );


        const snapshot =
            await getDocs(
                resultsQuery
            );


        let analyzedInterviews = 0;


        snapshot.forEach(
            documentSnapshot => {

                const result =
                    documentSnapshot.data();


                if (
                    !Array.isArray(
                        result.weakTopics
                    ) ||
                    result.weakTopics.length === 0
                ) {
                    return;
                }


                const sessionId =
                    result.sessionId ||
                    documentSnapshot.id;


                analyzedInterviews++;


                result.weakTopics.forEach(
                    item => {

                        if (
                            !item ||
                            !item.topic
                        ) {
                            return;
                        }


                        addTopicData(
                            topicData,
                            String(
                                item.topic
                            ).trim(),
                            sessionId,
                            item.count
                        );

                    }
                );

            }
        );


        return {
            topicData,
            analyzedInterviews
        };


    } catch (error) {

        console.error(
            "❌ Firestore weak topic loading failed:",
            error
        );

        throw error;

    }
}


// ======================================
// LOAD LOCAL WEAK TOPIC HISTORY
// ======================================

function loadLocalWeakTopicHistory(
    topicData,
    firestoreSessions
) {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "weakTopicHistory"
                )
            ) || [];


        if (!Array.isArray(saved)) {
            return 0;
        }


        let addedInterviews = 0;


        saved.forEach(record => {

            if (!record) {
                return;
            }


            const sessionId =
                record.sessionId;


            if (!sessionId) {
                return;
            }


            /*
             * If Firestore already contains
             * this session, do not count it twice.
             */

            if (
                firestoreSessions.has(
                    sessionId
                )
            ) {
                return;
            }


            if (
                !Array.isArray(
                    record.topics
                )
            ) {
                return;
            }


            addedInterviews++;


            record.topics.forEach(item => {

                if (
                    !item ||
                    !item.topic
                ) {
                    return;
                }


                addTopicData(
                    topicData,
                    String(
                        item.topic
                    ).trim(),
                    sessionId,
                    item.count
                );

            });

        });


        return addedInterviews;


    } catch (error) {

        console.error(
            "❌ Local weak topic history error:",
            error
        );

        return 0;

    }

}


// ======================================
// DISPLAY WEAK TOPICS
// ======================================

function displayWeakTopics(
    topicData,
    analyzedInterviews
) {

    if (!container) {
        return;
    }


    const recurringTopics =
        Object.entries(
            topicData
        )
        .filter(
            ([, data]) =>
                data.interviews.size >= 2
        )
        .sort(
            (a, b) => {

                const interviewDifference =
                    b[1].interviews.size -
                    a[1].interviews.size;


                if (
                    interviewDifference !== 0
                ) {
                    return interviewDifference;
                }


                return (
                    b[1].questions -
                    a[1].questions
                );

            }
        )
        .slice(0, 3);


    // ==================================
    // NO TOPIC DATA
    // ==================================

    if (
        Object.keys(topicData).length === 0
    ) {

        showMessage(
            "🔍",
            "Complete a few new interviews to build your overall weak-topic analysis."
        );

        return;
    }


    // ==================================
    // NO RECURRING TOPICS
    // ==================================

    if (
        recurringTopics.length === 0
    ) {

        showMessage(
            "🌟",
            `No recurring weak topics detected across your available topic-analyzed interviews.`
        );

        return;
    }


    // ==================================
    // DISPLAY CARDS
    // ==================================

    container.innerHTML =
        recurringTopics
            .map(
                ([topic, data]) => {

                    const interviewCount =
                        data.interviews.size;


                    const questionCount =
                        data.questions;


                    const topicAdvice =
                        advice[topic] ||
                        advice["Core Concepts"];


                    return `

                        <div class="overall-weak-topic-card">

                            <div class="overall-weak-topic-icon">
                                🎯
                            </div>

                            <strong>
                                ${topic}
                            </strong>

                            <p>
                                ${topicAdvice}
                            </p>

                            <span class="overall-weak-topic-count">
                                Weak in
                                ${interviewCount}
                                interviews
                                •
                                ${questionCount}
                                difficult
                                ${questionCount === 1 ? "question" : "questions"}
                            </span>

                        </div>

                    `;

                }
            )
            .join("");

}


// ======================================
// MAIN ANALYSIS
// ======================================

async function startOverallWeakTopicAnalysis(
    user
) {

    if (!user) {

        showMessage(
            "🔐",
            "Please log in to view your overall weak-topic analysis."
        );

        return;
    }


    try {

        const firestoreData =
            await loadFirestoreWeakTopics(
                user.uid
            );


        const topicData =
            firestoreData.topicData;


        const firestoreSessions =
            new Set();


        /*
         * Collect sessions from topic data
         * so local history does not duplicate them.
         */

        Object.values(
            topicData
        ).forEach(data => {

            data.interviews.forEach(
                sessionId => {

                    firestoreSessions.add(
                        sessionId
                    );

                }
            );

        });


        const localInterviewCount =
            loadLocalWeakTopicHistory(
                topicData,
                firestoreSessions
            );


        const totalAnalyzed =
            firestoreData.analyzedInterviews +
            localInterviewCount;


        console.log(
            "🧠 Overall Weak Topic Analysis"
        );

        console.log(
            "Analyzed Interviews:",
            totalAnalyzed
        );

        console.log(
            "Topic Data:",
            topicData
        );


        displayWeakTopics(
            topicData,
            totalAnalyzed
        );


    } catch (error) {

        console.error(
            "❌ Overall weak topic analysis failed:",
            error
        );


        showMessage(
            "⚠️",
            "Overall topic analysis is temporarily unavailable."
        );

    }

}


// ======================================
// AUTH CHECK
// ======================================

onAuthStateChanged(
    auth,
    user => {

        startOverallWeakTopicAnalysis(
            user
        );

    }
);