
import {
    initializeApp,
    getApps,
    getApp
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
// LOGIN CHECK
// ======================================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("login.html");
}

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

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let interviewScores = [];

// ======================================
// HELPERS
// ======================================

function getTimestampValue(value) {
    if (!value) return 0;

    if (typeof value.toMillis === "function") {
        return value.toMillis();
    }

    if (typeof value.seconds === "number") {
        return value.seconds * 1000;
    }

    if (value instanceof Date) {
        return value.getTime();
    }

    if (typeof value === "string") {
        const timestamp = new Date(value).getTime();
        return Number.isNaN(timestamp) ? 0 : timestamp;
    }

    return 0;
}

function getScore(result) {
    const value = typeof result === "number"
        ? result
        : Number(result?.overall);

    return Number.isFinite(value) && value >= 0 ? value : 0;
}

function getLocalInterviewScores() {
    try {
        const saved = JSON.parse(
            localStorage.getItem("interviewScores") || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.error("Could not read local interview scores:", error);
        return [];
    }
}

function formatInterviewDate(result) {
    const value = result.createdAt || result.date;
    const timestamp = getTimestampValue(value);

    if (timestamp) {
        return new Intl.DateTimeFormat("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Kolkata"
        }).format(new Date(timestamp));
    }

    return typeof result.date === "string" ? result.date : "";
}

function calculatePracticeStreak(results) {
    const dateSet = new Set();

    results.forEach(result => {
        const timestamp = getTimestampValue(
            result.createdAt || result.date
        );

        if (!timestamp) return;

        const date = new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(new Date(timestamp));

        dateSet.add(date);
    });

    const dates = [...dateSet].sort().reverse();

    const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());

    if (!dates.length || dates[0] !== today) return 0;

    let streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {
        const current = new Date(`${dates[i]}T00:00:00Z`);
        const previous = new Date(`${dates[i + 1]}T00:00:00Z`);

        if (Math.round((current - previous) / 86400000) !== 1) {
            break;
        }

        streak++;
    }

    return streak;
}

// ======================================
// LOAD INTERVIEW RESULTS
// ======================================

async function loadDashboardResults(user) {
    try {
        if (user) {
            const resultsQuery = query(
                collection(db, "interviewResults"),
                where("userId", "==", user.uid)
            );

            const snapshot = await getDocs(resultsQuery);

            interviewScores = snapshot.docs.map(document => ({
                id: document.id,
                ...document.data()
            }));

            // Use local results only when Firestore has no records.
            if (interviewScores.length === 0) {
                interviewScores = getLocalInterviewScores();
            }
        } else {
            interviewScores = getLocalInterviewScores();
        }
    } catch (error) {
        console.error("Firestore dashboard loading failed:", error);
        interviewScores = getLocalInterviewScores();
    }

    interviewScores.sort((a, b) =>
        getTimestampValue(b.createdAt || b.date) -
        getTimestampValue(a.createdAt || a.date)
    );

    const scores = interviewScores.map(getScore);
    const total = interviewScores.length;

    const average = scores.length
        ? Math.round(
            scores.reduce((sum, score) => sum + score, 0) /
            scores.length
        )
        : 0;

    const best = scores.length ? Math.max(...scores) : 0;
    const streak = calculatePracticeStreak(interviewScores);

    updateDashboardStats({
        interviewScores,
        scores,
        total,
        average,
        best,
        streak
    });
}

// ======================================
// UPDATE ALL DASHBOARD CONTENT
// ======================================

function updateDashboardStats({
    interviewScores,
    scores,
    total,
    average,
    best,
    streak
}) {
    // Main statistics cards
    const totalElement = document.getElementById("dashboard-total");
    const averageElement = document.getElementById("dashboard-average");
    const streakElement = document.getElementById("dashboard-streak");
    const bestElement = document.getElementById("dashboard-best");

    if (totalElement) totalElement.textContent = total;
    if (averageElement) averageElement.textContent = `${average}%`;
    if (streakElement) streakElement.textContent = `${streak} Days`;
    if (bestElement) bestElement.textContent = `${best}%`;
    updateBookmarkedCount();

    // Performance overview
    const performanceLine = document.querySelector(".performance-line");
    const safeAverage = Math.max(0, Math.min(100, average));

    if (performanceLine) {
        performanceLine.style.background =
            `linear-gradient(to right, #2563eb ${safeAverage}%, #e8eef7 ${safeAverage}%)`;
    }

    // Overall progress
    const progressPercentage = document.getElementById("progress-percentage");
    const progressFill = document.getElementById("progress-fill");
    const progressMessage = document.getElementById("progress-message");

    if (progressPercentage) {
        progressPercentage.textContent = `${safeAverage}%`;
    }

    if (progressFill) {
        progressFill.style.width = `${safeAverage}%`;
    }

    if (progressMessage) {
        if (total === 0) {
            progressMessage.textContent = "Start your first interview!";
        } else if (average < 40) {
            progressMessage.textContent =
                "Keep practicing and build your skills!";
        } else if (average < 60) {
            progressMessage.textContent =
                "Good progress! Keep improving!";
        } else if (average < 80) {
            progressMessage.textContent =
                "Great work! You're improving well!";
        } else {
            progressMessage.textContent =
                "Excellent performance! Keep it up!";
        }
    }

    // Recommended practice
    const recommendationTitle =
        document.getElementById("recommendation-title");
    const recommendationText =
        document.getElementById("recommendation-text");
    const recommendationButton =
        document.getElementById("recommendation-button");

    if (recommendationTitle && recommendationText && recommendationButton) {
        if (total === 0) {
            recommendationTitle.textContent = "Start your first interview";
            recommendationText.textContent =
                "Complete an interview to track your performance and receive practice suggestions.";
        } else if (average < 40) {
            recommendationTitle.textContent =
                "Focus on building your fundamentals";
            recommendationText.textContent =
                "Practice regularly and strengthen your basic interview skills.";
        } else if (average < 60) {
            recommendationTitle.textContent =
                "Keep improving your interview skills";
            recommendationText.textContent =
                "Try another technical interview and explain your answers clearly.";
        } else if (average < 80) {
            recommendationTitle.textContent = "Challenge yourself further";
            recommendationText.textContent =
                "Try a higher difficulty level to improve your technical skills.";
        } else {
            recommendationTitle.textContent =
                "Maintain your strong performance";
            recommendationText.textContent =
                "Keep practicing consistently with different technologies.";
        }

        recommendationButton.href = "interview.html";
    }

    // Achievements
    const achievementFirst = document.getElementById("achievement-first");
    const achievementFive = document.getElementById("achievement-five");
    const achievementScore = document.getElementById("achievement-score");

    function setAchievement(element, unlocked) {
        if (!element) return;

        element.classList.remove("unlocked", "locked");
        element.classList.add(unlocked ? "unlocked" : "locked");
    }

    setAchievement(achievementFirst, total >= 1);
    setAchievement(achievementFive, total >= 5);
    setAchievement(achievementScore, best >= 80);

    // Recent practice: results are already sorted newest first.
    const recentContainer =
        document.getElementById("recent-practice-container");

    if (recentContainer) {
        recentContainer.replaceChildren();

        const recentInterviews = interviewScores
            .filter(result =>
                result &&
                typeof result === "object" &&
                result.category &&
                Number(result.overall) > 0
            )
            .slice(0, 5);

        if (recentInterviews.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-practice";

            const message = document.createElement("p");
            message.textContent = "No completed interviews yet.";

            const hint = document.createElement("span");
            hint.textContent =
                "Start your first interview to see your progress here.";

            empty.append(message, hint);
            recentContainer.appendChild(empty);
        } else {
            recentInterviews.forEach(result => {
                const card = document.createElement("div");
                card.className = "practice-card";

                const info = document.createElement("div");
                info.className = "practice-info";

                const heading = document.createElement("h3");
                heading.textContent = result.category || "Interview";

                const details = document.createElement("p");
                const difficulty =
                    result.difficulty && result.difficulty !== "null"
                        ? result.difficulty
                        : "All Difficulties";

                details.textContent =
                    `${result.category} • ${difficulty}`;

                info.append(heading, details);

                const date = formatInterviewDate(result);

                if (date) {
                    const dateElement = document.createElement("small");
                    dateElement.textContent = date;
                    info.appendChild(dateElement);
                }

                const score = document.createElement("strong");
                score.className = "practice-score";
                score.textContent = `Score: ${Math.round(getScore(result))}%`;

                card.append(info, score);
                recentContainer.appendChild(card);
            });
        }
    }

    // Debug information
    console.log("Dashboard stats updated:", {
        total,
        average,
        best,
        streak,
        sourceCount: interviewScores.length,
        results: interviewScores
    });
}

// ======================================
// BOOKMARKED QUESTIONS COUNT
// ======================================

function updateBookmarkedCount() {
    const bookmarkedElement = document.getElementById(
        "dashboard-bookmark-count"
    );

    if (!bookmarkedElement) return;

    try {
        const saved = localStorage.getItem("bookmarkedQuestions");
        const bookmarks = saved ? JSON.parse(saved) : [];

        const count = Array.isArray(bookmarks)
            ? bookmarks.length
            : 0;

        bookmarkedElement.textContent =
            `${count} ${count === 1 ? "question" : "questions"} saved`;

        console.log("Dashboard bookmark count:", count);
    } catch (error) {
        console.error("Error loading bookmark count:", error);
        bookmarkedElement.textContent = "0 questions saved";
    }
}


// ======================================
// PROFILE AND NOTIFICATION DROPDOWNS
// ======================================

const profileButton = document.getElementById("profile-button");
const profileDropdown = document.getElementById("profile-dropdown");
const notificationButton = document.getElementById("notification-button");
const notificationDropdown = document.getElementById("notification-dropdown");

if (profileButton && profileDropdown) {
    profileButton.addEventListener("click", event => {
        event.stopPropagation();

        if (notificationDropdown) {
            notificationDropdown.classList.remove("show");
        }

        profileDropdown.classList.toggle("show");
    });
}

if (notificationButton && notificationDropdown) {
    notificationButton.addEventListener("click", event => {
        event.stopPropagation();

        if (profileDropdown) {
            profileDropdown.classList.remove("show");
        }

        notificationDropdown.classList.toggle("show");
    });
}

if (profileDropdown) {
    profileDropdown.addEventListener("click", event => {
        event.stopPropagation();
    });
}

if (notificationDropdown) {
    notificationDropdown.addEventListener("click", event => {
        event.stopPropagation();
    });
}

document.addEventListener("click", () => {
    profileDropdown?.classList.remove("show");
    notificationDropdown?.classList.remove("show");
});

// ======================================
// LOGOUT
// ======================================

const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        try {
            await signOut(auth);

            localStorage.removeItem("isLoggedIn");
            sessionStorage.clear();

            window.location.replace("login.html");
        } catch (error) {
            console.error("Logout error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}

// ======================================
// START DASHBOARD DATA LOADING
// ======================================

onAuthStateChanged(auth, user => {
    loadDashboardResults(user);
});