// ======================================
// NAVBAR PROFILE PHOTO
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    const profileAvatar =
        document.getElementById("navbar-profile-avatar");

    if (!profileAvatar) {
        return;
    }

    const savedPhoto =
        localStorage.getItem("profilePhoto");

    if (!savedPhoto) {
        return;
    }

    profileAvatar.innerHTML = "";

    const img =
        document.createElement("img");

    img.src = savedPhoto;
    img.alt = "Profile Photo";

    profileAvatar.appendChild(img);
});