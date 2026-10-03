(function () {

    // ======================================
    // WEAK TOPIC DETECTION
    // ======================================

    const topicMap = {

        HTML: [
            {
                name: "Semantic HTML",
                keywords: [
                    "semantic",
                    "header",
                    "footer",
                    "section",
                    "article",
                    "nav",
                    "aside"
                ]
            },
            {
                name: "Forms & Inputs",
                keywords: [
                    "form",
                    "input",
                    "textarea",
                    "label",
                    "validation"
                ]
            },
            {
                name: "HTML Attributes",
                keywords: [
                    "attribute",
                    "id",
                    "class",
                    "alt",
                    "href",
                    "src"
                ]
            },
            {
                name: "Multimedia",
                keywords: [
                    "audio",
                    "video",
                    "iframe",
                    "image",
                    "media"
                ]
            },
            {
                name: "Accessibility",
                keywords: [
                    "accessibility",
                    "aria",
                    "screen reader"
                ]
            }
        ],

        CSS: [
            {
                name: "Flexbox",
                keywords: [
                    "flexbox",
                    "flex",
                    "justify-content",
                    "align-items"
                ]
            },
            {
                name: "CSS Grid",
                keywords: [
                    "grid",
                    "grid-template",
                    "grid area"
                ]
            },
            {
                name: "Box Model",
                keywords: [
                    "box model",
                    "margin",
                    "padding",
                    "border",
                    "content box"
                ]
            },
            {
                name: "Selectors & Specificity",
                keywords: [
                    "selector",
                    "specificity",
                    "pseudo-class",
                    "pseudo element"
                ]
            },
            {
                name: "Responsive Design",
                keywords: [
                    "responsive",
                    "media query",
                    "mobile",
                    "viewport"
                ]
            }
        ],

        JavaScript: [
            {
                name: "Variables & Scope",
                keywords: [
                    "var",
                    "let",
                    "const",
                    "scope",
                    "hoisting"
                ]
            },
            {
                name: "Functions & Closures",
                keywords: [
                    "function",
                    "closure",
                    "callback",
                    "arrow function"
                ]
            },
            {
                name: "DOM & Events",
                keywords: [
                    "dom",
                    "document",
                    "event",
                    "onclick",
                    "addEventListener"
                ]
            },
            {
                name: "Async JavaScript",
                keywords: [
                    "promise",
                    "async",
                    "await",
                    "fetch",
                    "asynchronous"
                ]
            },
            {
                name: "Arrays & Objects",
                keywords: [
                    "array",
                    "object",
                    "map",
                    "filter",
                    "reduce"
                ]
            }
        ],

        Python: [
            {
                name: "Python Data Types",
                keywords: [
                    "list",
                    "tuple",
                    "set",
                    "dictionary",
                    "data type"
                ]
            },
            {
                name: "Functions",
                keywords: [
                    "function",
                    "def",
                    "lambda",
                    "parameter"
                ]
            },
            {
                name: "Object-Oriented Programming",
                keywords: [
                    "class",
                    "object",
                    "inheritance",
                    "polymorphism",
                    "encapsulation"
                ]
            },
            {
                name: "Exception Handling",
                keywords: [
                    "exception",
                    "try",
                    "except",
                    "finally"
                ]
            },
            {
                name: "Modules & Packages",
                keywords: [
                    "module",
                    "package",
                    "import",
                    "pip"
                ]
            }
        ],

        Java: [
            {
                name: "OOP Concepts",
                keywords: [
                    "class",
                    "object",
                    "inheritance",
                    "polymorphism",
                    "encapsulation"
                ]
            },
            {
                name: "Exception Handling",
                keywords: [
                    "exception",
                    "try",
                    "catch",
                    "finally"
                ]
            },
            {
                name: "Collections",
                keywords: [
                    "arraylist",
                    "hashmap",
                    "collection",
                    "list",
                    "set"
                ]
            },
            {
                name: "Interfaces & Abstraction",
                keywords: [
                    "interface",
                    "abstract",
                    "abstraction"
                ]
            },
            {
                name: "Multithreading",
                keywords: [
                    "thread",
                    "multithreading",
                    "synchronized"
                ]
            }
        ]
    };


    const topicAdvice = {

        "Semantic HTML":
            "Review semantic elements and practice building accessible page structures.",

        "Forms & Inputs":
            "Practice HTML forms, input types and client-side validation.",

        "HTML Attributes":
            "Review commonly used HTML attributes and their purposes.",

        "Multimedia":
            "Practice using images, audio, video and embedded content.",

        "Accessibility":
            "Review ARIA basics and accessible HTML practices.",

        "Flexbox":
            "Practice alignment, direction, wrapping and common Flexbox layouts.",

        "CSS Grid":
            "Practice grid columns, rows, areas and responsive layouts.",

        "Box Model":
            "Review content, padding, border and margin with practical examples.",

        "Selectors & Specificity":
            "Practice selectors, specificity and pseudo-classes.",

        "Responsive Design":
            "Practice media queries and responsive layouts for different screen sizes.",

        "Variables & Scope":
            "Review var, let, const, scope and hoisting with examples.",

        "Functions & Closures":
            "Practice functions, callbacks, arrow functions and closures.",

        "DOM & Events":
            "Practice DOM selection, manipulation and event handling.",

        "Async JavaScript":
            "Practice Promises, async/await and asynchronous data fetching.",

        "Arrays & Objects":
            "Practice array methods and object manipulation.",

        "Python Data Types":
            "Review lists, tuples, sets and dictionaries with practical examples.",

        "Functions":
            "Practice function definitions, parameters, return values and lambdas.",

        "Object-Oriented Programming":
            "Review classes, objects and the main OOP concepts.",

        "Exception Handling":
            "Practice try, except/catch and finally with real examples.",

        "Modules & Packages":
            "Review imports, modules, packages and dependency management.",

        "OOP Concepts":
            "Review inheritance, polymorphism, encapsulation and abstraction.",

        "Collections":
            "Practice Java collections and choose the right collection for each task.",

        "Interfaces & Abstraction":
            "Review interfaces, abstract classes and abstraction.",

        "Multithreading":
            "Review threads, synchronization and basic concurrent programming."
    };


    function getCategory() {

    return (
        localStorage.getItem(
            "interviewCategory"
        ) || "HTML"
    );
}


    function detectTopics() {

        const container =
            document.getElementById(
                "weak-topic-container"
            );

        const reviewContainer =
            document.getElementById(
                "answer-review-container"
            );

        if (!container || !reviewContainer) {
            return false;
        }


        const cards =
            reviewContainer.querySelectorAll(
                ".answer-card"
            );

        if (!cards.length) {
            return false;
        }


        const category =
            getCategory();

        const topics =
            topicMap[category] || [];

        const topicCounts = {};


        cards.forEach(card => {

            const statusElement =
    card.querySelector(".answer-status");

if (!statusElement) {
    return;
}

const statusText =
    statusElement.textContent
        .trim()
        .toLowerCase();

const isWrong =
    statusText.includes("needs improvement") ||
    statusText.includes("incorrect") ||
    statusText.includes("wrong");

if (!isWrong) {
    return;
}


            const questionElement =
                card.querySelector(".question") ||
                card.querySelector("h3");


            if (!questionElement) {
                return;
            }


            const question =
                questionElement.textContent
                    .toLowerCase();


            let matched = false;


            topics.forEach(topic => {

                const isMatch =
                    topic.keywords.some(keyword =>
                        question.includes(
                            keyword.toLowerCase()
                        )
                    );


                if (isMatch) {

                    topicCounts[topic.name] =
                        (topicCounts[topic.name] || 0) + 1;

                    matched = true;
                }

            });


            if (!matched) {

                topicCounts["Core Concepts"] =
                    (topicCounts["Core Concepts"] || 0) + 1;

            }

        });


        const weakTopics =
            Object.entries(topicCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);


        if (!weakTopics.length) {

            container.innerHTML = `

                <div class="weak-topic-empty">

                    <span>
                        🌟
                    </span>

                    <p>
                        No weak topics detected. Excellent work!
                        Continue practicing advanced questions to maintain your performance.
                    </p>

                </div>

            `;

            return true;
        }


        container.innerHTML =
            weakTopics
                .map(([topic, count]) => {

                    const advice =
                        topicAdvice[topic] ||
                        "Review the related concepts and practice more questions.";

                    return `

                        <div class="weak-topic-card">

                            <div class="weak-topic-icon">
                                🎯
                            </div>

                            <strong>
                                ${topic}
                            </strong>

                            <p>
                                ${advice}
                            </p>

                            <span class="weak-topic-practice">
                                ${count} question${count > 1 ? "s" : ""} to review
                            </span>

                        </div>

                    `;

                })
                .join("");

        return true;
    }


    function startDetection() {

        if (detectTopics()) {
            return;
        }


        const reviewContainer =
            document.getElementById(
                "answer-review-container"
            );

        if (!reviewContainer) {
            return;
        }


        const observer =
            new MutationObserver(() => {

                detectTopics();

            });


        observer.observe(
            reviewContainer,
            {
                childList: true,
                subtree: true
            }
        );


        setTimeout(
            detectTopics,
            1000
        );

        setTimeout(
            detectTopics,
            2500
        );

        setTimeout(
            detectTopics,
            5000
        );
    }


    window.addEventListener(
        "load",
        startDetection
    );

})();