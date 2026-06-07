const orb = document.getElementById('voice-orb');
const feedbackContainer = document.getElementById('feedback-container');
const scoreValue = document.getElementById('score-value');
const aiTip = document.getElementById('ai-tip');
const targetPhraseEl = document.getElementById('target-phrase');
const hintText = document.getElementById('hint-text');
const audioControls = document.getElementById('audio-controls');
const btnReplay = document.getElementById('btn-replay');
const btnSlow = document.getElementById('btn-slow');

// Persona Content
const phrases = [
    "Ki kote doulè a ye?",
    "Eske w ka dekri doulè a sou yon echèl de youn a dis?",
    "Eske w gen souffle kout vin pi mal lè w kouche?",
    "Nou bezwen siviv vital ou chak kenz minit.",
    "Rezilta MRI tès ou ap pare demen maten."
];

let currentPhraseIndex = 0;
let state = 'idle'; // idle, hearing, speaking, scoring

// Initialize Speech
const synth = window.speechSynthesis;
let mediaRecorder;
let recordedChunks = [];

// AUDIO TTS
function playStimulus(rate = 1.0, callback) {
    const utterance = new SpeechSynthesisUtterance(phrases[currentPhraseIndex]);
    utterance.rate = rate;
    utterance.lang = 'ht-HT';

    const voices = synth.getVoices();
    const bestVoice = voices.find(v => v.lang.includes('fr')) || voices[0];
    utterance.voice = bestVoice
    
    if (callback) {
        utterance.onend = callback;
    }

    synth.speak(utterance);
}

orb.addEventListener('click', () => {
    console.log("ORB CLICKED");

    if (state === 'idle') {
        startHearPhase();
    } else if (state === 'scoring') {
        resetToNext();
    }
});

btnReplay.addEventListener('click', () => playStimulus(1.0));
btnSlow.addEventListener('click', () => playStimulus(0.5));

function startHearPhase() {
    console.log("HEAR PHASE");
    state = 'hearing';
    orb.classList.add('processing');
    hintText.textContent = "Listening to stimulus...";
    feedbackContainer.classList.remove('show');
    audioControls.classList.remove('visible');

    playStimulus(1.0, () => {
        orb.classList.remove('processing');
        startSpeakPhase();
    });
}

function startSpeakPhase() {
    console.log("START SPEAK PHASE");
    state = 'speaking';
    orb.classList.add('listening');
    hintText.textContent = "Your turn! Speak now...";
    
    startRecording();
}

async function startRecording() {
    console.log("REQUESTING MIC");
    const stream =
        await navigator.mediaDevices.getUserMedia({
            audio: true
        });

    console.log("MIC GRANTED");
    recordedChunks = [];

    mediaRecorder =
        new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = async () => {
        const audioBlob =
            new Blob(recordedChunks, {
                type: "audio/webm"
            });

        stream
            .getTracks()
            .forEach(track => track.stop());

        simulateTranscription(audioBlob);
    };

    mediaRecorder.start();

    hintText.textContent =
        "Recording...";

    setTimeout(() => {
        if (
            mediaRecorder &&
            mediaRecorder.state === "recording"
        ) {
            mediaRecorder.stop();
        }
    }, 5000);
}

function simulateTranscription(audioBlob) {
    console.log("SIMULATING TRANSCRIPTION");

    orb.classList.remove("listening");
    orb.classList.add("processing");

    hintText.textContent = "Analyzing speech...";

    setTimeout(() => {
        // simulate imperfect user speech
        const fakeTranscript = slightlyModify(
            phrases[currentPhraseIndex]
        );

        processResult(fakeTranscript);
    }, 500);
}

function slightlyModify(text) {
    return text
        .toLowerCase()
        .replace("doulè", "doule")
        .replace("sou", "so")
        .replace("ye", "yé");
}

function processResult(userSpeech) {
    state = 'scoring';
    orb.classList.remove('listening');
    orb.classList.add('processing');
    hintText.textContent = "Scoring your speech...";

    const target = phrases[currentPhraseIndex].toLowerCase().replace(/[.,?!]/g, "");
    const input = userSpeech.toLowerCase();

    // Small delay to simulate "processing" but stay under 1s
    setTimeout(() => {
        const score = calculateScore(target, input);
        displayFeedback(score);
    }, 400);
}

function calculateScore(target, input) {
    const distance = levenshtein(target, input);
    const maxLength = Math.max(target.length, input.length);
    const score = Math.round(((maxLength - distance) / maxLength) * 100);
    return score;
}

function displayFeedback(score) {
    orb.classList.remove('processing');
    scoreValue.textContent = `${score}%`;
    
    // Color mapping
    scoreValue.className = 'score-value';
    if (score >= 90) scoreValue.classList.add('score-perfect');
    else if (score >= 70) scoreValue.classList.add('score-good');
    else scoreValue.classList.add('score-low');

    // Generate AI Tip
    if (score < 100) {
        aiTip.textContent = generatePhoneticTip(phrases[currentPhraseIndex], score);
        aiTip.style.display = 'block';
    } else {
        aiTip.style.display = 'none';
    }

    feedbackContainer.classList.add('show');
    audioControls.classList.add('visible');
    hintText.textContent = "Tap orb for next phrase";
}

function generatePhoneticTip(phrase, score) {
    const tips = [
        "Your r sound is too English—produce it more from the throat.",
        "Keep the vowels short and firm; avoid stretching them.",
        "Say kouche as kou-che with a clear ch like ‘sh,’ not an English hard ch as in ‘chair.’",
        "Keep doulè short and even; don’t stretch it like English ‘doo-lay.’",
        "In dekri, make the r from the throat, not with an English tongue-curled r."
    ];
    // Return a tip based on the phrase content or a random one for MVP
    if (phrase.includes("kouche")) return "Say kouche as kou-che with a clear ch like ‘sh,’ not an English hard ch as in ‘chair.’";
    if (phrase.includes("doulè")) return "Keep doulè short and even; don’t stretch it like English ‘doo-lay.’";
    if (phrase.includes("dekri")) return "In dekri, make the r from the throat, not with an English tongue-curled r.";
    return tips[Math.floor(Math.random() * tips.length)];
}

function resetToNext() {
    currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
    targetPhraseEl.textContent = phrases[currentPhraseIndex];
    feedbackContainer.classList.remove('show');
    audioControls.classList.remove('visible');
    hintText.textContent = "Tap the orb to start the stimulus";
    state = 'idle';
}

// Levenshtein Distance Algorithm
function levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
}
