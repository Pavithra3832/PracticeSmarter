// ===============================
// PRACTICESMARTER - INDEX.JS
// ===============================

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");

        // Ignore empty "#"
        if (targetId === "#") return;

        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});


// ===============================
// CURRENT YEAR
// ===============================

const currentYear = new Date().getFullYear();

console.log(`PracticeSmarter © ${currentYear}`);