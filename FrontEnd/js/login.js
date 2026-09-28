// ======================================
// FIREBASE IMPORTS
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
  signInWithPopup,
signInWithEmailAndPassword,
sendPasswordResetEmail,
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

const provider = new GoogleAuthProvider();


// ======================================
// NORMAL LOGIN
// ======================================

async function loginUser(event) {

    event.preventDefault();

    const email =
        document.querySelector('input[type="email"]').value.trim();

    const password =
        document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {

        const userCredential =
            await signInWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;

        if (!user.emailVerified) {

    const resend = confirm(
        "Please verify your email before logging in.\n\n" +
        "Verification email was not completed. " +
        "Click OK to resend the verification email."
    );

    if (resend) {

        try {

            await sendEmailVerification(user);

            alert(
                "Verification email sent again. " +
                "Please check your inbox and spam folder."
            );

        } catch (error) {

            console.error("Verification Email Error:", error);

            alert(
                "Unable to resend verification email. " +
                "Please try again later."
            );
        }
    }

    return;
}

        localStorage.setItem("isLoggedIn", "true");

        localStorage.setItem("userEmail", user.email);

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error("Login Error:", error);

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {

            alert("Invalid email or password.");

        } else if (error.code === "auth/invalid-email") {

            alert("Please enter a valid email address.");

        } else {

            alert("Login failed. Please try again.");
        }
    }
}

// ======================================
// GOOGLE LOGIN
// ======================================

async function googleLogin() {

    try {

        const result = await signInWithPopup(auth, provider);

        const user = result.user;

        console.log("Google Login Success:", user);

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error("Google Login Error:", error);

        alert("Google Login failed. Please try again.");

    }
}


// ======================================
// PASSWORD SHOW / HIDE
// ======================================

function togglePassword() {

    const password = document.getElementById("password");

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}


// ======================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ======================================

window.loginUser = loginUser;
window.googleLogin = googleLogin;
window.togglePassword = togglePassword;
window.forgotPassword = forgotPassword;

async function forgotPassword(event) {

    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value;

    if (!email) {
        alert("Please enter your email address first.");
        return;
    }

    try {

        await sendPasswordResetEmail(auth, email);

        alert("Password reset link has been sent to your email.");

    } catch (error) {

        console.error("Forgot Password Error:", error);

        alert("Unable to send reset email. Please check your email address.");

    }
}