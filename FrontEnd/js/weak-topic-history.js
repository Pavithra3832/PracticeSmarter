(function () {

    // ======================================
    // SAVE DETECTED WEAK TOPICS
    // ======================================

    function saveDetectedWeakTopics() {

        const weakTopicCards =
            document.querySelectorAll(
                "#weak-topic-container .weak-topic-card"
            );

        if (!weakTopicCards.length) {
            return;
        }


        const sessionId =
    sessionStorage.getItem(
        "interviewSessionId"
    ) ||
    sessionStorage.getItem(
        "savedInterviewSessionId"
    ) ||
    Date.now().toString();

    if (
    sessionStorage.getItem("weakTopicsAlreadySaved") ===
    sessionId
) {
    return;
}

        let history =
            JSON.parse(
                localStorage.getItem(
                    "weakTopicHistory"
                )
            ) || [];


        const existingIndex =
            history.findIndex(
                item =>
                    item.sessionId === sessionId
            );


        const topics = [];


        weakTopicCards.forEach(card => {

            const topicElement =
                card.querySelector("strong");

            const countElement =
                card.querySelector(
                    ".weak-topic-practice"
                );


            if (!topicElement) {
                return;
            }


            const topic =
                topicElement.textContent.trim();


            let count = 1;


            if (countElement) {

                const match =
                    countElement.textContent.match(
                        /(\d+)/
                    );

                if (match) {
                    count = Number(match[1]);
                }

            }


            topics.push({
                topic,
                count
            });

        });


        if (!topics.length) {
            return;
        }


        const record = {
            sessionId,
            topics,
            savedAt: new Date().toISOString()
        };


        if (existingIndex >= 0) {

            history[existingIndex] =
                record;

        } else {

            history.push(record);

        }


        localStorage.setItem(
            "weakTopicHistory",
            JSON.stringify(history)
        );

        sessionStorage.setItem(
    "weakTopicsAlreadySaved",
    sessionId
);


        console.log(
            "✅ Weak topics saved:",
            topics
        );
    }


    // ======================================
    // WATCH RESULT PAGE
    // ======================================

    function startWeakTopicHistory() {

        const container =
            document.getElementById(
                "weak-topic-container"
            );


        if (!container) {
            return;
        }


        const observer =
            new MutationObserver(() => {

                saveDetectedWeakTopics();

            });


        observer.observe(
            container,
            {
                childList: true,
                subtree: true
            }
        );


        setTimeout(
            saveDetectedWeakTopics,
            1000
        );

        setTimeout(
            saveDetectedWeakTopics,
            2500
        );

        setTimeout(
            saveDetectedWeakTopics,
            5000
        );
    }


    window.addEventListener(
        "load",
        startWeakTopicHistory
    );

})();