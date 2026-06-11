// 1. Die 10 Fragen (Datenstruktur)
const quizData = [ 

  { type: "single", question: "Question 1: What is the biggest city in Japan?", options: ["Osaka", "Tokyo", "Nara", "Fukushima"], correct: 1 }, 

    { type: "single", question: "Question 2: What can you find on almost every street corner in Japan?", options: ["Restaurants", "Cameras", "Vending machines", "Shrines"], correct: 2 }, 

    { type: "single", question: "Question 3: Which number do people in Japan often skip because it sounds like 'death'?", options: ["Number 7", "Number 9", "Number 4", "Number 13"], correct: 2 }, 

    { type: "single", question: "Question 4: In a Japanese sentence, where does the Verb usually go?", options: ["At the very beginning", "Between Subject and Object", "At the very end", "It is usually left out"], correct: 2 }, 

    { type: "multiple", question: "Question 5: (multiple selection): Which two main religions do many Japanese people practice at the same time?", options: ["Hinduism", "Shintoism", "Buddhism", "Christianity"], correct: [1, 2] }, 

    { type: "single", question: "Question 6: Which Anime has over 7000 episodes?", options: ["Sazae-san", "One Piece", "Reborn as a Vending Machine, Now I Wander the Dungeon", "Spy X Family"], correct: 0 }, 

    { type: "single", question: "Question 7: How many prefectures does Japan have?", options: ["50", "28", "19", "47"], correct: 3 }, 

    { type: "single", question: "Question 8: Why should you never stick your chopsticks vertically into a bowl of rice?", options: ["It resembles a funeral ritual", "It breaks the chopsticks", "It is bad table manners", "It makes the food cold"], correct: 0 }, 

    { type: "single", question: "Question 9: What is the most popular sport in Japan?", options: ["Football", "Sumo", "Baseball", "Rugby"], correct: 2 }, 

    { type: "multiple", question: "Question 10: (multiple selection): The Ogasawara Islands are also known as...?", options: ["...the Ryukyu Islands", "...the Bonin Islands", "...the smallest prefecture", "...the 'Galapagos of Japan'"], correct: [1, 3] }, 

    { type: "single", question: "Question 11: Which Japanese writing system is used for foreign words like Coffee or Camera?", options: ["Romaji", "Kanji", "Katakana", "Hiragana"], correct: 2 }, 

    { type: "single", question: "Question 12: What does the traditional concept of 'Wa' stand for in Japanese society?", options: ["Speed", "Success", "Harmony", "Strength"], correct: 2 }, 

    { type: "multiple", question: "Question 13: (multiple selection): Hokkaido is a...?", options: ["...Prefecture", "...City", "...major island", "...County"], correct: [0, 2] }, 

    { type: "single", question: "Question 14: Next to rice, what else is highly important in Japanese cuisine?", options: ["Soup", "Seafood", "Udon", "Cabbage"], correct: 1 }, 

    { type: "single", question: "Question 15: How many people live in Japan?", options: ["122.4 million", "88.4 million", "2.8 billion", "40 million"], correct: 0 } 

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
