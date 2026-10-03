// ==========================================
// PRACTICESMARTER - INTERVIEW HISTORY
// ==========================================


// ==========================================
// GET SAVED INTERVIEW DATA
// ==========================================

const interviewScores =
    JSON.parse(
        localStorage.getItem("interviewScores")
    ) || [];


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const historyList =
    document.getElementById("history-list");

const categoryFilter =
    document.getElementById("history-category");

const difficultyFilter =
    document.getElementById("history-difficulty");


// ==========================================
// GET INTERVIEW NOTE
// ==========================================

function getInterviewNote(result) {

    if (
        !result ||
        !result.sessionId
    ) {
        return "";
    }

    const noteKey =
        `interviewNote_${result.sessionId}`;

    return localStorage.getItem(noteKey) || "";
}    


// ==========================================
// DISPLAY HISTORY
// ==========================================

function displayHistory() {

    if (!historyList) {
        return;
    }


    // --------------------------------------
    // FILTER ONLY COMPLETED INTERVIEWS
    // --------------------------------------

    let history =
        interviewScores.filter(result => {

            return (
                typeof result === "object" &&
                result !== null &&
                result.category &&
                Number(result.overall) > 0
            );

        });


    // --------------------------------------
    // CATEGORY FILTER
    // --------------------------------------

    const selectedCategory =
        categoryFilter
            ? categoryFilter.value
            : "all";


    if (selectedCategory !== "all") {

        history =
            history.filter(result =>
                result.category === selectedCategory
            );

    }


    // --------------------------------------
    // DIFFICULTY FILTER
    // --------------------------------------

    const selectedDifficulty =
        difficultyFilter
            ? difficultyFilter.value
            : "all";


    if (selectedDifficulty !== "all") {

        history =
            history.filter(result =>
                result.difficulty === selectedDifficulty
            );

    }


    // --------------------------------------
    // CLEAR OLD CONTENT
    // --------------------------------------

    historyList.innerHTML = "";


    // --------------------------------------
    // EMPTY RESULT
    // --------------------------------------

    if (history.length === 0) {

        historyList.innerHTML = `

            <div class="history-empty">

                <div class="history-empty-icon">
                    📚
                </div>

                <h3>
                    No interview history found
                </h3>

                <p>
                    Complete an interview to see your results here.
                </p>

            </div>

        `;

        return;
    }


    // --------------------------------------
    // SHOW LATEST FIRST
    // --------------------------------------

    history
        .slice()
        .reverse()
        .forEach(result => {


            const category =
                result.category || "Interview";


            const difficulty =
                result.difficulty &&
                result.difficulty !== "null"

                    ? result.difficulty

                    : "All Difficulties";


            const score =
                Math.round(
                    Number(result.overall)
                );


            const date =
                result.date || "Date unavailable";


            // ----------------------------------
            // CREATE CARD
            // ----------------------------------

            const card =
                document.createElement("div");


            card.className =
                "history-card";


            const interviewNote =
    getInterviewNote(result);

const hasNote =
    interviewNote.trim().length > 0;


card.innerHTML = `

    <div class="history-info">

        <h3>
            ${category}
        </h3>

        <p>
            ${category} • ${difficulty}
        </p>

        <small>
            ${date}
        </small>

        <button
            type="button"
            class="view-note-button"
            ${hasNote ? "" : "disabled"}>

            ${hasNote ? "📝 View Note" : "📝 No Note"}

        </button>

        <div class="history-note">

            <strong>
                📝 Interview Note
            </strong>

            <p></p>

        </div>

    </div>


    <div class="history-score">

        ${score}%

    </div>

`;


// ==========================================
// PRACTICE AGAIN BUTTON
// ==========================================

const practiceAgainButton =
    document.createElement("button");

practiceAgainButton.type = "button";

practiceAgainButton.className =
    "practice-again-button";

practiceAgainButton.textContent =
    "Practice Again →";


practiceAgainButton.addEventListener(
    "click",
    () => {

        const targetCategory =
            encodeURIComponent(category);

        const targetDifficulty =
            encodeURIComponent(difficulty);

        window.location.href =
            `technical-interview.html?category=${targetCategory}&difficulty=${targetDifficulty}`;
    }
);


// Add button inside history card
card.querySelector(".history-info")
    .appendChild(practiceAgainButton);
const noteButton =
    card.querySelector(".view-note-button");

const noteBox =
    card.querySelector(".history-note");

const noteText =
    card.querySelector(".history-note p");


if (hasNote && noteButton && noteBox && noteText) {

    noteText.textContent =
        interviewNote;

    noteButton.addEventListener(
    "click",
    () => {

        const isCurrentlyHidden =
            getComputedStyle(noteBox).display === "none";

        if (isCurrentlyHidden) {

            noteBox.style.display = "block";

            noteButton.textContent =
                "📝 Hide Note";

        } else {

            noteBox.style.display = "none";

            noteButton.textContent =
                "📝 View Note";

        }

    }
);

}

            historyList.appendChild(card);

        });

}


// ==========================================
// FILTER EVENTS
// ==========================================

if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        displayHistory
    );

}


if (difficultyFilter) {

    difficultyFilter.addEventListener(
        "change",
        displayHistory
    );

}


// ==========================================
// INITIAL LOAD
// ==========================================

displayHistory();


// ==========================================
// CONSOLE
// ==========================================

console.log(
    "Interview History:",
    interviewScores
);