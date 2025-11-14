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

User   →   Frontend (React)   →   Backend (Express)   →   LanguageTool API
  ↑                      ↓                     ↓
  └──────────── Corrected audio/text returned ─┘


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
 ┌──────────────────────────┐
 │        Frontend          │
 │     (React SPA)          │
 │                          │
 │ • Record audio (MediaRecorder) 
 │ • Speech-to-text preview         
 │ • Send audio + email               
 │ • Show corrected text               
 │ • Generate corrected audio (TTS)    
 └──────────────┬───────────┘
                │ POST /upload
                ▼
 ┌──────────────────────────┐
 │         Backend          │
 │    (Node.js + Express)   │
 │                          │
 │ • Receive audio upload
 │ • Receive email + transcript
 │ • Call LanguageTool API
 │ • Return corrected text
 └──────────────┬───────────┘
                │
                ▼
 ┌──────────────────────────┐
 │     Grammar Service      │
 │     (LanguageTool API)   │
 │ • Fix grammar mistakes    │
 │ • Return corrected text    │
 └──────────────────────────┘



