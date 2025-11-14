import React, { useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './index.css';

const App = () => {
  const [email, setEmail] = useState('');
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="text-gray-700 text-center mt-20 text-lg">
        Browser doesn't support speech recognition.
      </div>
    );
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = e => audioChunksRef.current.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
    };

    mediaRecorder.start();
    setRecording(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    resetTranscript();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    SpeechRecognition.stopListening();
  };

  const sendAudio = async () => {
    if (!email || !audioChunksRef.current.length)
      return alert('Email and recording required');

    const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('email', email);
    formData.append('audio', blob, 'recording.webm');
    formData.append('transcript', transcript);

    const res = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();

    setCorrectedText(data.correctedText);

    const utterance = new SpeechSynthesisUtterance(data.correctedText);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 font-sans">
      <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800 text-center">
        Audio Correction App
      </h1>
      <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-sm space-y-5 border border-gray-200">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md 
                     placeholder-gray-400 text-gray-700 focus:ring-1 focus:ring-gray-300"
        />
        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={startRecording}
            disabled={recording}
            className={`flex-1 py-2 rounded-md border text-gray-700 bg-gray-200 hover:bg-gray-300 transition ${
              recording ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            🎙 Start
          </button>

          <button
            onClick={stopRecording}
            disabled={!recording}
            className={`flex-1 py-2 rounded-md border text-gray-700 bg-gray-200 hover:bg-gray-300 transition ${
              !recording ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            ⏹ Stop
          </button>

          <button
            onClick={sendAudio}
            className="flex-1 py-2 rounded-md border text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          >
            Send
          </button>
        </div>
        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-1">Transcript</h3>
          <p className="text-gray-800 min-h-[2rem]">
            {transcript || (listening ? 'Listening…' : 'No speech yet.')}
          </p>
        </div>
        {audioURL && (
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-1">Original Audio</h3>
            <audio src={audioURL} controls className="w-full rounded-md" />
          </div>
        )}
        {correctedText && (
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-2">
            <h3 className="font-medium text-gray-700 mb-1">Corrected Text & Audio</h3>
            <p className="text-gray-800">{correctedText}</p>

            <button
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(correctedText);
                utterance.lang = 'en-US';
                window.speechSynthesis.speak(utterance);
              }}
              className="px-4 py-1 border rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
            >
              ▶ Play Audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
