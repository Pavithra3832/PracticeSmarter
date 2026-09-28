// ========================================
// FIREBASE AUTH
// ========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


// ========================================
// FIREBASE CONFIG
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyDnR_HHjMjsUanr0ZIC1uwyEDJQ2aVxqTU",
    authDomain: "ai-interview-practice-pl-acc38.firebaseapp.com",
    projectId: "ai-interview-practice-pl-acc38",
    storageBucket: "ai-interview-practice-pl-acc38.firebasestorage.app",
    messagingSenderId: "64194969019",
    appId: "1:64194969019:web:83b2addcd10f5a9f74989e",
    measurementId: "G-PL54GCRDF6"
};



// ========================================
// INITIALIZE FIREBASE
// ========================================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// ========================================
// HR INTERVIEW - PRACTICESMARTER
// ========================================


// ========================================
// LOGIN PROTECTION
// ========================================

if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
}


// ========================================
// HR QUESTION SETS
// 15 QUESTIONS EACH
// ========================================

const questionSets = {

    // ========================================
    // EASY - 10 QUESTIONS
    // ========================================

    Easy: [

        {
            question: "Tell me about yourself.",
            answer: "Start with your education, key skills, projects, and career goal. Keep your answer short, relevant, and confident."
        },

        {
            question: "What are your strengths?",
            answer: "Mention two or three genuine strengths and support them with a short example from your studies, projects, or experience."
        },

        {
            question: "What is your weakness?",
            answer: "Mention a genuine weakness that you are actively improving and explain the steps you are taking to overcome it."
        },

        {
            question: "Why do you want to join our company?",
            answer: "Explain what interests you about the company, its work, learning opportunities, and how the role matches your career goals."
        },

        {
            question: "Why should we hire you?",
            answer: "Highlight your relevant skills, willingness to learn, problem-solving ability, and how you can contribute to the team."
        },

        {
            question: "What are your career goals?",
            answer: "Explain your short-term and long-term goals and connect them with the role and skills you want to develop."
        },

        {
            question: "Are you comfortable working in a team?",
            answer: "Yes. Explain how you communicate, share responsibilities, support teammates, and work toward a common goal."
        },

        {
            question: "How do you handle feedback?",
            answer: "Explain that you listen carefully, understand the feedback, identify areas for improvement, and apply it to your work."
        },

        {
            question: "What motivates you?",
            answer: "Talk about things such as learning, solving problems, achieving goals, taking responsibility, or creating useful work."
        },

        {
            question: "Where do you see yourself in five years?",
            answer: "Describe a realistic career direction where you have developed strong skills, taken more responsibility, and contributed to your organization."
        },

    ],


    // ========================================
    // MEDIUM - 15 QUESTIONS
    // ========================================

    Medium: [

        {
            question: "Tell me about a challenging project you worked on.",
            answer: "Describe the project, the challenge you faced, what action you took, and the result. Focus on your own contribution."
        },

        {
            question: "Tell me about a time you made a mistake.",
            answer: "Briefly explain the mistake, take responsibility, describe how you corrected it, and explain what you learned."
        },

        {
            question: "How do you handle pressure?",
            answer: "Explain how you prioritize tasks, stay organized, divide large tasks into smaller steps, and remain focused."
        },

        {
            question: "How do you handle conflict with a teammate?",
            answer: "Explain that you listen to the other person's perspective, communicate respectfully, focus on the problem, and work toward a solution."
        },

        {
            question: "Tell me about a time you showed leadership.",
            answer: "Describe a situation where you took responsibility, organized people or tasks, solved a problem, or helped the team achieve a goal."
        },

        {
            question: "How do you prioritize multiple tasks?",
            answer: "Consider deadlines, importance, dependencies, and effort. Complete urgent and important tasks first while maintaining quality."
        },

        {
            question: "How do you learn a new skill?",
            answer: "Explain your process such as learning fundamentals, practicing regularly, building small projects, and applying the skill to real problems."
        },

        {
            question: "What would you do if you disagreed with your manager?",
            answer: "Respectfully explain your viewpoint with facts, listen to the manager's perspective, and support the final decision professionally."
        },

        {
            question: "Describe a situation where you worked with a difficult person.",
            answer: "Focus on professional communication, understanding the situation, controlling your response, and finding a productive way to work together."
        },

        {
            question: "What makes you different from other candidates?",
            answer: "Focus on your combination of skills, learning attitude, project experience, problem-solving approach, and willingness to improve."
        },

    ],


    // ========================================
    // HARD - 15 QUESTIONS
    // ========================================

    Hard: [

        {
            question: "Tell me about a failure and what you learned from it.",
            answer: "Explain the situation honestly, describe what went wrong, take responsibility, and clearly explain how the experience changed your approach."
        },

        {
            question: "What would you do if you were given a task you had never done before?",
            answer: "Clarify the requirements, research the topic, learn the necessary concepts, ask useful questions, create a plan, and start with a small implementation."
        },

        {
            question: "How would you handle a situation where you strongly disagree with your team?",
            answer: "Listen to everyone's reasoning, present your view with evidence, compare alternatives objectively, and support the final team decision."
        },

        {
            question: "Tell me about a time you had to work with a very short deadline.",
            answer: "Explain how you identified priorities, divided the work, communicated constraints, managed your time, and delivered the most important requirements."
        },

        {
            question: "What would you do if you received negative feedback from your manager?",
            answer: "Listen without becoming defensive, ask for specific examples, identify the improvement areas, create an action plan, and follow up on your progress."
        },

        {
            question: "How would you handle an ethical problem at work?",
            answer: "Understand the facts, follow company policies and professional standards, avoid hiding the issue, and report it through the appropriate channel when necessary."
        },

        {
            question: "Describe a situation where you had to adapt to change.",
            answer: "Explain what changed, how you adjusted your plan or approach, what actions you took, and what the experience taught you."
        },

        {
            question: "What would you do if you had too much work and could not meet every deadline?",
            answer: "Prioritize based on impact and deadlines, communicate early with the relevant person, clarify expectations, and propose a realistic plan."
        },

        {
            question: "How would you respond if a teammate was not contributing?",
            answer: "First understand the reason, communicate privately and respectfully, offer support where appropriate, and involve the team lead if the issue continues."
        },

        {
            question: "Why should we choose you for this role?",
            answer: "Connect your relevant skills, project experience, learning ability, communication, and career goals to the responsibilities of the role."
        },
    ]

};


// ========================================
// GET HTML ELEMENTS
// ========================================

const questionNumber =
    document.getElementById("question-number");

const timerElement =
    document.getElementById("timer");

const progressPercentage =
    document.getElementById("progress-percentage");

const progressFill =
    document.getElementById("progress-fill");

const questionText =
    document.getElementById("question-text");

const questionDifficulty =
    document.getElementById("question-difficulty");

const answerTextarea =
    document.getElementById("answer");

const previousButton =
    document.getElementById("previous-button");

const nextButton =
    document.getElementById("next-button");

const submitButton =
    document.getElementById("submit-button");

const showAnswerButton =
    document.getElementById("show-answer-button");

const modelAnswer =
    document.getElementById("model-answer");

const modelAnswerText =
    document.getElementById("model-answer-text");

const microphoneButton =
    document.getElementById("microphone-answer-button");

const cameraButton =
    document.getElementById("camera-answer-button");

const cameraBox =
    document.querySelector(".camera-box");

const difficultyButtons =
    document.querySelectorAll(".difficulty-button");


let selectedDifficulty = "All";

// By default: ALL 30 questions
let questions = [
    ...questionSets.Easy,
    ...questionSets.Medium,
    ...questionSets.Hard
];

let currentQuestion = 0;

let answers =
    new Array(questions.length).fill("");

let timerInterval = null;

let timeLeft = 60;
// ========================================
// SAVE CURRENT ANSWER
// ========================================

function saveCurrentAnswer() {

    if (!answerTextarea) {
        return;
    }

    answers[currentQuestion] =
        answerTextarea.value.trim();

}


// ========================================
// SAVE INTERVIEW DATA
// ========================================

function saveInterviewData() {

    localStorage.setItem(
        "interviewAnswers",
        JSON.stringify(answers)
    );

    localStorage.setItem(
        "interviewQuestions",
        JSON.stringify(questions)
    );

    localStorage.setItem(
        "interviewCategory",
        "HR Interview"
    );

    localStorage.setItem(
        "interviewDifficulty",
        selectedDifficulty
    );

}


// ========================================
// FORMAT TIMER
// ========================================

function updateTimerDisplay() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;

    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


// ========================================
// START TIMER
// ========================================

function startTimer() {

    clearInterval(timerInterval);

    timeLeft = 60;

    updateTimerDisplay();

    timerInterval = setInterval(() => {

        timeLeft--;

        updateTimerDisplay();

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            saveCurrentAnswer();

            if (currentQuestion < questions.length - 1) {

                currentQuestion++;

                showQuestion();

            } else {

                saveInterviewData();

                window.location.href = "result.html";

            }

        }

    }, 1000);

}


// ========================================
// SHOW QUESTION
// ========================================

function showQuestion() {

    if (!questions[currentQuestion]) {
        return;
    }

    const question =
        questions[currentQuestion];


    // Question number

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;


    // Question

    questionText.textContent =
        question.question;


    // Difficulty

    if (questionDifficulty) {

        questionDifficulty.textContent =
            selectedDifficulty;

    }


    // Answer

    answerTextarea.value =
        answers[currentQuestion] || "";


    // Model answer

    modelAnswerText.textContent =
        question.answer;

    modelAnswer.style.display =
        "none";

    showAnswerButton.textContent =
        "👁 Show Model Answer";


    // ========================================
    // PROGRESS
    // ========================================

    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    progressPercentage.textContent =
        `${Math.round(progress)}%`;

    progressFill.style.width =
        `${progress}%`;


    // ========================================
    // PREVIOUS BUTTON
    // ========================================

    previousButton.disabled =
        currentQuestion === 0;


    // ========================================
    // NEXT / SUBMIT
    // ========================================

    if (currentQuestion === questions.length - 1) {

        nextButton.style.display =
            "none";

        submitButton.style.display =
            "inline-flex";

    } else {

        nextButton.style.display =
            "inline-flex";

        submitButton.style.display =
            "none";

    }


    // Start timer for current question

    startTimer();

}


// ========================================
// DIFFICULTY SELECTION
// ========================================

difficultyButtons.forEach(button => {

    button.addEventListener("click", () => {

        const difficulty =
            button.dataset.difficulty;

        selectedDifficulty =
            difficulty;

        // Selected difficulty = only 10 questions
        questions =
            questionSets[difficulty];

        currentQuestion = 0;

        answers =
            new Array(questions.length).fill("");

        localStorage.setItem(
            "interviewDifficulty",
            difficulty
        );

        // Active button

        difficultyButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        showQuestion();

    });

});

// ========================================
// NEXT QUESTION
// ========================================

nextButton.addEventListener("click", () => {

    saveCurrentAnswer();

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

    }

});


// ========================================
// PREVIOUS QUESTION
// ========================================

previousButton.addEventListener("click", () => {

    saveCurrentAnswer();

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

});


// ========================================
// SUBMIT INTERVIEW
// ========================================

submitButton.addEventListener("click", () => {

    saveCurrentAnswer();

    saveInterviewData();

    clearInterval(timerInterval);

    window.location.href =
        "result.html";

});


// ========================================
// SHOW / HIDE MODEL ANSWER
// ========================================

showAnswerButton.addEventListener("click", () => {

    if (modelAnswer.style.display === "none") {

        modelAnswer.style.display =
            "block";

        showAnswerButton.textContent =
            "🙈 Hide Model Answer";

    } else {

        modelAnswer.style.display =
            "none";

        showAnswerButton.textContent =
            "👁 Show Model Answer";

    }

});


// ========================================
// MICROPHONE / SPEECH RECOGNITION
// ========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;


    microphoneButton.addEventListener("click", () => {

        try {

            recognition.start();

            microphoneButton.querySelector("strong").textContent =
                "Listening...";

            microphoneButton.querySelector("span").textContent =
                "Status: Speak now";

        } catch (error) {

            console.log("Microphone already running.");

        }

    });


    recognition.onresult = (event) => {

        const transcript =
            event.results[0][0].transcript;


        if (answerTextarea.value.trim()) {

            answerTextarea.value +=
                " " + transcript;

        } else {

            answerTextarea.value =
                transcript;

        }


        microphoneButton.querySelector("strong").textContent =
            "Microphone";

        microphoneButton.querySelector("span").textContent =
            "Status: Click to speak";

    };


    recognition.onerror = (event) => {

        console.log(
            "Speech Recognition Error:",
            event.error
        );

        microphoneButton.querySelector("strong").textContent =
            "Microphone";

        microphoneButton.querySelector("span").textContent =
            "Status: Click to speak";

    };


    recognition.onend = () => {

        microphoneButton.querySelector("strong").textContent =
            "Microphone";

        microphoneButton.querySelector("span").textContent =
            "Status: Click to speak";

    };


} else {

    microphoneButton.disabled = true;

    microphoneButton.querySelector("strong").textContent =
        "Not Supported";

    microphoneButton.querySelector("span").textContent =
        "Use Chrome browser";

}
// ========================================
// CAMERA ON / OFF
// ========================================

let cameraStream = null;


// ========================================
// START CAMERA
// ========================================

async function startCamera() {

    try {

        if (!navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia) {

            alert("Camera is not supported in this browser.");

            return;
        }


        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });


        // Camera preview

        cameraBox.innerHTML = `
            <video
                id="camera-video"
                autoplay
                playsinline
                muted>
            </video>

            <button
                id="camera-toggle-button"
                class="camera-toggle-button"
                type="button">

                Turn Off Camera

            </button>
        `;


        const video =
            document.getElementById("camera-video");


        video.srcObject =
            cameraStream;


        // Exact Technical Interview size

        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";
        video.style.borderRadius = "9px";


    } catch (error) {

        console.error("Camera Error:", error);

        cameraStream = null;

        alert(
            "Please allow camera permission in your browser and try again."
        );

    }

}


// ========================================
// STOP CAMERA
// ========================================

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => track.stop());

        cameraStream = null;
    }


    // Restore camera preview

    cameraBox.innerHTML = `
        <div class="camera-icon">
            📷
        </div>

        <span>
            Camera Preview
        </span>

        <small>
            Camera is off
        </small>

        <button
            id="camera-toggle-button"
            class="camera-toggle-button"
            type="button">

            Turn On Camera

        </button>
    `;

}


// ========================================
// TOGGLE CAMERA
// ========================================

function toggleCamera() {

    if (cameraStream) {

        stopCamera();

    } else {

        startCamera();

    }

}


// ========================================
// CAMERA BUTTON INSIDE PREVIEW
// ========================================

cameraBox.addEventListener("click", function(event) {

    if (
        event.target.closest("#camera-toggle-button")
    ) {

        toggleCamera();

    }

});


// ========================================
// CAMERA ICON IN ANSWER BOX
// ========================================

if (cameraButton) {

    cameraButton.addEventListener("click", function() {

        toggleCamera();

    });

}

// ========================================
// ENTER KEY - NEXT QUESTION
// ========================================

answerTextarea.addEventListener("keydown", function (event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        saveCurrentAnswer();

        if (currentQuestion < questions.length - 1) {

            currentQuestion++;

            showQuestion();

        } else {

            saveInterviewData();

            clearInterval(timerInterval);

            window.location.href = "result.html";

        }

    }

});
// ========================================
// NAVBAR - PROFILE DROPDOWN
// ========================================

const profileButton =
    document.getElementById("profile-button");

const profileDropdown =
    document.getElementById("profile-dropdown");


if (
    profileButton &&
    profileDropdown
) {

    profileButton.addEventListener("click", (event) => {

        event.stopPropagation();

        profileDropdown.classList.toggle("show");

    });

}


// ========================================
// NAVBAR - NOTIFICATION DROPDOWN
// ========================================

const notificationButton =
    document.getElementById("notification-button");

const notificationDropdown =
    document.getElementById("notification-dropdown");


if (
    notificationButton &&
    notificationDropdown
) {

    notificationButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            notificationDropdown.classList.toggle("show");

        }
    );

}


// ========================================
// CLOSE DROPDOWNS
// ========================================

document.addEventListener("click", () => {

    if (profileDropdown) {

        profileDropdown.classList.remove("show");

    }

    if (notificationDropdown) {

        notificationDropdown.classList.remove("show");

    }

});


// ========================================
// LOGOUT
// ========================================

const logoutButton =
    document.getElementById("logout-button");


if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        localStorage.removeItem("isLoggedIn");

        window.location.href =
            "login.html";

    });

}


// ========================================
// SET ACTIVE DIFFICULTY
// ========================================

difficultyButtons.forEach(button => {

    if (
        button.dataset.difficulty ===
        selectedDifficulty
    ) {

        button.classList.add("active");

    } else {

        button.classList.remove("active");

    }

});
// ========================================
// START INTERVIEW
// ========================================

// Allow this interview to save a new result
sessionStorage.removeItem("resultSaved");

showQuestion();