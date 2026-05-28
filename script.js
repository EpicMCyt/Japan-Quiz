// 1. Die 10 Fragen (Datenstruktur)
const quizData = [
    // Typ "single": 4 Optionen, 1 richtige Lösung (6 Stück)
    { type: "single", question: "Frage 1: What is the Biggest city in Japan?", options: ["Osaka", "Tokio", "Nara", "Fukushima"], correct: 1 },
    { type: "single", question: "Frage 2: How many prefectures does Japan have??", options: ["50", "28", "19", "47"], correct: 3 },
    { type: "multiple", question: "Frage 3: (multiple selection): Welche dieser Länder liegen in Europa?", options: ["Frankreich", "Japan", "Spanien", "Kanada"], correct: [0, 2] },
    { type: "single", question: "Frage 4: What can you find on almost every street corner in Japan?", options: ["Restaurants", "Kameras", "Vendingmaschines", "Shrines"], correct: 2 },
    { type: "multiple", question: "Frage 5: (multiple selection): Welche der folgenden Früchte sind Zitrusfrüchte?", options: ["Zitrone", "Apfel", "Orange", "Banane"], correct: [0, 2] },{ type: "single", question: "Frage 4: Wer schrieb 'Romeo und Julia'?", options: ["Goethe", "Schiller", "Shakespeare", "Kafka"], correct: 2 },
    { type: "single", question: "Frage 6: Which Japanese writing system is used for foreign words like Coffee or Camera?", options: ["Romanji", "Kanji", "Katakana", "Hiragana"], correct: 2 },
    { type: "single", question: "Frage 7: How many people live in Japan", options: ["122.4 million", "88.4 million", "2.8 billion", "40 million"], correct: 0 },
    { type: "multiple", question: "Frage 8: (multiple selection): Which two main religions do many Japanese people practice at the same time?", options: ["Hinduism", "Shintoism", "Buddhism", "Christianity"], correct: [1, 2] },
    { type: "single", question: "Frage 9: How many prefectures does Japan have??", options: ["50", "28", "19", "47"], correct: 3 },{ type: "single", question: "Frage 9: What is the Biggest city in Japan?", options: ["Osaka", "Tokio", "Nara", "Fukushima"], correct: 1 },
    { type: "multiple", question: "Frage 10: (multiple selection): Welche der folgenden Früchte sind Zitrusfrüchte?", options: ["Zitrone", "Apfel", "Orange", "Banane"], correct: [0, 2] },
    { type: "single", question: "Frage 11: How many people live in Japan", options: ["122.4 million", "88.4 million", "2.8 billion", "40 million"], correct: 0 },
    { type: "single", question: "Frage 13: How many people live in Japan", options: ["122.4 million", "88.4 million", "2.8 billion", "40 million"], correct: 0 },
    { type: "multiple", question: "Frage 14: (multiple selection): Welche der folgenden Früchte sind Zitrusfrüchte?", options: ["Zitrone", "Apfel", "Orange", "Banane"], correct: [0, 2] },
    { type: "single", question: "Frage 15: How many people live in Japan", options: ["122.4 million", "88.4 million", "2.8 billion", "40 million"], correct: 0 },
]; 

let currentQuestionIndex = 0;
let score = 0;
let selectedIndices = []; // Speichert die aktuellen Klicks des Users

const quizContainer = document.getElementById("quiz");

// 2. Quiz starten
function loadQuestion() {
    selectedIndices = []; // Zurücksetzen für die neue Frage
    const currentData = quizData[currentQuestionIndex];
    
    // HTML-Gerüst für die aktuelle Frage bauen
    quizContainer.innerHTML = `
        <div class="progress">Frage ${currentQuestionIndex + 1} von ${quizData.length}</div>
        <h2>${currentData.question}</h2>
        <div class="options-container" id="options"></div>
        <button class="action-btn" id="next-btn" disabled>Bestätigen & Weiter</button>
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
        checkAnswer();
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });
}

// 3. Logik, wenn der User auf eine Antwort klickt
function handleSelect(index, button, nextBtn, type) {
    if (type === "single" || type === "matching") {
        // Bei Single-Choice alle anderen Abwählen
        const buttons = document.querySelectorAll(".option-btn");
        buttons.forEach(btn => btn.classList.remove("selected"));
        
        button.classList.add("selected");
        selectedIndices = [index];
    } else if (type === "multiple") {
        // Bei Multiple-Choice Auswahl umschalten (Toggle)
        if (selectedIndices.includes(index)) {
            selectedIndices = selectedIndices.filter(i => i !== index);
            button.classList.remove("selected");
        } else {
            selectedIndices.push(index);
            button.classList.add("selected");
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
            score++;
        }
    }
}

// 5. Endscreen anzeigen
function showResults() {
    quizContainer.innerHTML = `
        <div class="result-screen">
            <h2>Quiz beendet!</h2>
            <p>Du hast alle Fragen beantwortet. Hier ist dein Ergebnis:</p>
            <div class="score">${score} von ${quizData.length} Punkten</div>
            <button class="action-btn" onclick="location.reload()">Quiz Neustarten</button>
        </div>
    `;
}

// Quiz beim Laden der Seite initialisieren
loadQuestion();
