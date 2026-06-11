// 1. Die 10 Fragen (Datenstruktur)
const quizData = [
  { type: "single", question: "Question 1: What is the biggest city in Japan?", options: ["Osaka", "Tokyo", "Nara", "Fukushima"], correct: 1 },
    { type: "single", question: "Question 2: What can you find on almost every street corner in Japan?", options: ["Restaurants", "Cameras", "Vending machines", "Shrines"], correct: 2 },
    { type: "single", question: "Question 3: Which number do people in Japan often skip because it sounds like 'death'?", options: ["Number 7", "Number 9", "Number 4", "Number 13"], correct: 2 },
    { type: "single", question: "Question 4: In a Japanese sentence, where does the Verb usually go?", options: ["At the very beginning", "Between Subject and Object", "At the very end", "It is usu[...]
    { type: "multiple", question: "Question 5: (multiple selection): Which two main religions do many Japanese people practice at the same time?", options: ["Hinduism", "Shintoism", "Buddhism", "Ch[...]
    { type: "single", question: "Question 6: Which Anime has over 7000 episodes?", options: ["Sazae-san", "One Piece", "Reborn as a Vending Machine, Now I Wander the Dungeon", "Spy X Family"], corr[...]
    { type: "single", question: "Question 7: How many prefectures does Japan have?", options: ["50", "28", "19", "47"], correct: 3 },
    { type: "single", question: "Question 8: Why should you never stick your chopsticks vertically into a bowl of rice?", options: ["It resembles a funeral ritual", "It breaks the chopsticks", "It[...]
    { type: "single", question: "Question 9: What is the most popular sport in Japan?", options: ["Football", "Sumo", "Baseball", "Rugby"], correct: 2 },
    { type: "multiple", question: "Question 10: (multiple selection): The Ogasawara Islands are also known as...?", options: ["...the Ryukyu Islands", "...the Bonin Islands", "...the smallest pref[...]
    { type: "single", question: "Question 11: Which Japanese writing system is used for foreign words like Coffee or Camera?", options: ["Romaji", "Kanji", "Katakana", "Hiragana"], correct: 2 },
    { type: "single", question: "Question 12: What does the traditional concept of 'Wa' stand for in Japanese society?", options: ["Speed", "Success", "Harmony", "Strength"], correct: 2 },
    { type: "multiple", question: "Question 13: (multiple selection): Hokkaido is a...?", options: ["...Prefecture", "...City", "...major island", "...County"], correct: [0, 2] },
    { type: "single", question: "Question 14: Next to rice, what else is highly important in Japanese cuisine?", options: ["Soup", "Seafood", "Udon", "Cabbage"], correct: 1 },
    { type: "single", question: "Question 15: How many people live in Japan?", options: ["122.4 million", "88.4 million", "2.8 billion", "40 million"], correct: 0 }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedIndices = []; // Speichert die aktuellen Klicks des Users
let answerSubmitted = false; // Verfolgt, ob die Antwort bereits eingereicht wurde

const quizContainer = document.getElementById("quiz");

// 2. Quiz starten
function loadQuestion() {
    selectedIndices = []; // Zurücksetzen für die neue Frage
    answerSubmitted = false; // Zurücksetzen des Submission-Status
    const currentData = quizData[currentQuestionIndex];
    
    // HTML-Gerüst für die aktuelle Frage bauen
    quizContainer.innerHTML = `
        <div class="progress">Frage ${currentQuestionIndex + 1} von ${quizData.length}</div>
        <h2>${currentData.question}</h2>
        <div class="options-container" id="options"></div>
        <button class="action-btn" id="next-btn" disabled>Confirm & Next</button>
    `;

    const optionsContainer = document.getElementById("options");
    const nextBtn = document.getElementById("next-btn");

    // Optionen rendern
    currentData.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.classList.add("option-btn");
        button.innerText = option;
        
        button.addEventListener("click", () => handleSelect(index, button, nextBtn, currentData.type));
        optionsContainer.appendChild(button);
    });

    // Event-Listener für den Weiter-Button
    nextBtn.addEventListener("click", () => {
        if (!answerSubmitted) {
            // Erste Klick: Antwort einreichen und Feedback zeigen
            checkAnswer();
            showFeedback(currentData);
            answerSubmitted = true;
            nextBtn.innerText = "Next Question";
        } else {
            // Zweite Klick: Zur nächsten Frage gehen
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }
    });
}

// 3. Logik, wenn der User auf eine Antwort klickt
function handleSelect(index, button, nextBtn, type) {
    if (answerSubmitted) {
        return; // Keine Änderung der Antwort nach Bestätigung
    }

    if (type === "single" || type === "matching") {
        // Bei Single-Choice alle anderen Abwählen
        const buttons = document.querySelectorAll(".option-btn");
        buttons.forEach(btn => btn.classList.remove("selected"));
        
        button.classList.add("selected");
        selectedIndices = [index];
    } else if (type === "multiple") {
        // Bei Multiple-Choice Auswahl umschalten (Toggle), aber maximal 2 Antworten
        if (selectedIndices.includes(index)) {
            selectedIndices = selectedIndices.filter(i => i !== index);
            button.classList.remove("selected");
        } else {
            // Maximal 2 Antworten erlauben
            if (selectedIndices.length < 2) {
                selectedIndices.push(index);
                button.classList.add("selected");
            }
        }
    }

    // "Nicht skipbar": Button wird nur aktiv, wenn mindestens eine Antwort ausgewählt ist
    nextBtn.disabled = selectedIndices.length === 0;
}

// Helper function to compare arrays regardless of order
function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort((a, b) => a - b);
    const sorted2 = [...arr2].sort((a, b) => a - b);
    return sorted1.every((val, idx) => val === sorted2[idx]);
}

// 4. Auswertung der Antwort
function checkAnswer() {
    const currentData = quizData[currentQuestionIndex];

    if (currentData.type === "single" || currentData.type === "matching") {
        if (selectedIndices[0] === currentData.correct) {
            score++;
        }
    } else if (currentData.type === "multiple") {
        // Prüfen, ob die Arrays exakt übereinstimmen
        const isCorrect = arraysEqual(selectedIndices, currentData.correct);
        if (isCorrect) {
            // Genau die richtigen Antworten: 2 Punkte
            score += 2;
        }
        // Falsche oder unvollständige Antworten: 0 Punkte
    }
}

// 5. Feedback anzeigen
function showFeedback(currentData) {
    const currentData2 = quizData[currentQuestionIndex];
    const optionsContainer = document.getElementById("options");
    const nextBtn = document.getElementById("next-btn");
    
    // Alle Buttons deaktivieren
    const allButtons = document.querySelectorAll(".option-btn");
    allButtons.forEach(btn => btn.disabled = true);

    // Bestimme, ob die Antwort richtig ist
    let isCorrect = false;
    if (currentData.type === "single" || currentData.type === "matching") {
        isCorrect = selectedIndices[0] === currentData.correct;
    } else if (currentData.type === "multiple") {
        isCorrect = arraysEqual(selectedIndices, currentData.correct);
    }

    // Feedback-Element erstellen
    const feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("feedback");
    if (isCorrect) {
        feedbackDiv.classList.add("correct");
        feedbackDiv.innerHTML = `<p style="color: green; font-weight: bold; font-size: 18px;">✓ Richtig!</p>`;
    } else {
        feedbackDiv.classList.add("incorrect");
        feedbackDiv.innerHTML = `<p style="color: red; font-weight: bold; font-size: 18px;">✗ Falsch!</p>`;
    }

    // Lösung anzeigen
    const solutionDiv = document.createElement("div");
    solutionDiv.classList.add("solution");
    solutionDiv.style.marginTop = "20px";
    solutionDiv.style.padding = "15px";
    solutionDiv.style.backgroundColor = "#f0f0f0";
    solutionDiv.style.borderRadius = "5px";
    
    if (currentData.type === "single" || currentData.type === "matching") {
        const correctAnswer = currentData.options[currentData.correct];
        solutionDiv.innerHTML = `<p><strong>Lösung:</strong> ${correctAnswer}</p>`;
    } else if (currentData.type === "multiple") {
        const correctAnswers = currentData.correct.map(idx => currentData.options[idx]).join(" + ");
        solutionDiv.innerHTML = `<p><strong>Lösung:</strong> ${correctAnswers}</p>`;
    }

    // Feedback und Lösung hinzufügen
    optionsContainer.parentNode.insertBefore(feedbackDiv, optionsContainer);
    optionsContainer.parentNode.insertBefore(solutionDiv, nextBtn);
    
    // Button-Text ändern
    nextBtn.disabled = false;
    nextBtn.innerText = "Next Question";
}

// 6. Endscreen anzeigen
function showResults() {
    quizContainer.innerHTML = `
        <div class="result-screen">
            <h2>Quiz beendet!</h2>
            <p>Du hast alle Fragen beantwortet. Hier ist dein Ergebnis:</p>
            <div class="score">${score} Punkte</div>
            <button class="action-btn" onclick="location.reload()">Quiz Neustarten</button>
        </div>
    `;
}

// Quiz beim Laden der Seite initialisieren
loadQuestion();
