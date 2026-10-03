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
    doc,
    getDoc,
    setDoc
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
// ===============================

// LOGIN PROTECTION
// ===============================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("login.html");
}
// ===============================
// PROFILE ELEMENTS
// ===============================

const editButton =
    document.getElementById("edit-profile-button");

const editForm =
    document.getElementById("edit-profile-form");

const saveButton =
    document.getElementById("save-profile-button");

const nameInput =
    document.getElementById("edit-name");

const emailInput =
    document.getElementById("edit-email");

const careerInput =
    document.getElementById("edit-career");


// ===============================
// DISPLAY ELEMENTS
// ===============================

const profileName =
    document.getElementById("profile-name");

const profileCareer =
    document.getElementById("profile-career");

const profileAvatar =
    document.getElementById("profile-avatar");

const detailName =
    document.getElementById("detail-name");

const detailEmail =
    document.getElementById("detail-email");

const detailCareer =
    document.getElementById("detail-career");
// =========================================
// PROFILE PHOTO
// =========================================
const profilePhotoInput = document.getElementById("profile-photo-input");
const changePhotoButton = document.getElementById("change-photo-button");

function loadProfilePhoto() {
    const savedPhoto = localStorage.getItem("profilePhoto");

    if (!savedPhoto || !profileAvatar) {
        return;
    }

    profileAvatar.innerHTML = "";

    const img = document.createElement("img");
    img.src = savedPhoto;
    img.alt = "Profile Photo";

    profileAvatar.appendChild(img);
}

changePhotoButton?.addEventListener("click", () => {
    profilePhotoInput?.click();
});

profilePhotoInput?.addEventListener("change", (event) => {

    const file = event.target.files?.[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {

        const image = new Image();

        image.onload = () => {

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const size = 300;

            canvas.width = size;
            canvas.height = size;

            const minSide = Math.min(
                image.width,
                image.height
            );

            const sourceX =
                (image.width - minSide) / 2;

            const sourceY =
                (image.height - minSide) / 2;

            ctx.drawImage(
                image,
                sourceX,
                sourceY,
                minSide,
                minSide,
                0,
                0,
                size,
                size
            );

            const compressedPhoto =
                canvas.toDataURL("image/jpeg", 0.8);

            localStorage.setItem(
                "profilePhoto",
                compressedPhoto
            );

            loadProfilePhoto();

            console.log("✅ Profile photo saved");
        };

        image.src = reader.result;
    };

    reader.readAsDataURL(file);
});

// Load saved photo when page opens
loadProfilePhoto();    


// ===============================
// LOAD SAVED PROFILE
// ===============================

const savedProfile =
    JSON.parse(localStorage.getItem("userProfile"));

if (savedProfile) {

    nameInput.value = savedProfile.name;
    emailInput.value = savedProfile.email;
    careerInput.value = savedProfile.career;

    updateProfile(
        savedProfile.name,
        savedProfile.email,
        savedProfile.career
    );
}
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        return;
    }

    try {

        const userRef = doc(
            db,
            "users",
            user.uid
        );

        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {

            const profileData =
                userSnapshot.data();

            nameInput.value =
                profileData.name || "";

            emailInput.value =
                profileData.email || user.email || "";

            careerInput.value =
                profileData.career || "";

            updateProfile(
                profileData.name || "",
                profileData.email || user.email || "",
                profileData.career || ""
            );

            console.log(
                "Profile loaded from Firestore"
            );

        }

    } catch (error) {

        console.error(
            "Firestore profile load error:",
            error
        );

    }

});


// ===============================
// EDIT PROFILE BUTTON
// ===============================

editButton.addEventListener("click", function () {

    if (editForm.style.display === "block") {

        editForm.style.display = "none";

    } else {

        editForm.style.display = "block";

    }

});


// ===============================
// SAVE PROFILE
// ===============================

saveButton.addEventListener("click", async function () {
    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim();

    const career =
        careerInput.value.trim();


    if (name === "" || email === "" || career === "") {

        alert("Please fill all fields.");

        return;
    }


    const userProfile = {

        name: name,
        email: email,
        career: career

    };


    // Save to localStorage

    localStorage.setItem(
        "userProfile",
        JSON.stringify(userProfile)
    );

    const user = auth.currentUser;

if (user) {

    try {

        await setDoc(
            doc(db, "users", user.uid),
            {
                name: name,
                email: email,
                career: career
            },
            { merge: true }
        );

        console.log(
            "Profile saved to Firestore"
        );

    } catch (error) {

        console.error(
            "Firestore profile save error:",
            error
        );

    }

}


    // Update page

    updateProfile(
        name,
        email,
        career
    );


    alert("Profile updated successfully!");


    editForm.style.display = "none";

});


// ===============================
// UPDATE PROFILE
// ===============================

function updateProfile(name, email, career) {

    profileName.textContent = name;

    profileCareer.textContent = career;

    detailName.textContent = name;

    detailEmail.textContent = email;

    detailCareer.textContent = career;


    // Keep saved profile photo
    const savedPhoto =
        localStorage.getItem("profilePhoto");

    if (savedPhoto) {

        profileAvatar.innerHTML = "";

        const img =
            document.createElement("img");

        img.src = savedPhoto;
        img.alt = "Profile Photo";

        profileAvatar.appendChild(img);

    } else {

        // Show first letter when no photo exists
        profileAvatar.textContent =
            name.charAt(0).toUpperCase();
    }
}
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


// ===============================
// PROFILE DROPDOWN
// ===============================

if (profileButton && profileDropdown) {

    profileButton.addEventListener("click", function (event) {

        event.stopPropagation();

        if (notificationDropdown) {
            notificationDropdown.classList.remove("show");
        }

        profileDropdown.classList.toggle("show");

    });

}


// ===============================
// NOTIFICATION DROPDOWN
// ===============================

if (notificationButton && notificationDropdown) {

    notificationButton.addEventListener("click", function (event) {

        event.stopPropagation();

        if (profileDropdown) {
            profileDropdown.classList.remove("show");
        }

        notificationDropdown.classList.toggle("show");

    });

}


// ===============================
// PREVENT DROPDOWN CLOSE
// ===============================

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


// ===============================
// CLOSE WHEN CLICKING OUTSIDE
// ===============================

document.addEventListener("click", function () {

    if (profileDropdown) {
        profileDropdown.classList.remove("show");
    }

    if (notificationDropdown) {
        notificationDropdown.classList.remove("show");
    }

});


// ===============================
// LOGOUT
// ===============================

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