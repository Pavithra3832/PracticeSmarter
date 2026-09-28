console.log("ADMIN JS FILE LOADED");
// ======================================
// FIREBASE IMPORTS
// ======================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
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
// ADMIN UID
// ======================================

const ADMIN_UID =
    "I6tPyJhpg9arxIzy2pnpmbO8TyE2";

console.log("ADMIN UID IN CODE:", ADMIN_UID);


// ======================================
// INITIALIZE FIREBASE
// ======================================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


// ======================================
// HTML ELEMENTS
// ======================================

const totalUsersElement =
    document.getElementById(
        "total-users"
    );

const totalInterviewsElement =
    document.getElementById(
        "total-interviews"
    );

const averageScoreElement =
    document.getElementById(
        "average-score"
    );

const aiEvaluationsElement =
    document.getElementById(
        "ai-evaluations"
    );

const resultsTableBody =
    document.getElementById(
        "results-table-body"
    );

const usersTableBody =
    document.getElementById(
        "users-table-body"
    );

const adminStatus =
    document.getElementById(
        "admin-status"
    );

const adminLogoutButton =
    document.getElementById(
        "admin-logout-button"
    );


// ======================================
// AUTHENTICATION + ADMIN CHECK
// ======================================

onAuthStateChanged(
    auth,
    async function (user) {

        // No logged-in user
        if (!user) {

            window.location.replace(
                "login.html"
            );

            return;
        }


        // Logged-in user is NOT admin
        console.log("CURRENT LOGIN UID:", user.uid);
console.log("ADMIN UID IN CODE:", ADMIN_UID);

console.log("CURRENT LOGGED-IN UID:", user.uid);
console.log("ADMIN UID IN CODE:", ADMIN_UID);
console.log(
    "UID MATCH:",
    user.uid === ADMIN_UID
);
if (user.uid !== ADMIN_UID) {

    alert(
        "CURRENT UID:\n" +
        user.uid +
        "\n\nADMIN UID:\n" +
        ADMIN_UID
    );

    window.location.replace(
        "dashboard.html"
    );

    return;
}

        // Admin verified
        console.log(
            "Admin authenticated:",
            user.uid
        );


        // Load dashboard
        await loadAdminDashboard();

    }
);


// ======================================
// LOAD ADMIN DASHBOARD
// ======================================

async function loadAdminDashboard() {

    try {

        adminStatus.textContent =
            "Loading admin data...";


        // ==================================
        // GET USERS
        // ==================================

        const usersSnapshot =
            await getDocs(
                collection(
                    db,
                    "users"
                )
            );


        // ==================================
        // GET INTERVIEW RESULTS
        // ==================================

        const resultsSnapshot =
            await getDocs(
                collection(
                    db,
                    "interviewResults"
                )
            );


        // ==================================
        // USERS ARRAY
        // ==================================

        const users = [];

        usersSnapshot.forEach(
            function (doc) {

                users.push({
                    id: doc.id,
                    ...doc.data()
                });

            }
        );


        // ==================================
        // RESULTS ARRAY
        // ==================================

        const results = [];

        resultsSnapshot.forEach(
            function (doc) {

                results.push({
                    id: doc.id,
                    ...doc.data()
                });

            }
        );


        console.log(
            "Admin Users:",
            users
        );

        console.log(
            "Admin Results:",
            results
        );


        // ==================================
        // TOTAL USERS
        // ==================================

        totalUsersElement.textContent =
            users.length;


        // ==================================
        // TOTAL INTERVIEWS
        // ==================================

        totalInterviewsElement.textContent =
            results.length;


        // ==================================
        // AVERAGE SCORE
        // ==================================

        const validScores =
            results
                .map(
                    result =>
                        Number(
                            result.percentage ??
                            result.overall ??
                            0
                        )
                )
                .filter(
                    score =>
                        Number.isFinite(score) &&
                        score >= 0
                );


        let averageScore = 0;


        if (validScores.length > 0) {

            const totalScore =
                validScores.reduce(
                    (
                        sum,
                        score
                    ) =>
                        sum + score,
                    0
                );


            averageScore =
                Math.round(
                    totalScore /
                    validScores.length
                );
        }


        averageScoreElement.textContent =
            `${averageScore}%`;


        // ==================================
        // AI EVALUATIONS
        // ==================================

        let aiEvaluationCount = 0;


        results.forEach(
            function (result) {

                if (
                    Array.isArray(
                        result.aiEvaluations
                    )
                ) {

                    aiEvaluationCount +=
                        result.aiEvaluations.length;

                }

            }
        );


        aiEvaluationsElement.textContent =
            aiEvaluationCount;


        // ==================================
        // DISPLAY RESULTS
        // ==================================

        displayResults(
            results
        );


        // ==================================
        // DISPLAY USERS
        // ==================================

        displayUsers(
            users
        );


        adminStatus.textContent =
            "Admin dashboard loaded successfully.";

    }

    catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );


        adminStatus.textContent =
            "Unable to load admin data. Check Firestore rules and console.";

    }
}


// ======================================
// DISPLAY INTERVIEW RESULTS
// ======================================

function displayResults(
    results
) {

    resultsTableBody.innerHTML =
        "";


    if (results.length === 0) {

        resultsTableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="table-loading">

                    No interview results found.

                </td>
            </tr>
        `;

        return;
    }


    // Newest results first
    const recentResults =
        [...results]
            .reverse()
            .slice(
                0,
                20
            );


    recentResults.forEach(
        function (result) {

            const row =
                document.createElement(
                    "tr"
                );


            const userId =
                result.userId ||
                "Unknown";


            const category =
                result.category ||
                "Interview";


            const difficulty =
                result.difficulty &&
                result.difficulty !== "null"
                    ? result.difficulty
                    : "All";


            const overall =
                Number(
                    result.overall ??
                    0
                );


            const percentage =
                Number(
                    result.percentage ??
                    overall * 10
                );


            const date =
                result.date ||
                "—";


            row.innerHTML = `
                <td>
                    ${escapeHTML(
                        userId
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        category
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        difficulty
                    )}
                </td>

                <td>
                    <span class="score-badge">
                        ${Math.round(
                            overall
                        )}/10
                    </span>
                </td>

                <td>
                    <span class="score-badge">
                        ${Math.round(
                            percentage
                        )}%
                    </span>
                </td>

                <td>
                    ${escapeHTML(
                        String(date)
                    )}
                </td>
            `;


            resultsTableBody.appendChild(
                row
            );

        }
    );
}


// ======================================
// DISPLAY USERS
// ======================================

function displayUsers(
    users
) {

    usersTableBody.innerHTML =
        "";


    if (users.length === 0) {

        usersTableBody.innerHTML = `
            <tr>
                <td
                    colspan="3"
                    class="table-loading">

                    No users found.

                </td>
            </tr>
        `;

        return;
    }


    users.forEach(
        function (user) {

            const row =
                document.createElement(
                    "tr"
                );


            const name =
                user.name ||
                user.displayName ||
                "User";


            const email =
                user.email ||
                "—";


            const userId =
                user.id ||
                "—";


            row.innerHTML = `
                <td>
                    ${escapeHTML(
                        name
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        email
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        userId
                    )}
                </td>
            `;


            usersTableBody.appendChild(
                row
            );

        }
    );
}


// ======================================
// HTML SAFETY
// ======================================

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ======================================
// ADMIN LOGOUT
// ======================================

if (adminLogoutButton) {

    adminLogoutButton.addEventListener(
        "click",
        async function () {

            try {

                await signOut(
                    auth
                );


                localStorage.removeItem(
                    "isLoggedIn"
                );


                sessionStorage.clear();


                window.location.replace(
                    "login.html"
                );

            }

            catch (error) {

                console.error(
                    "Admin Logout Error:",
                    error
                );


                alert(
                    "Logout failed. Please try again."
                );

            }

        }
    );
}