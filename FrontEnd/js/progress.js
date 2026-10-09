// ======================================
// FIREBASE
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


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ======================================
// GET HTML ELEMENTS
// ======================================

const totalInterviews =
    document.getElementById("total-interviews");

const averageScore =
    document.getElementById("average-score");

const bestScore =
    document.getElementById("best-score");

const practiceStreak =
    document.getElementById("practice-streak");

const frontendScore =
    document.getElementById("frontend-score");

const javascriptScore =
    document.getElementById("javascript-score");

const htmlCssScore =
    document.getElementById("html-css-score");

const hrScore =
    document.getElementById("hr-score");

const historyContainer =
    document.getElementById("history-container");


// ======================================
// FIRESTORE RESULTS
// ======================================

let interviewScores = [];

// ======================================
// FIREBASE AUTH STATE
// FIRESTORE + LOCALSTORAGE SUPPORT
// ======================================

onAuthStateChanged(auth, async (user) => {

    // ======================================
    // FIREBASE USER AVAILABLE
    // ======================================

    if (user) {

        console.log(
            "✅ Firebase user logged in:",
            user.uid
        );

        await loadInterviewResults(user.uid);

        return;
    }


    // ======================================
    // FIREBASE USER NOT AVAILABLE
    // LOAD EXISTING LOCAL RESULTS
    // ======================================

    console.warn(
        "⚠️ No Firebase user detected. Loading saved interview results..."
    );


    const localResults =
        JSON.parse(
            localStorage.getItem("interviewScores")
        ) || [];


    if (Array.isArray(localResults)) {

        interviewScores =
            localResults.filter(
                interview =>
                    interview &&
                    Number(interview.overall) > 0
            );

    } else {

        interviewScores = [];

    }


    // ======================================
    // SORT NEWEST → OLDEST
    // ======================================

    interviewScores.sort((a, b) => {

        const dateA =
            getTimestampValue(
                a.createdAt || a.date
            );

        const dateB =
            getTimestampValue(
                b.createdAt || b.date
            );

        return dateB - dateA;

    });


    console.log(
        "✅ Progress loaded from localStorage:",
        interviewScores
    );


    // ======================================
    // UPDATE PROGRESS PAGE
    // ======================================

    updateProgressPage();

});


    

// ======================================
// LOAD USER INTERVIEW RESULTS
// ======================================
// ======================================
// LOAD USER INTERVIEW RESULTS
// FIRESTORE + LOCALSTORAGE FALLBACK
// ======================================

async function loadInterviewResults(userId) {

    try {

        const resultsQuery = query(
            collection(db, "interviewResults"),
            where("userId", "==", userId)
        );

        const snapshot =
            await getDocs(resultsQuery);

        interviewScores = [];

        snapshot.forEach((documentSnapshot) => {

            interviewScores.push({

                id: documentSnapshot.id,

                ...documentSnapshot.data()

            });

        });

        // ======================================
        // FIRESTORE DATA AVAILABLE
        // ======================================

        if (interviewScores.length > 0) {

            console.log(
                "✅ Progress loaded from Firestore:",
                interviewScores
            );

        } else {

            // ======================================
            // LOCALSTORAGE FALLBACK
            // ======================================

            console.warn(
                "⚠️ No Firestore results found. Loading localStorage..."
            );

            const localResults =
                JSON.parse(
                    localStorage.getItem("interviewScores")
                ) || [];

            if (Array.isArray(localResults)) {

                interviewScores =
                    localResults.filter(
                        interview =>
                            interview &&
                            Number(interview.overall) > 0
                    );

            }

            console.log(
                "✅ Progress loaded from localStorage:",
                interviewScores
            );

        }

        // ======================================
        // SORT NEWEST → OLDEST
        // ======================================

        interviewScores.sort((a, b) => {

            const dateA =
                getTimestampValue(
                    a.createdAt || a.date
                );

            const dateB =
                getTimestampValue(
                    b.createdAt || b.date
                );

            return dateB - dateA;

        });

        // ======================================
        // UPDATE PAGE
        // ======================================

        updateProgressPage();

    } catch (error) {

        console.error(
            "❌ Firestore loading failed:",
            error
        );

        // ======================================
        // LOCALSTORAGE FALLBACK ON ERROR
        // ======================================

        const localResults =
            JSON.parse(
                localStorage.getItem("interviewScores")
            ) || [];

        if (Array.isArray(localResults)) {

            interviewScores =
                localResults.filter(
                    interview =>
                        interview &&
                        Number(interview.overall) > 0
                );

        } else {

            interviewScores = [];

        }

        console.log(
            "✅ Progress fallback data:",
            interviewScores
        );

        updateProgressPage();

    }

}


// ======================================
// GET TIMESTAMP VALUE
// ======================================

function getTimestampValue(date) {

    if (!date) {

        return 0;

    }


    // Firestore Timestamp

    if (
        typeof date.toMillis === "function"
    ) {

        return date.toMillis();

    }


    // Firestore Timestamp-like object

    if (
        typeof date.seconds === "number"
    ) {

        return date.seconds * 1000;

    }


    // JavaScript Date

    if (date instanceof Date) {

        return date.getTime();

    }


    // String date

    if (typeof date === "string") {

        const parsedDate =
            new Date(date).getTime();

        return isNaN(parsedDate)
            ? 0
            : parsedDate;

    }


    return 0;

}


// ======================================
// FORMAT DATE
// ======================================

function formatInterviewDate(date) {

    if (!date) {

        return "";

    }


    // Firestore Timestamp

    if (
        typeof date.toDate === "function"
    ) {

        return date.toDate().toLocaleString(
            [],
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    }


    // Firestore Timestamp-like object

    if (
        typeof date.seconds === "number"
    ) {

        return new Date(
            date.seconds * 1000
        ).toLocaleString(
            [],
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    }


    // String date

    if (typeof date === "string") {

        const parsedDate = new Date(date);

        if (!isNaN(parsedDate.getTime())) {

            return parsedDate.toLocaleString(
                [],
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            );

        }

        return date;

    }


    return "";

}


// ======================================
// GET SCORE
// ======================================

function getScore(interview) {

    if (typeof interview === "number") {
        return Number(interview) || 0;
    }

    if (interview && interview.overall !== undefined) {
        return Number(interview.overall) || 0;
    }

    return 0;
}


// ======================================
// PRACTICE STREAK
// ======================================

function calculatePracticeStreak() {

    if (interviewScores.length === 0) {
        return 0;
    }

    // --------------------------------------
    // Convert each interview timestamp
    // into Indian local date (YYYY-MM-DD)
    // --------------------------------------

    const dateSet = new Set();

    interviewScores.forEach(interview => {

        const dateValue =
            interview.createdAt ||
            interview.date;

        if (!dateValue) {
            return;
        }

        let timestamp = 0;

        // Firestore Timestamp
        if (
            typeof dateValue.toMillis === "function"
        ) {
            timestamp = dateValue.toMillis();

        // Firestore Timestamp-like object
        } else if (
            typeof dateValue.seconds === "number"
        ) {
            timestamp = dateValue.seconds * 1000;

        // JavaScript Date
        } else if (
            dateValue instanceof Date
        ) {
            timestamp = dateValue.getTime();

        // String date
        } else if (
            typeof dateValue === "string"
        ) {
            timestamp = new Date(dateValue).getTime();
        }

        if (!timestamp || isNaN(timestamp)) {
            return;
        }

        // --------------------------------------
        // Convert to India date
        // --------------------------------------

        const indiaDate =
            new Intl.DateTimeFormat("en-CA", {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }).format(new Date(timestamp));

        dateSet.add(indiaDate);

    });


    if (dateSet.size === 0) {
        return 0;
    }


    // --------------------------------------
    // Sort dates newest → oldest
    // --------------------------------------

    const uniqueDates =
        Array.from(dateSet).sort(
            (a, b) =>
                new Date(b + "T00:00:00Z") -
                new Date(a + "T00:00:00Z")
        );


    // --------------------------------------
    // Get today's date in India
    // --------------------------------------

    const today =
        new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(new Date());


    // --------------------------------------
    // Latest practice must be today
    // --------------------------------------

    if (uniqueDates[0] !== today) {
        return 0;
    }


    // --------------------------------------
    // Calculate consecutive days
    // --------------------------------------

    let streak = 1;

    for (
        let i = 0;
        i < uniqueDates.length - 1;
        i++
    ) {

        const currentDate =
            new Date(
                uniqueDates[i] + "T00:00:00Z"
            );

        const previousDate =
            new Date(
                uniqueDates[i + 1] + "T00:00:00Z"
            );


        const difference =
            Math.round(
                (
                    currentDate -
                    previousDate
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        if (difference === 1) {

            streak++;

        } else {

            break;

        }

    }
    console.log("📅 Practice Dates:", uniqueDates);
console.log("🔥 Calculated Practice Streak:", streak);

return streak;

}

// ======================================
// UPDATE PROGRESS PAGE
// ======================================

function updateProgressPage() {

    const total =
        interviewScores.length;


    // ======================================
    // TOTAL INTERVIEWS
    // ======================================

    if (totalInterviews) {

        totalInterviews.textContent =
            total;

    }


    // ======================================
    // AVERAGE SCORE
    // ======================================

    let average = 0;


    if (total > 0) {

        const totalScore =
            interviewScores.reduce(
                (sum, interview) => {

                    return (
                        sum +
                        getScore(interview)
                    );

                },
                0
            );


        average =
            Math.round(
                totalScore / total
            );

    }


    if (averageScore) {

        averageScore.textContent =
            `${average}%`;

    }


    // ======================================
    // BEST SCORE
    // ======================================

    let best = 0;


    if (total > 0) {

        best =
            Math.max(
                ...interviewScores.map(
                    interview =>
                        getScore(interview)
                )
            );

    }


    if (bestScore) {

        bestScore.textContent =
            `${best}%`;

    }


    // ======================================
    // PRACTICE STREAK
    // ======================================

    const streak =
        calculatePracticeStreak();


    if (practiceStreak) {

        practiceStreak.textContent =
            `${streak} ${
                streak === 1
                    ? "Day"
                    : "Days"
            }`;

    }


    // ======================================
    // CATEGORY AVERAGE
    // ======================================

    function getCategoryAverage(categoryName) {

        const categoryResults =
            interviewScores.filter(
                interview =>
                    interview.category === categoryName
            );


        if (
            categoryResults.length === 0
        ) {

            return 0;

        }


        const totalScore =
            categoryResults.reduce(
                (sum, interview) =>
                    sum +
                    getScore(interview),
                0
            );


        return Math.round(
            totalScore /
            categoryResults.length
        );

    }


    // ======================================
    // PERFORMANCE STATUS
    // ======================================

    function getPerformanceStatus(score) {

        if (score === 0) {

            return "No Practice Yet";

        }


        if (score >= 85) {

            return "Excellent";

        }


        if (score >= 70) {

            return "Good";

        }


        if (score >= 50) {

            return "Needs Improvement";

        }


        return "Needs More Practice";

    }


    // ======================================
    // CATEGORY SCORES
    // ======================================

    const javascriptAverage =
        getCategoryAverage("JavaScript");

    const htmlAverage =
        getCategoryAverage("HTML");

    const cssAverage =
        getCategoryAverage("CSS");

    const hrAverage =
        getCategoryAverage("HR Interview");


    // ======================================
    // FRONTEND AVERAGE
    // ======================================

    const frontendCategories = [

        javascriptAverage,

        htmlAverage,

        cssAverage

    ].filter(
        score => score > 0
    );


    let frontendAverage = 0;


    if (
        frontendCategories.length > 0
    ) {

        frontendAverage =
            Math.round(
                frontendCategories.reduce(
                    (sum, score) =>
                        sum + score,
                    0
                ) /
                frontendCategories.length
            );

    }


    // ======================================
    // DISPLAY FRONTEND
    // ======================================

    if (frontendScore) {

        frontendScore.textContent =
            `${frontendAverage}%`;


        const progress =
            document.getElementById(
                "frontend-progress"
            );


        const status =
            document.getElementById(
                "frontend-status"
            );


        if (progress) {

            progress.style.width =
                `${frontendAverage}%`;

        }


        if (status) {

            status.textContent =
                getPerformanceStatus(
                    frontendAverage
                );

        }

    }


    // ======================================
    // DISPLAY JAVASCRIPT
    // ======================================

    if (javascriptScore) {

        javascriptScore.textContent =
            `${javascriptAverage}%`;


        const progress =
            document.getElementById(
                "javascript-progress"
            );


        const status =
            document.getElementById(
                "javascript-status"
            );


        if (progress) {

            progress.style.width =
                `${javascriptAverage}%`;

        }


        if (status) {

            status.textContent =
                getPerformanceStatus(
                    javascriptAverage
                );

        }

    }


    // ======================================
    // HTML + CSS
    // ======================================

    if (htmlCssScore) {

        const htmlCssValues = [

            htmlAverage,

            cssAverage

        ].filter(
            score => score > 0
        );


        let htmlCssAverage = 0;


        if (
            htmlCssValues.length > 0
        ) {

            htmlCssAverage =
                Math.round(
                    htmlCssValues.reduce(
                        (sum, score) =>
                            sum + score,
                        0
                    ) /
                    htmlCssValues.length
                );

        }


        htmlCssScore.textContent =
            `${htmlCssAverage}%`;


        const progress =
            document.getElementById(
                "html-css-progress"
            );


        const status =
            document.getElementById(
                "html-css-status"
            );


        if (progress) {

            progress.style.width =
                `${htmlCssAverage}%`;

        }


        if (status) {

            status.textContent =
                getPerformanceStatus(
                    htmlCssAverage
                );

        }

    }


    // ======================================
    // HR INTERVIEW
    // ======================================

    if (hrScore) {

        hrScore.textContent =
            `${hrAverage}%`;


        const progress =
            document.getElementById(
                "hr-progress"
            );


        const status =
            document.getElementById(
                "hr-status"
            );


        if (progress) {

            progress.style.width =
                `${hrAverage}%`;

        }


        if (status) {

            status.textContent =
                getPerformanceStatus(
                    hrAverage
                );

        }

    }

    // ======================================
// ADVANCED PERFORMANCE ANALYTICS
// ======================================


// ======================================
// SKILL BREAKDOWN
// ======================================

function calculateSkillAverage(field) {

    const values = interviewScores
        .map(interview => Number(interview[field]))
        .filter(value => !isNaN(value) && value > 0);

    if (values.length === 0) {
        return 0;
    }

    return (
        values.reduce(
            (sum, value) => sum + value,
            0
        ) / values.length
    );

}


const technicalAverage =
    calculateSkillAverage("technical");

const communicationAverage =
    calculateSkillAverage("communication");

const confidenceAverage =
    calculateSkillAverage("confidence");


// ======================================
// DISPLAY SKILL AVERAGES
// ======================================

const technicalAverageElement =
    document.getElementById(
        "technical-average"
    );

const communicationAverageElement =
    document.getElementById(
        "communication-average"
    );

const confidenceAverageElement =
    document.getElementById(
        "confidence-average"
    );


if (technicalAverageElement) {

    technicalAverageElement.textContent =
        `${technicalAverage.toFixed(1)}/10`;

}


if (communicationAverageElement) {

    communicationAverageElement.textContent =
        `${communicationAverage.toFixed(1)}/10`;

}


if (confidenceAverageElement) {

    confidenceAverageElement.textContent =
        `${confidenceAverage.toFixed(1)}/10`;

}


// ======================================
// SKILL PROGRESS BARS
// ======================================

const technicalBar =
    document.getElementById(
        "technical-bar"
    );

const communicationBar =
    document.getElementById(
        "communication-bar"
    );

const confidenceBar =
    document.getElementById(
        "confidence-bar"
    );


if (technicalBar) {

    technicalBar.style.width =
        `${technicalAverage * 10}%`;

}


if (communicationBar) {

    communicationBar.style.width =
        `${communicationAverage * 10}%`;

}


if (confidenceBar) {

    confidenceBar.style.width =
        `${confidenceAverage * 10}%`;

}


// ======================================
// SKILL MESSAGE
// ======================================

const skillMessage =
    document.getElementById(
        "skill-message"
    );


if (skillMessage) {

    if (interviewScores.length === 0) {

        skillMessage.textContent =
            "Your skill analysis will appear after completing interviews.";

    } else {

        const skillValues = {

            Technical: technicalAverage,

            Communication: communicationAverage,

            Confidence: confidenceAverage

        };


        const strongestSkill =
            Object.keys(skillValues).reduce(
                (best, skill) =>
                    skillValues[skill] >
                    skillValues[best]
                        ? skill
                        : best
            );


        const weakestSkill =
            Object.keys(skillValues).reduce(
                (weakest, skill) =>
                    skillValues[skill] <
                    skillValues[weakest]
                        ? skill
                        : weakest
            );


        skillMessage.textContent =
            `Strongest area: ${strongestSkill}. Focus more on improving ${weakestSkill}.`;

    }

}


// ======================================
// PERFORMANCE TREND
// ======================================

const trendChart =
    document.getElementById(
        "performance-trend"
    );

const trendMessage =
    document.getElementById(
        "trend-message"
    );


if (trendChart) {

    trendChart.innerHTML = "";


    if (interviewScores.length === 0) {

        if (trendMessage) {

            trendMessage.textContent =
                "Complete more interviews to see your performance trend.";

        }

    } else {

        /*
         * Use the latest 8 interviews.
         * Reverse them so the chart reads
         * oldest → newest.
         */

        const recentResults =
            interviewScores
                .slice(0, 8)
                .reverse();


        const maxScore = 100;


        recentResults.forEach(
            (interview, index) => {

                const score =
                    Math.max(
                        0,
                        Math.min(
                            maxScore,
                            getScore(interview)
                        )
                    );


                const bar =
                    document.createElement(
                        "div"
                    );


                bar.className =
                    "trend-bar-wrapper";


                bar.innerHTML = `

                    <div class="trend-score">
                        ${score}%
                    </div>

                    <div class="trend-bar-track">

                        <div
                            class="trend-bar"
                            style="height: ${score}%"
                        ></div>

                    </div>

                    <span class="trend-label">
                        #${index + 1}
                    </span>

                `;


                trendChart.appendChild(
                    bar
                );

            }
        );


        if (trendMessage) {

            if (recentResults.length < 2) {

                trendMessage.textContent =
                    "Complete another interview to see your performance trend.";

            } else {

                const oldestScore =
                    getScore(
                        recentResults[0]
                    );

                const latestScore =
                    getScore(
                        recentResults[
                            recentResults.length - 1
                        ]
                    );


                const difference =
                    latestScore -
                    oldestScore;


                if (difference > 0) {

                    trendMessage.textContent =
                        `Your recent performance has improved by ${Math.round(difference)} percentage points.`;

                } else if (difference < 0) {

                    trendMessage.textContent =
                        `Your recent performance is ${Math.round(Math.abs(difference))} percentage points lower than the earliest interview shown. Keep practicing consistently.`;

                } else {

                    trendMessage.textContent =
                        "Your recent performance is currently stable.";

                }

            }

        }

    }

}


    // ======================================
    // INTERVIEW HISTORY
    // ======================================

    if (historyContainer) {

        historyContainer.innerHTML = "";


        // ======================================
        // NO INTERVIEWS
        // ======================================

        if (
            interviewScores.length === 0
        ) {

            historyContainer.innerHTML = `

                <div class="history-card">

                    <div>

                        <h3>No interviews yet</h3>

                        <p>
                            Complete an interview
                            to see your history.
                        </p>

                    </div>

                </div>

            `;

        } else {


            // ======================================
            // GROUP BY CATEGORY
            // ======================================

            const groupedResults = {};


            interviewScores.forEach(
                interview => {

                    const category =
                        interview.category ||
                        "Interview";


                    if (
                        !groupedResults[category]
                    ) {

                        groupedResults[category] = [];

                    }


                    groupedResults[category].push(
                        interview
                    );

                }
            );


            // ======================================
            // CATEGORY ICONS
            // ======================================

            const categoryIcons = {

                HTML: "🌐",

                CSS: "🎨",

                JavaScript: "🟨",

                Python: "🐍",

                Java: "☕",

                "HR Interview": "👔"

            };


            // ======================================
            // CREATE CATEGORY CARDS
            // ======================================

            Object.keys(
                groupedResults
            ).forEach(category => {

                const results =
                    groupedResults[category];


                // ======================================
                // BEST SCORE
                // ======================================

                const bestCategoryScore =
                    Math.max(
                        ...results.map(
                            interview =>
                                getScore(interview)
                        )
                    );


                // ======================================
                // LATEST SCORE
                // ======================================

                const latestInterview =
                    results[0];


                const latestScore =
                    getScore(
                        latestInterview
                    );


                // ======================================
                // HISTORY CARD
                // ======================================

                const historyCard =
                    document.createElement(
                        "div"
                    );


                historyCard.className =
                    "history-summary-card";


                historyCard.innerHTML = `

                    <div class="history-summary-top">

                        <div class="history-category">

                            <span class="history-icon">
                                ${
                                    categoryIcons[category] ||
                                    "💼"
                                }
                            </span>

                            <div>

                                <h3>
                                    ${category}
                                </h3>

                                <p>
                                    ${results.length}
                                    ${
                                        results.length === 1
                                            ? "Attempt"
                                            : "Attempts"
                                    }
                                </p>

                            </div>

                        </div>


                        <div class="history-scores">

                            <div>

                                <span>Best</span>

                                <strong>
                                    ${bestCategoryScore}%
                                </strong>

                            </div>


                            <div>

                                <span>Latest</span>

                                <strong>
                                    ${latestScore}%
                                </strong>

                            </div>

                        </div>

                    </div>


                    <button
                        class="view-history-button"
                        type="button"
                    >
                        View Details →
                    </button>


                    <div
                        class="history-details"
                        style="display: none;"
                    >
                    </div>

                `;


                // ======================================
                // VIEW DETAILS
                // ======================================

                const viewButton =
                    historyCard.querySelector(
                        ".view-history-button"
                    );


                const detailsContainer =
                    historyCard.querySelector(
                        ".history-details"
                    );


                viewButton.addEventListener(
                    "click",
                    function () {

                        if (
                            detailsContainer.style.display ===
                            "none"
                        ) {

                            detailsContainer.innerHTML = "";


                            // Newest → Oldest

                            results.forEach(
                                (
                                    interview,
                                    index
                                ) => {

                                    const detail =
                                        document.createElement(
                                            "div"
                                        );


                                    detail.className =
                                        "history-detail-item";


                                    const date =
                                        interview.createdAt ||
                                        interview.date;


                                    detail.innerHTML = `

                                        <div>

                                            <strong>
                                                Attempt ${index + 1}
                                            </strong>

                                            <p>

                                                ${
                                                    interview.difficulty ||
                                                    "Interview"
                                                }

                                                ${
                                                    formatInterviewDate(
                                                        date
                                                    )
                                                        ? " • " +
                                                          formatInterviewDate(
                                                              date
                                                          )
                                                        : ""
                                                }

                                            </p>

                                        </div>


                                        <strong>
                                            ${getScore(interview)}%
                                        </strong>

                                    `;


                                    detailsContainer.appendChild(
                                        detail
                                    );

                                }
                            );


                            detailsContainer.style.display =
                                "block";


                            viewButton.textContent =
                                "Hide Details ↑";

                        } else {

                            detailsContainer.style.display =
                                "none";


                            viewButton.textContent =
                                "View Details →";

                        }

                    }
                );


                historyContainer.appendChild(
                    historyCard
                );

            });

        }

    }


    // ======================================
    // CONSOLE
    // ======================================

    console.log(
        "Interview Results:",
        interviewScores
    );

    console.log(
        "Total Interviews:",
        total
    );

    console.log(
        "Average Score:",
        average
    );

    console.log(
        "Best Score:",
        best
    );

    console.log(
        "JavaScript Score:",
        javascriptAverage
    );

    console.log(
        "HTML Score:",
        htmlAverage
    );

    console.log(
        "CSS Score:",
        cssAverage
    );

}


// ======================================
// PROFILE + NOTIFICATION DROPDOWN
// ======================================

const profileButton =
    document.getElementById(
        "profile-button"
    );

const profileDropdown =
    document.getElementById(
        "profile-dropdown"
    );

const notificationButton =
    document.getElementById(
        "notification-button"
    );

const notificationDropdown =
    document.getElementById(
        "notification-dropdown"
    );


// ======================================
// PROFILE BUTTON
// ======================================

if (
    profileButton &&
    profileDropdown
) {

    profileButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            if (notificationDropdown) {

                notificationDropdown.classList.remove(
                    "show"
                );

            }


            profileDropdown.classList.toggle(
                "show"
            );

        }
    );

}


// ======================================
// NOTIFICATION BUTTON
// ======================================

if (
    notificationButton &&
    notificationDropdown
) {

    notificationButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            if (profileDropdown) {

                profileDropdown.classList.remove(
                    "show"
                );

            }


            notificationDropdown.classList.toggle(
                "show"
            );

        }
    );

}


// ======================================
// CLICK INSIDE PROFILE
// ======================================

if (profileDropdown) {

    profileDropdown.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );

}


// ======================================
// CLICK INSIDE NOTIFICATION
// ======================================

if (notificationDropdown) {

    notificationDropdown.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );

}


// ======================================
// CLICK OUTSIDE
// ======================================

document.addEventListener(
    "click",
    function () {

        if (profileDropdown) {

            profileDropdown.classList.remove(
                "show"
            );

        }


        if (notificationDropdown) {

            notificationDropdown.classList.remove(
                "show"
            );

        }

    }
);


// ======================================
// LOGOUT
// ======================================

const logoutButton =
    document.getElementById(
        "logout-button"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                await signOut(auth);


                localStorage.removeItem(
                    "isLoggedIn"
                );


                sessionStorage.clear();


                window.location.replace(
                    "login.html"
                );

            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );


                alert(
                    "Logout failed. Please try again."
                );

            }

        }
    );

}
