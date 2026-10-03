/* =========================================
   PRACTICESMARTER
   REAL-TIME GROUP DISCUSSION
========================================= */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    updateDoc,
    addDoc,
    collection,
    onSnapshot,
    getDoc,
    getDocs,
    serverTimestamp,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


/* =========================================
   FIREBASE CONFIG
========================================= */

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


/* =========================================
   ELEMENTS
========================================= */

const setupSection =
    document.querySelector(".gd-setup");

const waitingRoom =
    document.getElementById("gd-waiting-room");

const discussionSection =
    document.getElementById("gd-discussion");

const resultSection =
    document.getElementById("gd-result");


const createRoomButton =
    document.getElementById("create-room-button");

const joinRoomButton =
    document.getElementById("join-room-button");

const roomCodeInput =
    document.getElementById("room-code-input");

const roomSettings =
    document.getElementById("room-settings");

const startRoomButton =
    document.getElementById("start-room-button");

const waitingStartButton =
    document.getElementById("waiting-start-button");

const copyRoomCodeButton =
    document.getElementById("copy-room-code");


const topicSelect =
    document.getElementById("gd-topic");

const difficultySelect =
    document.getElementById("gd-difficulty");

const durationSelect =
    document.getElementById("gd-duration");


const roomStatus =
    document.getElementById("gd-room-status");

const waitingStatus =
    document.getElementById("waiting-status");


const displayRoomCode =
    document.getElementById("display-room-code");

const waitingTopic =
    document.getElementById("waiting-topic");

const waitingDifficulty =
    document.getElementById("waiting-difficulty");

const waitingDuration =
    document.getElementById("waiting-duration");

const waitingParticipants =
    document.getElementById("waiting-participants");


const activeTopic =
    document.getElementById("active-topic");

const timerElement =
    document.getElementById("gd-timer");

const conversation =
    document.getElementById("gd-conversation");

const responseInput =
    document.getElementById("gd-response");

const sendButton =
    document.getElementById("send-gd-response");

const micButton =
    document.getElementById("gd-mic-button");    

const endButton =
    document.getElementById("end-gd-button");

const practiceAgainButton =
    document.getElementById("gd-practice-again");


/* =========================================
   STATE
========================================= */

let currentUser = null;

let currentRoomCode = null;

let currentRoomData = null;

let isHost = false;

let discussionStarted = false;

let timerInterval = null;

let roomUnsubscribe = null;

let participantsUnsubscribe = null;

let messagesUnsubscribe = null;

let remainingSeconds = 0;

let allMessages = [];

let allParticipants = [];

let processedAIMessageIds = new Set();

let aiRequestInProgress = false;

let processedAISpeechMessageIds = new Set();

let messagesInitialLoadComplete = false;

let speechRecognition = null;

let isListening = false;


/* =========================================
   TOPIC NAMES
========================================= */

const topicNames = {

    "ai-human-jobs":
        "AI and Human Jobs",

    "ai-education":
        "AI in Education",

    "social-media-students":
        "Social Media and Students",

    "online-offline-education":
        "Online Education vs Classroom Education",

    "skills-vs-marks":
        "Skills vs Academic Marks",

    "coding-career":
        "Importance of Coding Skills for Career",

    "work-from-home":
        "Work From Home vs Office Work",

    "startups-vs-jobs":
        "Startups vs Traditional Jobs",

    "teamwork-vs-individual":
        "Teamwork vs Individual Performance",

    "climate-change":
        "Climate Change and Individual Responsibility"

};


/* =========================================
   AUTHENTICATION
========================================= */

onAuthStateChanged(auth, (user) => {

    if (!user) {

        currentUser = null;

        roomStatus.textContent =
            "Please login to use Group Discussion.";

        createRoomButton.disabled = true;
        joinRoomButton.disabled = true;

        return;
    }

    currentUser = user;

    createRoomButton.disabled = false;
    joinRoomButton.disabled = false;

});


/* =========================================
   CREATE ROOM
========================================= */

createRoomButton.addEventListener(
    "click",
    () => {

        if (!currentUser) {

            alert("Please login first.");

            return;
        }

        roomSettings.style.display = "block";

        roomStatus.textContent =
            "Choose topic, difficulty and duration, then start your room.";

        topicSelect.focus();

    }
);


/* =========================================
   START NEW ROOM
========================================= */

startRoomButton.addEventListener(
    "click",
    async () => {

        if (!currentUser) {

            alert("Please login first.");

            return;
        }

        const selectedTopic =
            topicSelect.value;

        if (!selectedTopic) {

            alert("Please select a discussion topic.");

            topicSelect.focus();

            return;
        }

        const difficulty =
            difficultySelect.value;

        const duration =
            Number(durationSelect.value);


        startRoomButton.disabled = true;

        startRoomButton.textContent =
            "Creating Room...";


        try {

            const roomCode =
                await generateUniqueRoomCode();


            const userName =
                getUserName(currentUser);


            const roomRef =
                doc(
                    db,
                    "gdRooms",
                    roomCode
                );


            await setDoc(
                roomRef,
                {

                    roomCode: roomCode,

                    hostUid: currentUser.uid,

                    hostName: userName,

                    topic: selectedTopic,

                    difficulty: difficulty,

                    duration: duration,

                    status: "waiting",

                    createdAt: serverTimestamp(),

                    startedAt: null,

                    endedAt: null

                }
            );


            const participantRef =
                doc(
                    db,
                    "gdRooms",
                    roomCode,
                    "participants",
                    currentUser.uid
                );


            await setDoc(
                participantRef,
                {

                    uid: currentUser.uid,

                    name: userName,

                    email:
                        currentUser.email || "",

                    joinedAt:
                        serverTimestamp(),

                    role: "host"

                }
            );


            await enterWaitingRoom(
                roomCode
            );


        } catch (error) {

            console.error(
                "Create room error:",
                error
            );

            alert(
                "Unable to create room. Please try again."
            );

        } finally {

            startRoomButton.disabled = false;

            startRoomButton.textContent =
                "▶️ Start Discussion";

        }

    }
);


/* =========================================
   JOIN ROOM
========================================= */

joinRoomButton.addEventListener(
    "click",
    async () => {

        if (!currentUser) {

            alert("Please login first.");

            return;
        }


        const roomCode =
            roomCodeInput.value
                .trim()
                .replace(/\D/g, "");


        if (roomCode.length !== 6) {

            alert(
                "Please enter a valid 6-digit room code."
            );

            roomCodeInput.focus();

            return;
        }


        joinRoomButton.disabled = true;

        joinRoomButton.textContent =
            "Joining...";


        try {

            const roomRef =
                doc(
                    db,
                    "gdRooms",
                    roomCode
                );


            const roomSnapshot =
                await getDoc(roomRef);


            if (!roomSnapshot.exists()) {

                alert(
                    "Room not found. Please check the room code."
                );

                return;
            }


            const roomData =
                roomSnapshot.data();


            if (
                roomData.status === "ended"
            ) {

                alert(
                    "This GD room has already ended."
                );

                return;
            }


            const participantRef =
                doc(
                    db,
                    "gdRooms",
                    roomCode,
                    "participants",
                    currentUser.uid
                );


            const participantSnapshot =
                await getDoc(participantRef);


            if (!participantSnapshot.exists()) {

                await setDoc(
                    participantRef,
                    {

                        uid: currentUser.uid,

                        name:
                            getUserName(currentUser),

                        email:
                            currentUser.email || "",

                        joinedAt:
                            serverTimestamp(),

                        role: "participant"

                    }
                );

            }


            await enterWaitingRoom(
                roomCode
            );


        } catch (error) {

            console.error(
                "Join room error:",
                error
            );

            alert(
                "Unable to join room. Please try again."
            );

        } finally {

            joinRoomButton.disabled = false;

            joinRoomButton.textContent =
                "Join Room";

        }

    }
);


/* =========================================
   ENTER WAITING ROOM
========================================= */

async function enterWaitingRoom(
    roomCode
) {

    currentRoomCode =
        roomCode;


    const roomRef =
        doc(
            db,
            "gdRooms",
            roomCode
        );


    const roomSnapshot =
        await getDoc(roomRef);


    if (!roomSnapshot.exists()) {

        alert("Room no longer exists.");

        return;
    }


    currentRoomData =
        roomSnapshot.data();


    isHost =
        currentRoomData.hostUid ===
        currentUser.uid;


    setupSection.style.display =
        "none";

    waitingRoom.style.display =
        "block";

    discussionSection.style.display =
        "none";

    resultSection.style.display =
        "none";


    displayRoomCode.textContent =
        roomCode;


    updateWaitingRoomInfo(
        currentRoomData
    );


    waitingStartButton.style.display =
        isHost ? "block" : "none";


    waitingStatus.textContent =
        isHost
            ? "Waiting for participants..."
            : "Waiting for the host to start the discussion.";


    listenToRoom(
        roomCode
    );

    listenToParticipants(
        roomCode
    );

}


/* =========================================
   ROOM LISTENER
========================================= */

function listenToRoom(
    roomCode
) {

    if (roomUnsubscribe) {

        roomUnsubscribe();

    }


    const roomRef =
        doc(
            db,
            "gdRooms",
            roomCode
        );


    roomUnsubscribe =
        onSnapshot(
            roomRef,
            (snapshot) => {

                if (!snapshot.exists()) {

                    alert(
                        "This GD room is no longer available."
                    );

                    resetToSetup();

                    return;
                }


                currentRoomData =
                    snapshot.data();


                updateWaitingRoomInfo(
                    currentRoomData
                );


                if (
                    currentRoomData.status ===
                    "active"
                ) {

                    startDiscussionFromRoom();

                }


                if (
                    currentRoomData.status ===
                    "ended"
                ) {

                    if (discussionStarted) {

                        finishDiscussion();

                    }

                }

            },
            (error) => {

                console.error(
                    "Room listener error:",
                    error
                );

            }
        );

}


/* =========================================
   PARTICIPANT LISTENER
========================================= */

function listenToParticipants(
    roomCode
) {

    if (participantsUnsubscribe) {

        participantsUnsubscribe();

    }


    const participantsRef =
        collection(
            db,
            "gdRooms",
            roomCode,
            "participants"
        );


    participantsUnsubscribe =
        onSnapshot(
            participantsRef,
            (snapshot) => {

                allParticipants = [];


                snapshot.forEach(
                    (docSnapshot) => {

                        allParticipants.push(
                            {
                                id:
                                    docSnapshot.id,

                                ...docSnapshot.data()
                            }
                        );

                    }
                );


                renderWaitingParticipants();

                renderDiscussionParticipants();


                if (
                    allParticipants.length >= 2
                ) {

                    waitingStatus.textContent =
                        isHost
                            ? `${allParticipants.length} participants joined. You can start the discussion.`
                            : "Participants joined. Waiting for the host to start.";

                } else {

                    waitingStatus.textContent =
                        isHost
                            ? "Waiting for at least one more participant..."
                            : "Waiting for more participants...";

                }

            },
            (error) => {

                console.error(
                    "Participants listener error:",
                    error
                );

            }
        );

}


/* =========================================
   RENDER WAITING PARTICIPANTS
========================================= */

function renderWaitingParticipants() {


    if (!waitingParticipants) {

        return;
    }


    if (
        allParticipants.length === 0
    ) {

        waitingParticipants.innerHTML = `
            <div class="waiting-empty">
                Waiting for participants...
            </div>
        `;

        return;
    }


    waitingParticipants.innerHTML =
        allParticipants
            .map(
                (participant) => {

                    const isCurrentUser =
                        participant.uid ===
                        currentUser.uid;


                    const avatar =
                        isCurrentUser
                            ? "👤"
                            : "👥";


                    const role =
                        participant.role ===
                        "host"
                            ? "Host"
                            : "Participant";


                    return `
                        <div class="waiting-participant">

                            <div class="waiting-participant-avatar">
                                ${avatar}
                            </div>

                            <div class="waiting-participant-info">

                                <strong>
                                    ${escapeHTML(
                                        participant.name ||
                                        "Participant"
                                    )}
                                    ${isCurrentUser ? " (You)" : ""}
                                </strong>

                                <span>
                                    ${role}
                                </span>

                            </div>

                        </div>
                    `;

                }
            )
            .join("");

}


/* =========================================
   UPDATE WAITING ROOM INFO
========================================= */

function updateWaitingRoomInfo(
    roomData
) {

    if (!roomData) {

        return;
    }


    waitingTopic.textContent =
        topicNames[
            roomData.topic
        ] ||
        roomData.topic ||
        "—";


    waitingDifficulty.textContent =
        roomData.difficulty ||
        "—";


    waitingDuration.textContent =
        `${roomData.duration || 0} Minutes`;


    displayRoomCode.textContent =
        roomData.roomCode ||
        currentRoomCode ||
        "------";

}


/* =========================================
   HOST START DISCUSSION
========================================= */

waitingStartButton.addEventListener(
    "click",
    async () => {

        if (!currentRoomCode) {

            return;
        }


        if (!isHost) {

            alert(
                "Only the room host can start the discussion."
            );

            return;
        }


        if (
            allParticipants.length < 2
        ) {

            alert(
                "Please wait for at least one more participant."
            );

            return;
        }


        waitingStartButton.disabled =
            true;

        waitingStartButton.textContent =
            "Starting...";


        try {

            const roomRef =
                doc(
                    db,
                    "gdRooms",
                    currentRoomCode
                );


            await updateDoc(
                roomRef,
                {

                    status: "active",

                    startedAt:
                        serverTimestamp()

                }
            );


        } catch (error) {

            console.error(
                "Start discussion error:",
                error
            );

            alert(
                "Unable to start the discussion."
            );

            waitingStartButton.disabled =
                false;

            waitingStartButton.textContent =
                "▶️ Start Discussion";

        }

    }
);


/* =========================================
   START DISCUSSION FROM ROOM
========================================= */

function startDiscussionFromRoom() {

    if (
        discussionStarted
    ) {

        return;
    }


    discussionStarted =
        true;


    waitingRoom.style.display =
        "none";

    setupSection.style.display =
        "none";

    resultSection.style.display =
        "none";

    discussionSection.style.display =
        "block";


    activeTopic.textContent =
        topicNames[
            currentRoomData.topic
        ] ||
        currentRoomData.topic;


    remainingSeconds =
        Number(
            currentRoomData.duration
        ) * 60;


    updateTimer();


    listenToMessages(
        currentRoomCode
    );


    startSharedTimer();


    responseInput.disabled =
        false;

    sendButton.disabled =
        false;


    endButton.disabled =
        false;

}


/* =========================================
   MESSAGE LISTENER
========================================= */

function listenToMessages(
    roomCode
) {

    if (messagesUnsubscribe) {

        messagesUnsubscribe();

    }

    messagesInitialLoadComplete = false;


    const messagesRef =
        collection(
            db,
            "gdRooms",
            roomCode,
            "messages"
        );


    const messagesQuery =
        query(
            messagesRef,
            orderBy(
                "timestamp",
                "asc"
            )
        );


    messagesUnsubscribe =
        onSnapshot(
            messagesQuery,
            (snapshot) => {

                allMessages = [];


                snapshot.forEach(
                    (docSnapshot) => {

                        allMessages.push(
                            {
                                id:
                                    docSnapshot.id,

                                ...docSnapshot.data()
                            }
                        );

                    }
                );

renderConversation();

const changes =
    snapshot.docChanges();


// First Firestore load:
// show existing messages but DO NOT speak old AI messages.
if (!messagesInitialLoadComplete) {

    // First Firestore load:
    // Show existing messages only.
    // Do NOT speak old AI messages.

    messagesInitialLoadComplete = true;

} else {

    // Speak ONLY newly added AI messages.
    changes.forEach((change) => {

        if (
            change.type !== "added"
        ) {
            return;
        }

        const messageData =
            change.doc.data();

        if (
            messageData.senderType !== "ai"
        ) {
            return;
        }

        const messageId =
            change.doc.id;

        // Extra protection:
        // The same AI message must never be spoken twice.
        if (
            processedAISpeechMessageIds.has(
                messageId
            )
        ) {
            return;
        }

        speakAIResponse(
            messageData.text,
            messageId
        );

    });

}



if (isHost) {

    handleAIResponses();

}
            },
            (error) => {

                console.error(
                    "Messages listener error:",
                    error
                );

            }
        );

}

/* =========================================
   STUDENT VOICE INPUT
========================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    speechRecognition =
        new SpeechRecognition();

    speechRecognition.continuous = false;

    speechRecognition.interimResults = true;

    speechRecognition.lang = "en-US";


    speechRecognition.onstart = () => {

        isListening = true;

        if (micButton) {

            micButton.classList.add(
                "listening"
            );

            micButton.textContent =
                "🔴";

            micButton.title =
                "Listening... click to stop";
        }

    };


    speechRecognition.onresult = (event) => {

        let finalText = "";

        let interimText = "";


        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const transcript =
                event.results[i][0].transcript;


            if (
                event.results[i].isFinal
            ) {

                finalText += transcript;

            } else {

                interimText += transcript;

            }

        }


        if (finalText) {

            const existingText =
                responseInput.value.trim();


            responseInput.value =
                existingText
                    ? `${existingText} ${finalText}`.trim()
                    : finalText.trim();

        }

    };


    speechRecognition.onend = () => {

        isListening = false;

        if (micButton) {

            micButton.classList.remove(
                "listening"
            );

            micButton.textContent =
                "🎤";

            micButton.title =
                "Speak your response";

        }

    };


    speechRecognition.onerror = (event) => {

        console.error(
            "Speech recognition error:",
            event.error
        );


        isListening = false;


        if (micButton) {

            micButton.classList.remove(
                "listening"
            );

            micButton.textContent =
                "🎤";

            micButton.title =
                "Speak your response";

        }


        if (
            event.error === "not-allowed" ||
            event.error === "service-not-allowed"
        ) {

            alert(
                "Microphone permission is required for voice input."
            );

        }

    };

}


if (micButton) {

    micButton.addEventListener(
        "click",
        () => {

            if (!speechRecognition) {

                alert(
                    "Voice input is not supported in this browser. Please use Chrome or Edge."
                );

                return;
            }


            if (!discussionStarted) {

                return;
            }


            if (isListening) {

                speechRecognition.stop();

                return;

            }


            try {

                speechRecognition.start();

            } catch (error) {

                console.error(
                    "Unable to start microphone:",
                    error
                );

            }

        }
    );

}

/* =========================================
   SEND MESSAGE
========================================= */

sendButton.addEventListener(
    "click",
    sendUserMessage
);


responseInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendUserMessage();

        }

    }
);


async function sendUserMessage() {

    if (
        !discussionStarted ||
        !currentRoomCode ||
        !currentUser
    ) {

        return;
    }


    const message =
        responseInput.value.trim();


    if (!message) {

        alert(
            "Please enter your opinion before sending."
        );

        responseInput.focus();

        return;
    }


    if (
        message.length > 1000
    ) {

        alert(
            "Please keep your response below 1000 characters."
        );

        return;
    }


    sendButton.disabled =
        true;


    try {

        const messagesRef =
            collection(
                db,
                "gdRooms",
                currentRoomCode,
                "messages"
            );


        await addDoc(
            messagesRef,
            {

                uid:
                    currentUser.uid,

                senderName:
                    getUserName(currentUser),

                senderType:
                    "user",

                text:
                    message,

                timestamp:
                    serverTimestamp()

            }
        );


        responseInput.value = "";


    } catch (error) {

        console.error(
            "Send message error:",
            error
        );

        alert(
            "Unable to send your message. Please try again."
        );

    } finally {

        sendButton.disabled =
            false;

    }

}

/* =========================================
   SPEAK LATEST AI MESSAGE
========================================= */

function speakLatestAIMessage() {

    const latestAIMessage =
        [...allMessages]
            .reverse()
            .find(
                (message) =>
                    message.senderType === "ai"
            );


    if (!latestAIMessage) {

        return;
    }


    speakAIResponse(
        latestAIMessage.text,
        latestAIMessage.id
    );

}

/* =========================================
   AI RESPONSE CONTROLLER
========================================= */

/* =========================================
   AI RESPONSE CONTROLLER
========================================= */

async function handleAIResponses() {

    if (
        !isHost ||
        aiRequestInProgress ||
        !discussionStarted
    ) {
        return;
    }

    const latestUserMessage =
        [...allMessages]
            .reverse()
            .find(
                (message) =>
                    message.senderType === "user"
            );

    if (!latestUserMessage) {
        return;
    }

    /*
     * If this user message already has an AI
     * response, do nothing.
     */
    const alreadyAnswered =
        allMessages.some(
            (message) =>
                message.senderType === "ai" &&
                message.aiForMessageId ===
                    latestUserMessage.id
        );

    if (alreadyAnswered) {
        processedAIMessageIds.add(
            latestUserMessage.id
        );
        return;
    }

    /*
     * Prevent the same user message from
     * starting another AI request.
     */
    if (
        processedAIMessageIds.has(
            latestUserMessage.id
        )
    ) {
        return;
    }

    /*
     * Mark as processing BEFORE API request.
     */
    processedAIMessageIds.add(
        latestUserMessage.id
    );

    aiRequestInProgress = true;

    try {

        const recentMessages =
            allMessages
                .slice(-12)
                .map(
                    (message) => ({
                        sender:
                            message.senderName,

                        type:
                            message.senderType,

                        text:
                            message.text
                    })
                );

        const response =
            await fetch(
                "http://localhost:5000/api/gd-response",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            topic:
                                topicNames[
                                    currentRoomData.topic
                                ] ||
                                currentRoomData.topic,

                            difficulty:
                                currentRoomData.difficulty,

                            conversation:
                                recentMessages
                        })
                }
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {

            console.error(
                "AI response error:",
                data
            );

            return;
        }

        const aiText =
            String(
                data.response || ""
            ).trim();

        if (!aiText) {
            return;
        }

        /*
         * FINAL DUPLICATE PROTECTION
         *
         * Use a fixed Firestore document ID
         * for each user message.
         */
        const aiMessageRef =
            doc(
                db,
                "gdRooms",
                currentRoomCode,
                "messages",
                `ai_${latestUserMessage.id}`
            );

        await setDoc(
            aiMessageRef,
            {
                uid:
                    currentUser.uid,

                senderName:
                    "AI Participant",

                senderType:
                    "ai",

                text:
                    aiText,

                aiForMessageId:
                    latestUserMessage.id,

                timestamp:
                    serverTimestamp()
            }
        );

    } catch (error) {

        console.error(
            "AI request error:",
            error
        );

    } finally {

        aiRequestInProgress =
            false;
    }
}
/* =========================================
   RENDER CONVERSATION
========================================= */

function renderConversation() {

    if (!conversation) {

        return;
    }


    conversation.innerHTML = "";


    if (
        allMessages.length === 0
    ) {

        addLocalMessage(
            "AI Moderator",
            `Welcome to the group discussion on "${topicNames[currentRoomData.topic] || currentRoomData.topic}". Please share your ideas clearly and respond respectfully to different viewpoints.`,
            "ai"
        );

        return;
    }


    allMessages.forEach(
        (message) => {

            const isUser =
                message.uid ===
                currentUser.uid &&
                message.senderType ===
                "user";


            const wrapper =
                document.createElement("div");


            wrapper.className =
                isUser
                    ? "gd-message user-message"
                    : "gd-message ai-message";


            const avatar =
                message.senderType ===
                "ai"
                    ? "🤖"
                    : isUser
                        ? "👤"
                        : "👥";


            wrapper.innerHTML = `

                <div class="message-avatar">
                    ${avatar}
                </div>

                <div class="message-content">

                    <strong>
                        ${escapeHTML(
                            message.senderName ||
                            "Participant"
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            message.text || ""
                        )}
                    </p>

                </div>

            `;


            conversation.appendChild(
                wrapper
            );

        }
    );


    scrollConversationToBottom();

}


/* =========================================
   LOCAL MODERATOR MESSAGE
========================================= */

function addLocalMessage(
    sender,
    message,
    type
) {

    const wrapper =
        document.createElement("div");


    wrapper.className =
        type === "user"
            ? "gd-message user-message"
            : "gd-message ai-message";


    wrapper.innerHTML = `

        <div class="message-avatar">
            ${type === "user" ? "👤" : "🤖"}
        </div>

        <div class="message-content">

            <strong>
                ${escapeHTML(sender)}
            </strong>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;


    conversation.appendChild(
        wrapper
    );


    scrollConversationToBottom();

}


/* =========================================
   DISCUSSION PARTICIPANTS
========================================= */

function renderDiscussionParticipants() {

    const participantContainer =
        document.querySelector(
            ".gd-participants"
        );


    if (!participantContainer) {

        return;
    }


    participantContainer.innerHTML = "";


    /* AI participant */

    participantContainer.innerHTML += `

        <div class="participant-card">

            <div class="participant-avatar">
                🤖
            </div>

            <div>

                <strong>
                    AI Participant
                </strong>

                <span>
                    Active
                </span>

            </div>

        </div>

    `;


    allParticipants.forEach(
        (participant) => {

            const isCurrentUser =
                participant.uid ===
                currentUser.uid;


            participantContainer.innerHTML += `

                <div class="participant-card ${isCurrentUser ? "user-participant" : ""}">

                    <div class="participant-avatar">
                        ${isCurrentUser ? "👤" : "👥"}
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                participant.name ||
                                "Participant"
                            )}
                            ${isCurrentUser ? " (You)" : ""}
                        </strong>

                        <span>
                            ${
                                participant.role === "host"
                                    ? "Host"
                                    : "Participant"
                            }
                        </span>

                    </div>

                </div>

            `;

        }
    );

}


/* =========================================
   SHARED TIMER
========================================= */

function startSharedTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval =
        setInterval(
            () => {

                if (
                    !discussionStarted ||
                    !currentRoomData ||
                    !currentRoomData.startedAt
                ) {

                    return;
                }


                const startedAt =
                    currentRoomData.startedAt
                        .toMillis();


                const durationMs =
                    Number(
                        currentRoomData.duration
                    ) *
                    60 *
                    1000;


                const elapsed =
                    Date.now() -
                    startedAt;


                const remaining =
                    Math.max(
                        0,
                        durationMs -
                        elapsed
                    );


                remainingSeconds =
                    Math.ceil(
                        remaining / 1000
                    );


                updateTimer();


                if (
                    remainingSeconds <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    if (isHost) {

                        endRoomInFirestore();

                    }

                }

            },
            1000
        );

}


/* =========================================
   TIMER DISPLAY
========================================= */

function updateTimer() {

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


/* =========================================
   END BUTTON
========================================= */

endButton.addEventListener(
    "click",
    async () => {

        if (!discussionStarted) {

            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to end the discussion?"
            );


        if (!confirmed) {

            return;
        }


        await endRoomInFirestore();

    }
);


/* =========================================
   END ROOM
========================================= */

async function endRoomInFirestore() {

    if (
        !currentRoomCode
    ) {

        return;
    }


    try {

        const roomRef =
            doc(
                db,
                "gdRooms",
                currentRoomCode
            );


        await updateDoc(
            roomRef,
            {

                status: "ended",

                endedAt:
                    serverTimestamp()

            }
        );


    } catch (error) {

        console.error(
            "End room error:",
            error
        );

        alert(
            "Unable to end the discussion."
        );

    }

}


/* =========================================
   FINISH DISCUSSION
========================================= */

async function finishDiscussion() {

    if (!discussionStarted) {

        return;
    }

    discussionStarted = false;

// Stop AI speech immediately when GD ends
if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
}


    discussionStarted =
        false;




    clearInterval(
        timerInterval
    );


    responseInput.disabled =
        true;

    sendButton.disabled =
        true;

    endButton.disabled =
        true;


    discussionSection.style.display =
        "none";


    resultSection.style.display =
        "block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    await evaluateDiscussion();

}


/* =========================================
   AI EVALUATION
========================================= */

async function evaluateDiscussion() {

    const currentParticipant =
        allParticipants.find(
            (participant) =>
                participant.uid ===
                currentUser.uid
        );


    const participantName =
        currentParticipant?.name ||
        getUserName(currentUser);


    const conversationData =
    allMessages.map(
        (message) => ({

            uid:
                message.uid || "",

            sender:
                message.senderName,

            type:
                message.senderType,

            text:
                message.text
        })
    );


    const participantList =
        allParticipants.map(
            (participant) => ({

                uid:
                    participant.uid,

                name:
                    participant.name,

                role:
                    participant.role

            })
        );


    try {

        document.getElementById(
            "gd-feedback"
        ).textContent =
            "AI is analyzing your discussion performance...";


        const response =
            await fetch(
                "http://localhost:5000/api/gd-evaluate", 
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            {

                                topic:
                                    topicNames[
                                        currentRoomData.topic
                                    ] ||
                                    currentRoomData.topic,

                                difficulty:
                                    currentRoomData.difficulty,

                                participants:
                                    participantList,

                                conversation:
                                    conversationData,

                                participantName:
                                    participantName,

                                participantUid:
                                    currentUser.uid

                            }
                        )

                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.error ||
                "Evaluation failed."
            );

        }


        renderEvaluation(
            data.evaluation
        );


    } catch (error) {

        console.error(
            "Evaluation error:",
            error
        );


        document.getElementById(
            "gd-feedback"
        ).textContent =
            "Your discussion has been completed. AI evaluation could not be loaded right now. Please try again later.";

    }

}


/* =========================================
   RENDER EVALUATION
========================================= */

function renderEvaluation(
    evaluation
) {

    if (!evaluation) {

        return;
    }


    const overall =
        Number(
            evaluation.overallScore
        ) || 0;


    const communication =
        Number(
            evaluation.communicationScore
        ) || 0;


    const relevance =
        Number(
            evaluation.relevanceScore
        ) || 0;


    document.getElementById(
        "gd-overall-score"
    ).textContent =
        `${overall}/10`;


    document.getElementById(
        "gd-communication-score"
    ).textContent =
        `${communication}/10`;


    document.getElementById(
        "gd-relevance-score"
    ).textContent =
        `${relevance}/10`;


    const feedback =
        evaluation.feedback ||
        "Keep practicing your communication and discussion skills.";


    const strengths =
        Array.isArray(
            evaluation.strengths
        )
            ? evaluation.strengths
            : [];


    const improvements =
        Array.isArray(
            evaluation.improvements
        )
            ? evaluation.improvements
            : [];


    let finalFeedback =
        feedback;


    if (
        strengths.length > 0
    ) {

        finalFeedback +=
            `\n\nStrengths:\n• ${strengths.join("\n• ")}`;

    }


    if (
        improvements.length > 0
    ) {

        finalFeedback +=
            `\n\nAreas to Improve:\n• ${improvements.join("\n• ")}`;

    }


    document.getElementById(
        "gd-feedback"
    ).textContent =
        finalFeedback;

}


/* =========================================
   COPY ROOM CODE
========================================= */

copyRoomCodeButton.addEventListener(
    "click",
    async () => {

        const code =
            displayRoomCode.textContent.trim();


        if (
            !code ||
            code === "------"
        ) {

            return;
        }


        try {

            await navigator.clipboard.writeText(
                code
            );


            copyRoomCodeButton.textContent =
                "✅ Copied";


            setTimeout(
                () => {

                    copyRoomCodeButton.textContent =
                        "📋 Copy";

                },
                1500
            );


        } catch (error) {

            console.error(
                "Copy error:",
                error
            );


            alert(
                `Room Code: ${code}`
            );

        }

    }
);


/* =========================================
   PRACTICE AGAIN
========================================= */

practiceAgainButton.addEventListener(
    "click",
    () => {

        resetToSetup();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================
   RESET
========================================= */

function resetToSetup() {

    clearInterval(
        timerInterval
    );


    if (roomUnsubscribe) {

        roomUnsubscribe();

        roomUnsubscribe = null;

    }


    if (participantsUnsubscribe) {

        participantsUnsubscribe();

        participantsUnsubscribe = null;

    }


    if (messagesUnsubscribe) {

        messagesUnsubscribe();

        messagesUnsubscribe = null;

    }


    currentRoomCode = null;

    currentRoomData = null;

    isHost = false;

    discussionStarted = false;

    remainingSeconds = 0;

    allMessages = [];

    allParticipants = [];

    processedAIMessageIds =
        new Set();

    aiRequestInProgress =
        false;
    processedAISpeechMessageIds =
    new Set();

    messagesInitialLoadComplete =
    false;


    resultSection.style.display =
        "none";

    discussionSection.style.display =
        "none";

    waitingRoom.style.display =
        "none";

    setupSection.style.display =
        "flex";


    roomSettings.style.display =
        "none";


    roomCodeInput.value = "";

    responseInput.value = "";

    if (speechRecognition && isListening) {

    speechRecognition.stop();

}

    conversation.innerHTML = "";


    roomStatus.textContent =
        "";

    waitingStatus.textContent =
        "Waiting for participants...";


    updateTimer();

}


/* =========================================
   GENERATE ROOM CODE
========================================= */

async function generateUniqueRoomCode() {

    for (
        let attempt = 0;
        attempt < 10;
        attempt++
    ) {

        const code =
            String(
                Math.floor(
                    100000 +
                    Math.random() *
                    900000
                )
            );


        const roomRef =
            doc(
                db,
                "gdRooms",
                code
            );


        const snapshot =
            await getDoc(
                roomRef
            );


        if (!snapshot.exists()) {

            return code;

        }

    }


    throw new Error(
        "Unable to generate a unique room code."
    );

}


/* =========================================
   USER NAME
========================================= */

function getUserName(
    user
) {

    if (
        user.displayName &&
        user.displayName.trim()
    ) {

        return user.displayName.trim();

    }


    if (
        user.email
    ) {

        return user.email
            .split("@")[0];

    }


    return "Participant";

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   SCROLL
========================================= */

function scrollConversationToBottom() {

    conversation.scrollTop =
        conversation.scrollHeight;

}

function speakAIResponse(text, messageId) {

    if (!("speechSynthesis" in window)) {
        console.warn(
            "Speech synthesis is not supported."
        );
        return;
    }

    if (!text || !messageId) {
        return;
    }

    /*
     * HARD DUPLICATE PROTECTION
     * Same AI message can NEVER start speech twice.
     */
    if (
        processedAISpeechMessageIds.has(messageId)
    ) {
        console.log(
            "🔇 Duplicate AI speech blocked:",
            messageId
        );
        return;
    }

    /*
     * Mark BEFORE doing anything else.
     */
    processedAISpeechMessageIds.add(messageId);

    /*
     * Stop any currently running speech.
     */
    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";
    speech.rate = 0.95;
    speech.pitch = 1;
    speech.volume = 1;

    const voices =
        window.speechSynthesis.getVoices();

    const preferredVoice =
        voices.find(
            (voice) =>
                /Jenny|Aria|Samantha|Zira|Google US English Female|Microsoft.*Female/i
                    .test(voice.name)
                &&
                /^en(-US)?$/i.test(
                    voice.lang
                )
        )
        ||
        voices.find(
            (voice) =>
                /^en(-US)?$/i.test(
                    voice.lang
                )
        );

    if (preferredVoice) {
        speech.voice = preferredVoice;
    }

    const teacherPanel =
        document.getElementById(
            "gd-ai-teacher-panel"
        );

    const teacherStatus =
        document.getElementById(
            "gd-ai-status"
        );

    if (teacherPanel) {
        teacherPanel.classList.add(
            "ai-speaking"
        );
    }

    if (teacherStatus) {
        teacherStatus.textContent =
            "🔊 Speaking...";
    }

    speech.onend = () => {

        if (teacherPanel) {
            teacherPanel.classList.remove(
                "ai-speaking"
            );
        }

        if (teacherStatus) {
            teacherStatus.textContent =
                "🟢 Listening";
        }
    };

    speech.onerror = () => {

        if (teacherPanel) {
            teacherPanel.classList.remove(
                "ai-speaking"
            );
        }

        if (teacherStatus) {
            teacherStatus.textContent =
                "🟢 Listening";
        }
    };

    console.log(
        "🔊 AI SPEAK STARTED:",
        messageId,
        text
    );

    window.speechSynthesis.speak(
        speech
    );
}