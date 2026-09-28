// ======================================
// FIREBASE IMPORTS
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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
// SIGNUP
// ======================================

function signupUser(event) {

    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;


    // Password check

    if (password !== confirmPassword) {

        alert("Passwords do not match.");
        return;

    }


    // Create Firebase account

    createUserWithEmailAndPassword(auth, email, password)

    .then(async (userCredential) => {

    const user = userCredential.user;

    console.log("Account Created:", user);

    await sendEmailVerification(user);

    alert("Account created successfully! Please check your email and verify your account.");

window.location.href = "login.html";
})
    .catch((error) => {

        console.error("Signup Error:", error);

        if (error.code === "auth/email-already-in-use") {

            alert("This email is already registered.");

        } else if (error.code === "auth/weak-password") {

            alert("Password should be at least 6 characters.");

        } else if (error.code === "auth/invalid-email") {

            alert("Please enter a valid email address.");
        } else {

             alert("Signup Error: " + error.code);

        } 
         
    });
}


// ======================================
// MAKE FUNCTION AVAILABLE TO HTML
// ======================================

window.signupUser = signupUser;