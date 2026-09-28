// ======================================
// FIREBASE AUTH
// ======================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
// ======================================
// CHECK LOGIN STATUS
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


// ======================================
// INITIALIZE FIREBASE
// ======================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// ======================================
// GET INTERVIEW SCORES
// ======================================

const interviewScores =
    JSON.parse(localStorage.getItem("interviewScores")) || [];


// ======================================
// GET VALID SCORES
// ======================================

const scores = interviewScores
    .map(result => {

        if (typeof result === "number") {
            return Number(result);
        }

        return Number(result?.overall);
    })
    .filter(score => Number.isFinite(score));


// ======================================
// CALCULATE DASHBOARD STATS
// ======================================

const total = interviewScores.length;

let average = 0;
let best = 0;

if (scores.length > 0) {

    const totalScore =
        scores.reduce(
            (sum, score) => sum + score,
            0
        );

    average =
        Math.round(totalScore / scores.length);

    best =
        Math.max(...scores);
}


// ======================================
// GET STREAK
// ======================================

const streak =
    Number(
        localStorage.getItem("practiceStreak")
    ) || 0;


// ======================================
// GET DASHBOARD ELEMENTS
// ======================================

const dashboardTotal =
    document.getElementById("dashboard-total");

const dashboardAverage =
    document.getElementById("dashboard-average");

const dashboardStreak =
    document.getElementById("dashboard-streak");

const dashboardBest =
    document.getElementById("dashboard-best");


// ======================================
// UPDATE DASHBOARD STATS
// ======================================

if (dashboardTotal) {

    dashboardTotal.textContent =
        total;
}


if (dashboardAverage) {

    dashboardAverage.textContent =
        `${average}%`;
}


if (dashboardStreak) {

    dashboardStreak.textContent =
        `${streak} Days`;
}


if (dashboardBest) {

    dashboardBest.textContent =
        `${best}%`;
}

// ======================================
// PERFORMANCE OVERVIEW BAR
// ======================================

const performanceLine =
    document.querySelector(".performance-line");

if (performanceLine) {

    performanceLine.style.background =
        `linear-gradient(
            to right,
            #2563eb ${average}%,
            #e8eef7 ${average}%
        )`;
}

// ======================================
// OVERALL PROGRESS
// ======================================

const progressPercentage =
    document.getElementById(
        "progress-percentage"
    );

const progressFill =
    document.getElementById(
        "progress-fill"
    );

const progressMessage =
    document.getElementById(
        "progress-message"
    );


if (progressPercentage) {

    progressPercentage.textContent =
        `${average}%`;
}


if (progressFill) {

    progressFill.style.width =
        `${average}%`;
}


if (progressMessage) {

    if (average === 0) {

        progressMessage.textContent =
            "Start your first interview!";

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


// ======================================
// RECENT PRACTICE
// SHOW LATEST 5 VALID INTERVIEWS
// ======================================

const recentContainer =
    document.getElementById(
        "recent-practice-container"
    );

if (recentContainer) {

    recentContainer.innerHTML = "";

    // Only completed interviews with score > 0
    const recentInterviews =
        interviewScores
            .filter(result =>
                typeof result === "object" &&
                result !== null &&
                result.category &&
                Number(result.overall) > 0
            )
            .slice(-5)
            .reverse();

    // No valid interviews
    if (recentInterviews.length === 0) {

        recentContainer.innerHTML = `
            <div class="empty-practice">
                <p>No completed interviews yet.</p>
                <span>
                    Start your first interview to see your progress here.
                </span>
            </div>
        `;

    } else {
        recentInterviews.forEach(result => {

    // ----------------------------------
    // CATEGORY
    // ----------------------------------

    const category =
        result.category || "Interview";


    // ----------------------------------
    // DIFFICULTY
    // ----------------------------------

    const difficulty =
        result.difficulty &&
        result.difficulty !== "null"
            ? result.difficulty
            : "All Difficulties";


    // ----------------------------------
    // SCORE
    // ----------------------------------

    const score =
        Math.round(Number(result.overall));


    // ----------------------------------
    // DATE
    // ----------------------------------

    const date =
        result.date || "";


    // ----------------------------------
    // CREATE CARD
    // ----------------------------------

    const practiceCard =
        document.createElement("div");

    practiceCard.className =
        "practice-card";


    practiceCard.innerHTML = `
        <div class="practice-info">

            <h3>
                ${category}
            </h3>

            <p>
                ${category} • ${difficulty}
            </p>

            ${
                date
                    ? `<small>${date}</small>`
                    : ""
            }

        </div>

        <strong class="practice-score">
            Score: ${score}%
        </strong>
    `;


    recentContainer.appendChild(
        practiceCard
    );

});

        
        };
    }


// ======================================
// CONSOLE INFORMATION
// ======================================

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
    "Practice Streak:",
    streak
);

console.log(
    "Interview Scores:",
    interviewScores
);
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
// PROFILE DROPDOWN
// ======================================

if (profileButton && profileDropdown) {

    profileButton.addEventListener("click", function (event) {

        event.stopPropagation();

        // Close notification
        if (notificationDropdown) {
            notificationDropdown.classList.remove("show");
        }

        // Open / close profile
        profileDropdown.classList.toggle("show");

    });

}


// ======================================
// NOTIFICATION DROPDOWN
// ======================================

if (notificationButton && notificationDropdown) {

    notificationButton.addEventListener("click", function (event) {

        event.stopPropagation();

        // Close profile
        if (profileDropdown) {
            profileDropdown.classList.remove("show");
        }

        // Open / close notification
        notificationDropdown.classList.toggle("show");

    });

}


// ======================================
// PREVENT PROFILE DROPDOWN CLOSE
// ======================================

if (profileDropdown) {

    profileDropdown.addEventListener("click", function (event) {

        event.stopPropagation();

    });

}


// ======================================
// PREVENT NOTIFICATION DROPDOWN CLOSE
// ======================================

if (notificationDropdown) {

    notificationDropdown.addEventListener("click", function (event) {

        event.stopPropagation();

    });

}


// ======================================
// CLOSE DROPDOWNS OUTSIDE
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

            // Remove our login status
            localStorage.removeItem("isLoggedIn");

            sessionStorage.clear();

            console.log("User logged out successfully.");

            window.location.replace("login.html");

        } catch (error) {

            console.error("Logout Error:", error);

            alert("Logout failed. Please try again.");

        }

    });

}
