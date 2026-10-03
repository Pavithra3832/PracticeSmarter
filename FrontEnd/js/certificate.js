// ======================================
// FIREBASE
// ======================================

import {
    initializeApp
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
    getDocs,
    doc,
    getDoc
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
// INITIALIZE
// ======================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ======================================
// LOGIN CHECK
// ======================================

if (localStorage.getItem("isLoggedIn") !== "true") {

    window.location.replace("login.html");

}


// ======================================
// HTML ELEMENTS
// ======================================

const studentNameElement =
    document.getElementById("studentName");

const categoryElement =
    document.getElementById("category");

const difficultyElement =
    document.getElementById("difficulty");

const scoreElement =
    document.getElementById("score");

const percentageElement =
    document.getElementById("percentage");

const completionDateElement =
    document.getElementById("completionDate");

const certificateIdElement =
    document.getElementById("certificateId");


// ======================================
// GET LATEST INTERVIEW RESULT
// ======================================

async function loadLatestResult(user) {

    try {

        console.log("Loading certificate result...");


        // ==================================
        // GET USER'S INTERVIEW RESULTS
        // ==================================

        const resultsRef =
            collection(
                db,
                "interviewResults"
            );


        const resultsQuery =
            query(
                resultsRef,
                where(
                    "userId",
                    "==",
                    user.uid
                )
            );


        const snapshot =
            await getDocs(resultsQuery);


        console.log(
            "Interview results found:",
            snapshot.size
        );


        if (snapshot.empty) {

            console.warn(
                "No interview results found."
            );

            return;

        }


        // ==================================
        // CONVERT FIRESTORE DOCUMENTS
        // ==================================

        const results =
            snapshot.docs.map(
                document => ({
                    id: document.id,
                    ...document.data()
                })
            );


        // ==================================
        // SORT NEWEST RESULT FIRST
        // ==================================

        results.sort(
            (a, b) => {

                const dateA =
                    a.createdAt &&
                    typeof a.createdAt.toDate === "function"
                        ? a.createdAt.toDate().getTime()
                        : 0;

                const dateB =
                    b.createdAt &&
                    typeof b.createdAt.toDate === "function"
                        ? b.createdAt.toDate().getTime()
                        : 0;

                return dateB - dateA;

            }
        );


        // ==================================
        // LATEST RESULT
        // ==================================

        const result =
            results[0];


        console.log(
            "LATEST INTERVIEW RESULT:",
            result
        );


        // ==================================
        // CATEGORY
        // ==================================

        const category =
            result.category ||
            "HTML";


        // ==================================
        // DIFFICULTY
        // ==================================

        const difficulty =
            result.difficulty ||
            "Easy";


        // ==================================
        // OVERALL PERCENTAGE
        // ==================================

        const overallPercentage =
            Number(result.overall) || 0;


        // ==================================
        // SCORE OUT OF 10
        // ==================================

        const scoreOutOf10 =
            overallPercentage / 10;


        // ==================================
        // CATEGORY
        // ==================================

        if (categoryElement) {

            categoryElement.textContent =
                category;

        }


        // ==================================
        // DIFFICULTY
        // ==================================

        if (difficultyElement) {

            difficultyElement.textContent =
                difficulty;

        }


        // ==================================
        // SCORE
        // ==================================

        if (scoreElement) {

            scoreElement.textContent =
                `${scoreOutOf10.toFixed(1)}/10`;

        }


        // ==================================
        // PERCENTAGE
        // ==================================

        if (percentageElement) {

            percentageElement.textContent =
                `${Math.round(overallPercentage)}%`;

        }


        // ==================================
        // DATE
        // ==================================

        let completionDate =
            new Date();


        if (
            result.createdAt &&
            typeof result.createdAt.toDate === "function"
        ) {

            completionDate =
                result.createdAt.toDate();

        }


        if (completionDateElement) {

            completionDateElement.textContent =
                completionDate.toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        }


        // ==================================
        // CERTIFICATE ID
        // ==================================

        const certificateStorageKey =
            `practiceSmarterCertificateId_${result.id}`;


        let certificateId =
            localStorage.getItem(
                certificateStorageKey
            );


        if (!certificateId) {

            const cleanCategory =
                category
                    .replace(
                        /[^a-zA-Z0-9]/g,
                        ""
                    )
                    .toUpperCase();


            const cleanDifficulty =
                difficulty
                    .replace(
                        /[^a-zA-Z0-9]/g,
                        ""
                    )
                    .toUpperCase();


            const randomCode =
                Math.random()
                    .toString(36)
                    .substring(2, 8)
                    .toUpperCase();


            certificateId =
                `PS-${cleanCategory}-${cleanDifficulty}-${completionDate.getFullYear()}-${randomCode}`;


            localStorage.setItem(
                certificateStorageKey,
                certificateId
            );

        }


        if (certificateIdElement) {

            certificateIdElement.textContent =
                certificateId;

        }


        console.log(
            "CERTIFICATE DATA LOADED SUCCESSFULLY"
        );

    } catch (error) {

        console.error(
            "CERTIFICATE DATA ERROR:",
            error
        );

    }

}


// ======================================
// AUTH STATE
// ======================================

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.replace(
                "login.html"
            );

            return;

        }


        // ==================================
// STUDENT NAME FROM PROFILE
// ======================================

let displayName = "";

// --------------------------------------
// FIRST: Try saved local profile
// --------------------------------------

try {

    const savedProfile =
        JSON.parse(
            localStorage.getItem("userProfile")
        );

    if (
        savedProfile &&
        savedProfile.name &&
        savedProfile.name.trim() !== ""
    ) {

        displayName =
            savedProfile.name.trim();

    }

} catch (error) {

    console.warn(
        "Local profile read failed:",
        error
    );

}


// --------------------------------------
// SECOND: Get latest profile from Firestore
// --------------------------------------

try {

    const userRef =
        doc(
            db,
            "users",
            user.uid
        );

    const userSnapshot =
        await getDoc(userRef);

    if (userSnapshot.exists()) {

        const profileData =
            userSnapshot.data();

        if (
            profileData.name &&
            profileData.name.trim() !== ""
        ) {

            displayName =
                profileData.name.trim();

        }

    }

} catch (error) {

    console.warn(
        "Profile name load failed:",
        error
    );

}


// --------------------------------------
// FALLBACK
// --------------------------------------

if (!displayName) {

    displayName =
        user.displayName &&
        user.displayName.trim() !== ""

            ? user.displayName.trim()

            : user.email
                ? user.email.split("@")[0]
                : "PracticeSmarter User";

}


// --------------------------------------
// DISPLAY NAME
// --------------------------------------

if (studentNameElement) {

    studentNameElement.textContent =
        displayName;

}

console.log(
    "✅ Certificate profile name:",
    displayName
);


        // ==================================
        // LOAD RESULT
        // ==================================

        await loadLatestResult(user);

    }
);


// ======================================
// BACK TO RESULT
// ======================================

const backToResult =
    document.getElementById(
        "backToResult"
    );


if (backToResult) {

    backToResult.addEventListener(
        "click",
        function () {

            window.location.href =
                "result.html";

        }
    );

}


// ======================================
// DOWNLOAD CERTIFICATE
// ======================================

const downloadButton =
    document.getElementById(
        "downloadCertificate"
    );


if (downloadButton) {

    downloadButton.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

}