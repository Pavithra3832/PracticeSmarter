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

// ===============================
// LOGIN PROTECTION
// ===============================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("login.html");
}
// ======================================
// AUTO SELECT CATEGORY FROM DASHBOARD
// ======================================

const urlParams =
    new URLSearchParams(window.location.search);

const topic =
    urlParams.get("topic");

if (topic) {

    localStorage.setItem(
        "interviewCategory",
        topic
    );

    localStorage.setItem(
        "interviewDifficulty",
        "Easy"
    );

    console.log(
        "Quick Practice Topic:",
        topic
    );

}
// ======================================
// INTERVIEW CATEGORY SELECTION
// ======================================

const categoryCards =
    document.querySelectorAll(".category-card");

categoryCards.forEach(function(card) {

    const startButton =
        card.querySelector("a");

    if (!startButton) {
        return;
    }

    startButton.addEventListener("click", function() {

        const category =
            card.querySelector("h2").textContent.trim();

        localStorage.setItem(
            "interviewCategory",
            category
        );

        localStorage.setItem(
            "interviewDifficulty",
            "Easy"
        );

        console.log(
            "Selected Category:",
            category
        );

    });

});
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
// PROFILE CLICK
// ======================================

if (profileButton && profileDropdown) {

    profileButton.addEventListener("click", function(event) {

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
// NOTIFICATION CLICK
// ======================================

if (notificationButton && notificationDropdown) {

    notificationButton.addEventListener("click", function(event) {

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
// PREVENT DROPDOWN CLOSE
// ======================================

if (profileDropdown) {

    profileDropdown.addEventListener("click", function(event) {

        event.stopPropagation();

    });

}


if (notificationDropdown) {

    notificationDropdown.addEventListener("click", function(event) {

        event.stopPropagation();

    });

}


// ======================================
// CLOSE DROPDOWNS OUTSIDE
// ======================================

document.addEventListener("click", function() {

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

    logoutButton.addEventListener("click", async function() {

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
