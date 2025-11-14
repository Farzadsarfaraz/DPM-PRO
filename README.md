**Voice Correction Demo – Coding Challenge**

This small project was built as part of a software development assignment.
The goal was to create a simple Single Page Application where a user can:

record audio directly in the browser

listen to the original recording

send the audio together with their email to a backend

let the backend run a “grammar correction” step

receive the corrected result and play it back


**Tech Stack**: 

Frontend:

React.js

TailwindCSS for minimal styling

MediaRecorder API for audio recording

Web Speech API for speech recognition + synthesizing corrected audio

I chose React because it lets me structure the app cleanly even when the UI is small, and because it’s quick to set up a SPA without extra overhead.

Backend:

Node.js + Express

Multer for file uploads

Axios to call the LanguageTool grammar correction API

Express is a good fit for this kind of small REST API, and Multer made audio uploads straightforward.


**Architecture Overview**

<img width="633" height="108" alt="Screenshot 2025-11-14 030445" src="https://github.com/user-attachments/assets/529d48d8-d8fe-4f84-aee1-9bd5569ac4eb" />


**What actually happens:**

The browser records raw audio (WebM) using MediaRecorder.

At the same time, the browser captures the transcript using the Speech Recognition API.

The frontend sends the audio file + transcript + email to the backend.

The backend calls LanguageTool to fix grammar.

Instead of generating a real audio file, the frontend uses the corrected text and synthesizes the “corrected audio” using the Web Speech API (TTS).

The corrected version can be played in the UI.

**How to Run (Local Development):**

Backend:
cd backend
npm install
npm run dev

Frontend:
cd frontend
npm install
npm run dev


**Architecture Diagram**

<img width="464" height="652" alt="Screenshot 2025-11-14 024149" src="https://github.com/user-attachments/assets/7b1f4508-324c-4ca9-9de4-0734f4ab05c6" />




