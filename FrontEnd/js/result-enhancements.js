(function () {

    // ======================================
    // INTERVIEW NOTES
    // ======================================

function setupInterviewNotes() {

    const notes = document.getElementById("interview-notes");
    const counter = document.getElementById("notes-counter");
    const saveButton = document.getElementById("save-notes-button");
    const status = document.getElementById("notes-status");

    if (!notes || !counter || !saveButton) {
        console.log("❌ Interview Notes elements not found");
        return;
    }

    function updateCounter() {
        counter.textContent = `${notes.value.length} / 500`;
    }

    // ======================================
    // GET CURRENT INTERVIEW SESSION ID
    // ======================================

    const sessionId =
        sessionStorage.getItem("interviewSessionId") ||
        sessionStorage.getItem("savedInterviewSessionId");

    if (!sessionId) {
        console.warn("⚠️ Interview session ID not found.");
    }

    // ======================================
    // LOAD NOTE FOR THIS INTERVIEW ONLY
    // ======================================

    let savedNote = "";

    if (sessionId) {
        savedNote =
            localStorage.getItem(
                `interviewNote_${sessionId}`
            ) || "";
    }

    if (savedNote) {
        notes.value = savedNote;

        console.log(
            "✅ Interview note loaded for session:",
            sessionId
        );
    } else {
        // IMPORTANT:
        // Do not load the previous interview's note.
        notes.value = "";
    }

    updateCounter();

    // ======================================
    // SAVE NOTE
    // ======================================

    saveButton.addEventListener("click", () => {

        const note = notes.value.trim();

        if (!sessionId) {
            console.warn(
                "⚠️ Cannot save interview note: session ID missing."
            );
            return;
        }

        // Save note specifically for this interview
        localStorage.setItem(
            `interviewNote_${sessionId}`,
            note
        );

        // Keep latest note separately for compatibility
        localStorage.setItem(
            "interviewNote_latest",
            note
        );

        console.log(
            "✅ Interview note saved for session:",
            sessionId,
            note
        );

        if (status) {
            status.textContent =
                "✅ Your interview note has been saved.";

            setTimeout(() => {
                status.textContent = "";
            }, 2500);
        }

        updateCounter();
    });

    // ======================================
    // UPDATE COUNTER
    // ======================================

    notes.addEventListener(
        "input",
        updateCounter
    );
}  

// ======================================
//  // READ SCORE
// ======================================

    function readScore(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return null;
        }

        const match =
            element.textContent.match(
                /(\d+(?:\.\d+)?)\s*\/\s*10/
            );

        if (!match) {
            return null;
        }

        return Number(match[1]);
    }


    // ======================================
    // CHECK WHETHER FINAL SCORE IS READY
    // ======================================

    function finalScoreReady(scoreId, feedbackId) {

        const scoreElement =
            document.getElementById(scoreId);

        const feedbackElement =
            document.getElementById(feedbackId);

        if (!scoreElement || !feedbackElement) {
            return false;
        }


        const score =
            readScore(scoreId);

        if (score === null) {
            return false;
        }


        const feedback =
            feedbackElement.textContent.trim().toLowerCase();

        if (
            feedback.includes("analyzing") ||
            feedback.includes("calculating")
        ) {
            return false;
        }


        return true;
    }


    // ======================================
    // GENERATE SKILL PLAN
    // ======================================

    function generateSkillPlan() {

        const container =
            document.getElementById(
                "skill-improvement-container"
            );

        if (!container) {
            return false;
        }


        const technical =
            readScore("technical-score");

        const communication =
            readScore("communication-score");

        const confidence =
            readScore("confidence-score");


        if (
            technical === null ||
            communication === null ||
            confidence === null
        ) {
            return false;
        }


        if (
            !finalScoreReady(
                "technical-score",
                "technical-feedback"
            ) ||

            !finalScoreReady(
                "communication-score",
                "communication-feedback"
            ) ||

            !finalScoreReady(
                "confidence-score",
                "confidence-feedback"
            )
        ) {
            return false;
        }


        let technicalText;
        let communicationText;
        let confidenceText;


        // ==================================
        // TECHNICAL
        // ==================================

        if (technical < 5) {

            technicalText =
                "Revise core concepts and practice easy technical questions.";

        } else if (technical < 8) {

            technicalText =
                "Practice medium-level questions and explain concepts with examples.";

        } else {

            technicalText =
                "Excellent technical performance. Challenge yourself with harder interview questions.";
        }


        // ==================================
        // COMMUNICATION
        // ==================================

        if (communication < 5) {

            communicationText =
                "Practice speaking clearly and structure each answer step by step.";

        } else if (communication < 8) {

            communicationText =
                "Add real examples and keep your explanations concise.";

        } else {

            communicationText =
                "Strong communication. Continue giving clear, structured interview answers.";
        }


        // ==================================
        // CONFIDENCE
        // ==================================

        if (confidence < 5) {

            confidenceText =
                "Practice speaking aloud to become more comfortable answering questions.";

        } else if (confidence < 8) {

            confidenceText =
                "Continue mock interviews to build consistency and confidence.";

        } else {

            confidenceText =
                "Excellent confidence. Maintain it with regular timed interview practice.";
        }


        // ==================================
        // DISPLAY
        // ==================================

        container.innerHTML = `

            <div class="skill-plan-item">

                <span class="skill-plan-icon">
                    💻
                </span>

                <div>

                    <strong>
                        Technical Skills
                    </strong>

                    <p>
                        ${technicalText}
                    </p>

                </div>

            </div>


            <div class="skill-plan-item">

                <span class="skill-plan-icon">
                    🎤
                </span>

                <div>

                    <strong>
                        Communication
                    </strong>

                    <p>
                        ${communicationText}
                    </p>

                </div>

            </div>


            <div class="skill-plan-item">

                <span class="skill-plan-icon">
                    🙂
                </span>

                <div>

                    <strong>
                        Confidence
                    </strong>

                    <p>
                        ${confidenceText}
                    </p>

                </div>

            </div>

        `;

        return true;
    }

    function generatePersonalizedSuggestion() {
    const recommendationText =
        document.getElementById("recommendation-text");

    if (!recommendationText) {
        return;
    }

    const technical = readScore("technical-score");
    const communication = readScore("communication-score");
    const confidence = readScore("confidence-score");

    if (
        technical === null ||
        communication === null ||
        confidence === null
    ) {
        return;
    }

    if (
        !finalScoreReady(
            "technical-score",
            "technical-feedback"
        ) ||
        !finalScoreReady(
            "communication-score",
            "communication-feedback"
        ) ||
        !finalScoreReady(
            "confidence-score",
            "confidence-feedback"
        )
    ) {
        return;
    }

    const scores = [
        {
            name: "technical skills",
            score: technical,
            advice: "Revise core concepts and practice more technical interview questions."
        },
        {
            name: "communication",
            score: communication,
            advice: "Practice explaining your answers clearly and use simple real-world examples."
        },
        {
            name: "confidence",
            score: confidence,
            advice: "Practice speaking your answers aloud and attend more mock interviews."
        }
    ];

    scores.sort((a, b) => a.score - b.score);

    const weakest = scores[0];

    recommendationText.textContent =
        `Your main area to improve is ${weakest.name}. ${weakest.advice}`;
}


    // ======================================
    // WATCH RESULT.JS SCORE UPDATES
    // ======================================

    function watchForFinalScores() {

        const scoreElements = [
            document.getElementById("technical-score"),
            document.getElementById("communication-score"),
            document.getElementById("confidence-score"),
            document.getElementById("technical-feedback"),
            document.getElementById("communication-feedback"),
            document.getElementById("confidence-feedback")
        ];


        const validElements =
            scoreElements.filter(Boolean);


        if (validElements.length === 0) {
            return;
        }


        const observer =
            new MutationObserver(() => {

                generateSkillPlan();
                generatePersonalizedSuggestion();


            });


        validElements.forEach(element => {

            observer.observe(
                element,
                {
                    childList: true,
                    characterData: true,
                    subtree: true
                }
            );

        });


        // Also check once after result processing
        setTimeout(() => {

            generateSkillPlan();
            generatePersonalizedSuggestion();


        }, 500);


        setTimeout(() => {
            generateSkillPlan();
                generatePersonalizedSuggestion();


        }, 1500);


        setTimeout(() => {

            generateSkillPlan();
                generatePersonalizedSuggestion();


        }, 3000);
    }


    // ======================================
    // START
    // ======================================

window.addEventListener("load", () => {
    // Wait until result page is completely ready
    setTimeout(() => {

        setupInterviewNotes();
        watchForFinalScores();

    }, 1000);

});
    // ======================================
    // ANSWER STATUS COLORS
    // ======================================

    function applyAnswerStatusColors() {

        const container =
            document.getElementById("answer-review-container");

        if (!container) {
            return;
        }

        container
            .querySelectorAll(".answer-status")
            .forEach(status => {

                const text =
                    status.textContent.trim().toLowerCase();

                // Remove old classes first
                status.classList.remove(
                    "status-correct",
                    "status-improvement"
                );

                // Correct → Green
                if (text.includes("correct")) {

                    status.classList.add(
                        "status-correct"
                    );

                }

                // Needs Improvement → Orange
                else if (
                    text.includes("needs improvement")
                ) {

                    status.classList.add(
                        "status-improvement"
                    );

                }

            });
    }

    // Watch dynamically generated Answer Review cards
    const answerReviewContainer =
        document.getElementById(
            "answer-review-container"
        );

    if (answerReviewContainer) {

        const answerStatusObserver =
            new MutationObserver(() => {

                applyAnswerStatusColors();

            });

        answerStatusObserver.observe(
            answerReviewContainer,
            {
                childList: true,
                subtree: true,
                characterData: true
            }
        );

        // Initial check
        applyAnswerStatusColors();
    }
})();