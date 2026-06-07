const orb = document.getElementById('voice-orb');
const transcript = document.getElementById('voice-transcript');
const mainContent = document.getElementById('main-content');
const footerHint = document.querySelector('.nav-hint');

const btnCamera = document.getElementById('btn-camera');

let state = 'idle';

const transcriptions = [
    "Translate my 7th grade science lesson on the circulatory system to Spanish...",
    "Adjusting medical terminology for ESL learners...",
    "Generating interactive check-points for the heart path...",
    "Finalizing translation to Neutral Latin American Spanish..."
];

btnCamera.addEventListener('click', () => {
    if (state === 'idle') {
        startCameraScan();
    }
});

orb.addEventListener('click', () => {
    if (state === 'idle') {
        startListening();
    }
});

function startCameraScan() {
    state = 'scanning';
    mainContent.innerHTML = `
        <div class="camera-view" style="width: 100%; height: 300px; background: #000; border-radius: 20px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <div class="scan-line" style="position: absolute; width: 100%; height: 2px; background: var(--accent-secondary); top: 0; animation: scanMove 2s infinite linear; box-shadow: 0 0 15px var(--accent-secondary);"></div>
            <p style="color: white; font-size: 0.875rem; opacity: 0.7;">Position lesson plan within frame...</p>
        </div>
        <div style="margin-top: 2rem;">
            <h2>Scanning Document...</h2>
            <p style="color: var(--text-muted);">Extracting text via OCR</p>
        </div>
    `;

    setTimeout(transitionToProcessing, 3000);
}

function startListening() {
    state = 'listening';
    orb.classList.add('listening');
    footerHint.textContent = "Listening...";
    
    let i = 0;
    const interval = setInterval(() => {
        transcript.textContent = transcriptions[0]; // Simplified for demo
        i++;
        if (i > 0) {
            clearInterval(interval);
            setTimeout(transitionToProcessing, 2000);
        }
    }, 500);
}

function transitionToProcessing() {
    state = 'processing';
    orb.classList.remove('listening');
    orb.style.display = 'none';
    transcript.style.display = 'none';
    footerHint.textContent = "Analyzing structure...";

    mainContent.innerHTML = `
        <div class="processing-view">
            <h2>Deconstructing Lesson</h2>
            <div class="structure-item" style="animation-delay: 0.2s">
                <div class="status-icon"></div>
                <span>Extracting Learning Objectives</span>
            </div>
            <div class="structure-item" style="animation-delay: 0.8s">
                <div class="status-icon"></div>
                <span>Mapping Timing & Sequence</span>
            </div>
            <div class="structure-item" style="animation-delay: 1.4s">
                <div class="status-icon"></div>
                <span>Identifying Required Materials</span>
            </div>
            <div class="structure-item" style="animation-delay: 2s">
                <div class="status-icon"></div>
                <span>Building Internal Representation</span>
            </div>
        </div>
    `;

    setTimeout(transitionToReview, 4000);
}

function transitionToReview() {
    state = 'review';
    footerHint.textContent = "Review your translation";
    
    mainContent.innerHTML = `
        <div class="review-view">
            <h2 class="view-title">Translation Ready</h2>
            
            <div class="summary-card">
                <div class="card-tag">AI SUMMARY</div>
                <p>I've deconstructed your <strong>'Circulatory System'</strong> lesson. Key modifications: 1) Translated to Spanish (Neutral Latin American). 2) Adjusted terminology for 7th-grade ESL learners. 3) Inserted an interactive "Quick Check" after the heart-path tracing.</p>
            </div>

            <div class="translation-stack">
                <div class="translation-block">
                    <div class="block-header">
                        <span class="block-label">LEARNING OBJECTIVE</span>
                        <div class="lang-indicators">
                            <span>EN</span>
                            <span class="arrow">→</span>
                            <span>ES</span>
                        </div>
                    </div>
                    <div class="comparison-grid">
                        <div class="text-en">Students will be able to trace the path of blood through the heart and identify the functions of arteries, veins, and capillaries.</div>
                        <div class="text-es">Los estudiantes podrán trazar el recorrido de la sangre a través del corazón e identificar las funciones de las arterias, venas y capilares.</div>
                    </div>
                </div>

                <div class="translation-block">
                    <div class="block-header">
                        <span class="block-label">KEY VOCABULARY</span>
                    </div>
                    <div class="comparison-grid">
                        <div class="text-en">Ventricle, Atrium, Pulmonary Artery, Systemic Circulation.</div>
                        <div class="text-es">Ventrículo, Atrio (Aurícula), Arteria Pulmonar, Circulación Sistémica.</div>
                    </div>
                </div>

                <div class="translation-block accent">
                    <div class="block-header">
                        <span class="block-label">AI ADDITION: QUICK CHECK</span>
                    </div>
                    <div class="comparison-grid">
                        <div class="text-en">Ask students to mimic the 'lub-dub' sound and explain which valves are closing during each sound.</div>
                        <div class="text-es">Pida a los estudiantes que imiten el sonido 'lub-dub' y expliquen qué válvulas se están cerrando durante cada sonido.</div>
                    </div>
                </div>
            </div>

            <div class="export-actions">
                <button class="primary-btn" id="btn-download">
                    <span class="icon">📄</span>
                    <span>Export PDF</span>
                </button>
                <button class="secondary-btn" id="btn-copy">
                    <span class="icon">📋</span>
                    <span>Copy Text</span>
                </button>
            </div>
        </div>
    `;

    // Attach event listeners to new buttons
    document.getElementById('btn-download').addEventListener('click', () => {
        const text = "Polyflow Translation: Los estudiantes podrán trazar el recorrido de la sangre a través del corazón e identificar las funciones de las arterias, venas y capilares.";
        const blob = new Blob([text], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'circulatory_system_es.txt';
        a.click();
        footerHint.textContent = "File Downloaded!";
    });

    document.getElementById('btn-copy').addEventListener('click', () => {
        navigator.clipboard.writeText("Los estudiantes podrán trazar el recorrido de la sangre a través del corazón e identificar las funciones de las arterias, venas y capilares.");
        footerHint.textContent = "Copied to clipboard!";
        setTimeout(() => footerHint.textContent = "Review your translation", 2000);
    });
}
