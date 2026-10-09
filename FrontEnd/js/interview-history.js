// ==========================================
// PRACTICESMARTER - INTERVIEW HISTORY
// Interview Scores + Session-Based Saved Notes
// Existing filters, scores and Practice Again preserved
// ==========================================

import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDnR_HHjMjsUanr0ZIC1uwyEDJQ2aVxqTU",
    authDomain: "ai-interview-practice-pl-acc38.firebaseapp.com",
    projectId: "ai-interview-practice-pl-acc38",
    storageBucket: "ai-interview-pr-acc38.firebasestorage.app",
    messagingSenderId: "64194969019",
    appId: "1:64194969019:web:83b2addcd10f5a9f74989e",
    measurementId: "G-PL54GCRDF6"
};

const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const historyList = document.getElementById("history-list");
const categoryFilter = document.getElementById("history-category");
const difficultyFilter = document.getElementById("history-difficulty");
const savedNotesList = document.getElementById("saved-notes-list");

// Notes are indexed by the unique interview session ID.
const notesBySessionId = new Map();

// ==========================================
// LOAD LOCAL INTERVIEW HISTORY
// ==========================================

function getInterviewScores() {
    try {
        const data = JSON.parse(
            localStorage.getItem("interviewScores") || "[]"
        );

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Could not read interview scores:", error);
        return [];
    }
}

const interviewScores = getInterviewScores();

// ==========================================
// EMPTY STATES
// ==========================================

function showHistoryEmpty(title, description) {
    if (!historyList) return;

    historyList.innerHTML = "";

    const empty = document.createElement("div");
    empty.className = "history-empty";

    const icon = document.createElement("div");
    icon.className = "history-empty-icon";
    icon.textContent = "📚";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = description;

    empty.append(icon, heading, paragraph);
    historyList.appendChild(empty);
}

function showNotesMessage(title, description) {
    if (!savedNotesList) return;

    savedNotesList.innerHTML = "";

    const empty = document.createElement("div");
    empty.className = "history-empty";

    const icon = document.createElement("div");
    icon.className = "history-empty-icon";
    icon.textContent = "📝";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = description;

    empty.append(icon, heading, paragraph);
    savedNotesList.appendChild(empty);
}

// ==========================================
// DISPLAY INTERVIEW HISTORY
// ==========================================

function displayHistory() {
    if (!historyList) return;

    let history = interviewScores.filter(result =>
        result &&
        typeof result === "object" &&
        result.category &&
        Number.isFinite(Number(result.overall)) &&
        Number(result.overall) >= 0
    );

    const selectedCategory = categoryFilter?.value || "all";

    if (selectedCategory !== "all") {
        history = history.filter(
            result => result.category === selectedCategory
        );
    }

    const selectedDifficulty = difficultyFilter?.value || "all";

    if (selectedDifficulty !== "all") {
        history = history.filter(
            result => result.difficulty === selectedDifficulty
        );
    }

    historyList.innerHTML = "";

    if (history.length === 0) {
        showHistoryEmpty(
            "No interview history found",
            "Complete an interview to see your results here."
        );
        return;
    }

    history.slice().reverse().forEach(result => {
        const category = String(result.category || "Interview");

        const difficulty =
            result.difficulty && result.difficulty !== "null"
                ? String(result.difficulty)
                : "All Difficulties";

        const score = Math.round(Number(result.overall));
        const date = String(result.date || "Date unavailable");

        const sessionId =
            typeof result.sessionId === "string"
                ? result.sessionId
                : "";

        // Main result card
        const card = document.createElement("div");
        card.className = "history-card";

        const info = document.createElement("div");
        info.className = "history-info";

        const heading = document.createElement("h3");
        heading.textContent = category;

        const details = document.createElement("p");
        details.textContent = `${category} • ${difficulty}`;

        const dateElement = document.createElement("small");
        dateElement.textContent = date;

        // Preserve Practice Again functionality
        const practiceButton = document.createElement("button");
        practiceButton.type = "button";
        practiceButton.className = "practice-again-button";
        practiceButton.textContent = "Practice Again →";

        practiceButton.addEventListener("click", () => {
            const targetCategory = encodeURIComponent(category);
            const targetDifficulty = encodeURIComponent(difficulty);

            window.location.href =
                `technical-interview.html?category=${targetCategory}&difficulty=${targetDifficulty}`;
        });

        info.append(
            heading,
            details,
            dateElement,
            practiceButton
        );

        const scoreElement = document.createElement("div");
        scoreElement.className = "history-score";
        scoreElement.textContent = `${score}%`;

        card.append(info, scoreElement);

        // ======================================
        // NOTES FOR THIS EXACT INTERVIEW SESSION
        // ======================================

        const notesArea = document.createElement("div");
        notesArea.className = "history-card-notes";

        const note = sessionId
            ? notesBySessionId.get(sessionId)
            : null;

        if (note && typeof note.note === "string" && note.note.trim()) {
            const toggleButton = document.createElement("button");
            toggleButton.type = "button";
            toggleButton.className = "history-note-toggle";
            toggleButton.textContent = "📝 View Notes";
            toggleButton.setAttribute("aria-expanded", "false");

            const notePanel = document.createElement("div");
            notePanel.className = "history-note-panel";
            notePanel.hidden = true;

            const noteHeading = document.createElement("h4");
            noteHeading.textContent = "📝 Your Interview Notes";

            const noteText = document.createElement("p");
            noteText.className = "history-note-text";
            noteText.textContent = note.note;

            const noteDate = document.createElement("small");
            noteDate.className = "history-note-date";

            const timestamp = note.updatedAt?.toDate?.();

            noteDate.textContent = timestamp
                ? `Last saved: ${timestamp.toLocaleString()}`
                : note.localOnly
                    ? "Saved on this device"
                    : "Saved date unavailable";

            notePanel.append(noteHeading, noteText, noteDate);

            toggleButton.addEventListener("click", () => {
                const isOpening = notePanel.hidden;

                notePanel.hidden = !isOpening;
                toggleButton.textContent = isOpening
                    ? "▾ Hide Notes"
                    : "📝 View Notes";

                toggleButton.setAttribute(
                    "aria-expanded",
                    String(isOpening)
                );
            });

            notesArea.append(toggleButton, notePanel);
        } else {
            const noNote = document.createElement("p");
            noNote.className = "history-no-note";
            noNote.textContent = "📝 No note saved for this interview.";

            notesArea.appendChild(noNote);
        }

        card.appendChild(notesArea);
        historyList.appendChild(card);
    });
}

// ==========================================
// DISPLAY SEPARATE "MY SAVED NOTES" SECTION
// ==========================================

function displaySavedNotes(notes) {
    if (!savedNotesList) return;

    savedNotesList.innerHTML = "";

    if (notes.length === 0) {
        showNotesMessage(
            "No saved notes yet",
            "Save a note on your interview result page. Then refresh this page."
        );
        return;
    }

    notes.forEach(data => {
        const card = document.createElement("article");
        card.className = "saved-note-card";

        const heading = document.createElement("h3");
        heading.textContent =
            `${data.category || "Interview"} — ${data.difficulty || "Difficulty not specified"}`;

        const meta = document.createElement("div");
        meta.className = "saved-note-meta";
        meta.textContent = "📝 Personal Interview Note";

        const content = document.createElement("p");
        content.className = "saved-note-content";
        content.textContent = data.note || "";

        const date = document.createElement("small");
        date.className = "saved-note-date";

        const timestamp = data.updatedAt?.toDate?.();

        date.textContent = timestamp
            ? `Last saved: ${timestamp.toLocaleString()}`
            : data.localOnly
                ? "Saved on this device"
                : "Saved date unavailable";

        card.append(heading, meta, content, date);
        savedNotesList.appendChild(card);
    });
}

// ==========================================
// LOAD LOCAL NOTES USING SESSION IDs
// ==========================================

function getLocalSavedNotes() {
    const notes = [];
    const prefix = "practiceSmarterNotes_";

    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (!key || !key.startsWith(prefix)) continue;

            const noteText = localStorage.getItem(key);

            if (typeof noteText !== "string" || !noteText.trim()) {
                continue;
            }

            const sessionId = key.slice(prefix.length);

            // Use the matching history record for its metadata.
            const matchingResult = interviewScores.find(
                result => result?.sessionId === sessionId
            );

            notes.push({
                sessionId,
                note: noteText,
                category: matchingResult?.category || "Interview",
                difficulty:
                    matchingResult?.difficulty || "Saved interview",
                localOnly: true
            });
        }
    } catch (error) {
        console.error("Local notes read failed:", error);
    }

    return notes;
}

// ==========================================
// LOAD LOCAL + FIRESTORE NOTES
// ==========================================

async function loadSavedNotes(user) {
    const localNotes = getLocalSavedNotes();

    console.log("Local saved notes found:", localNotes.length);

    // Local notes are available even when signed out.
    const merged = new Map();

    localNotes.forEach(note => {
        merged.set(note.sessionId, note);
    });

    if (user) {
        try {
            const notesQuery = query(
                collection(db, "interviewNotes"),
                where("userId", "==", user.uid)
            );

            const snapshot = await getDocs(notesQuery);

            const cloudNotes = snapshot.docs
                .map(docSnapshot => {
                    const data = docSnapshot.data();

                    return {
                        ...data,
                        sessionId: data.sessionId || docSnapshot.id,
                        localOnly: false
                    };
                })
                .filter(item =>
                    typeof item.note === "string" &&
                    item.note.trim() &&
                    typeof item.sessionId === "string"
                );

            // Cloud note takes priority for the same session.
            cloudNotes.forEach(note => {
                merged.set(note.sessionId, note);
            });

            console.log("Firestore notes found:", cloudNotes.length);
        } catch (error) {
            console.error("Firestore notes load failed:", error);
        }
    }

    // Refresh the note lookup used by each history card.
    notesBySessionId.clear();

    merged.forEach((note, sessionId) => {
        notesBySessionId.set(sessionId, note);
    });

    const allNotes = [...merged.values()];

    displaySavedNotes(allNotes);
    displayHistory();

    console.log("Notes displayed:", allNotes.length);
    console.log("History cards loaded:", interviewScores.length);
}

// ==========================================
// FILTERS + INITIAL DISPLAY
// ==========================================

categoryFilter?.addEventListener("change", displayHistory);
difficultyFilter?.addEventListener("change", displayHistory);

displayHistory();

// Wait for Firebase authentication before loading cloud notes.
onAuthStateChanged(auth, user => {
    loadSavedNotes(user);
});

console.log("Interview history loaded:", interviewScores);

