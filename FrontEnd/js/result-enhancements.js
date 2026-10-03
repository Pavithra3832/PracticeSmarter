(function () {

    // ======================================
    // INTERVIEW NOTES
    // ======================================

    function getLatestInterviewKey() {

        const savedSessionId =
            sessionStorage.getItem("savedInterviewSessionId");

        if (savedSessionId) {
            return `interviewNote_${savedSessionId}`;
        }

        return "interviewNote_latest";
    }


    function setupInterviewNotes() {

        const notes =
            document.getElementById("interview-notes");

        const counter =
            document.getElementById("notes-counter");

        const saveButton =
            document.getElementById("save-notes-button");

        const status =
            document.getElementById("notes-status");

        if (!notes || !counter || !saveButton) {
            return;
        }


        const noteKey =
            getLatestInterviewKey();

        const savedNote =
            localStorage.getItem(noteKey);

        if (savedNote) {
            notes.value = savedNote;
        }


        function updateCounter() {

            counter.textContent =
                `${notes.value.length} / 500`;

        }


        notes.addEventListener(
            "input",
            updateCounter
        );


        saveButton.addEventListener(
            "click",
            () => {

                const note =
                    notes.value.trim();

                localStorage.setItem(
                    noteKey,
                    note
                );

                if (status) {

                    status.textContent =
                        "✅ Your interview note has been saved.";

                    setTimeout(() => {
                        status.textContent = "";
                    }, 2500);

                }
            }
        );


        updateCounter();
    }


    // ======================================
    // READ SCORE
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

        }, 500);


        setTimeout(() => {

            generateSkillPlan();

        }, 1500);


        setTimeout(() => {

            generateSkillPlan();

        }, 3000);
    }


    // ======================================
    // START
    // ======================================

    window.addEventListener(
        "load",
        () => {

            setupInterviewNotes();

            watchForFinalScores();

        }
    );

})();