// 1. Die 10 Fragen (Datenstruktur)
const quizData = [
    // Typ "single": 4 Optionen, 1 richtige Lösung (6 Stück)
    { type: "single", question: "Frage 1: Was ist die Hauptstadt von Deutschland?", options: ["München", "Berlin", "Hamburg", "Köln"], correct: 1 },
    { type: "single", question: "Frage 2: Wie viele Planeten hat unser Sonnensystem?", options: ["7", "8", "9", "10"], correct: 1 },
    { type: "single", question: "Frage 3: Welches Element hat das chemische Symbol 'O'?", options: ["Gold", "Helium", "Sauerstoff", "Wasserstoff"], correct: 2 },
    { type: "single", question: "Frage 4: Wer schrieb 'Romeo und Julia'?", options: ["Goethe", "Schiller", "Shakespeare", "Kafka"], correct: 2 },
    { type: "single", question: "Frage 5: Wie viele Bundesländer hat Deutschland?", options: ["14", "15", "16", "17"], correct: 2 },
    { type: "single", question: "Frage 6: Welches Tier ist das größte Säugetier der Erde?", options: ["Elefant", "Blauwal", "Giraffe", "Orca"], correct: 1 },

    // Typ "multiple": 4 Optionen, mehrere richtige Lösungen (3 Stück)
    { type: "multiple", question: "Frage 7 (Mehrfachauswahl): Welche dieser Programmiersprachen werden oft im Webdesign genutzt?", options: ["JavaScript", "HTML", "C++", "Python"], correct: [0, 1] },
    { type: "multiple", question: "Frage 8 (Mehrfachauswahl): Welche der folgenden Früchte sind Zitrusfrüchte?", options: ["Zitrone", "Apfel", "Orange", "Banane"], correct: [0, 2] },
    { type: "multiple", question: "Frage 9 (Mehrfachauswahl): Welche dieser Länder liegen in Europa?", options: ["Frankreich", "Japan", "Spanien", "Kanada"], correct: [0, 2] },

    // Typ "matching": Verknüpfung (1 Stück) - Als intuitive Textauswahl gelöst
    { type: "single", question: "Frage 10 (Verknüpfung): Welches dieser Paare gehört zusammen? (Hardware -> Aufgabe)", options: ["CPU -> Daten speichern", "GPU -> Grafik berechnen", "RAM -> Strom liefern", "SSD -> Monitor anzeigen"], correct: 1 }
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

// 4. Auswertung der Antwort
function checkAnswer() {
    const currentData = quizData[currentQuestionIndex];

    if (currentData.type === "single" || currentData.type === "matching") {
        if (selectedIndices[0] === currentData.correct) {
            score++;
        }
    } else if (currentData.type === "multiple") {
        // Prüfen, ob die Arrays exakt übereinstimmen
        const correctAnswers = currentData.correct;
        const isCorrect = correctAnswers.length === selectedIndices.length && 
                          correctAnswers.every(val => selectedIndices.includes(val));
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