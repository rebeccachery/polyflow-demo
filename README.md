# PolyFlow Demo Repository

A collection of standalone AI-powered educational prototypes exploring how learning can become more adaptive, multimodal, and interactive.

This repository contains public-facing demos built to showcase core ideas behind the broader PolyFlow vision, without exposing production systems or private codebases.

## Current Focus
The current v1 MVP is focused on **Haitian Creole** as the initial language context for prototyping, evaluation, and user experience design. This focus reflects a practical starting point for building and testing PolyFlow’s core ideas in multilingual, voice-enabled learning.

At the same time, PolyFlow is being designed with broader applicability in mind. The long-term goal is to support additional languages and learning contexts as the system evolves.

## Current Demos

### Flashcard Echo
A voice-driven flashcard system that lets users respond verbally and receive real-time feedback based on transcription and semantic scoring.

#### Highlights:
* Speech-to-text answer evaluation
* Intelligent response scoring
* Interactive flashcard sessions
* Learning loop with instant feedback

### Lesson Plan Translator
Transforms structured lesson plans into simplified, learner-friendly formats and alternative explanations.

#### Highlights:
* Input: raw lesson plan content
* Output: simplified or adapted teaching versions
* Supports different learning levels and contexts
* Useful for tutors, educators, and self-learners

## Running the Demos

Both demos are standalone prototypes. They run locally in your browser and do not require API keys or backend services.

### Prerequisites

- A modern browser (Chrome, Firefox, Safari, or Edge)
- [Node.js](https://nodejs.org/) 18+ (Lesson Plan Translator only)
- Microphone access for voice interactions (Flashcard Echo)

### Flashcard Echo

The flashcard demo is a static site—no build step or dependencies.

```bash
cd flashcard-demo
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

If you do not have Python installed, you can use any static file server instead:

```bash
cd flashcard-demo
npx serve .
```

Click the voice orb to hear a phrase, respond aloud, and receive instant feedback. Use **Replay** and **Slow** to hear the prompt again at different speeds.

### Lesson Plan Translator

The lesson plan demo uses [Vite](https://vite.dev/) for local development.

```bash
cd lesson-plan-translator-demo
npm install
npm run dev
```

Vite prints a local URL (typically [http://localhost:5173](http://localhost:5173)). Open it in your browser.

- Tap the voice orb to simulate a spoken lesson-plan request.
- Tap the camera button to simulate scanning a document.

To build for production:

```bash
npm run build
npm run preview
```

## Vision
These demos explore early building blocks of a larger system focused on:
* AI-assisted learning workflows
* Voice-first education interfaces
* Automated curriculum transformation
* Personalized feedback loops for learners
* Multilingual learning experiences, beginning with Haitian Creole and expanding to other languages over time

Together, they demonstrate how educational content can evolve from static material → interactive learning systems.

## Note on Scope
This repository is intentionally limited to **public demonstration code only**.
It does not include:
* Production PolyFlow systems
* Private datasets
* Internal architecture or infrastructure
* Sensitive API configurations

## Status
Actively iterating on prototype features and expanding into additional learning workflows such as:
* adaptive tutoring workflows
* multilingual learning support
* AI-generated practice exercises
* expanded voice-first interactions

Current development is centered on Haitian Creole for the demo / v1 MVP, while maintaining a foundation that can later extend to other languages and educational use cases.