import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);
  const [userSpeech, setUserSpeech] = useState("");
  const [resultText, setResultText] = useState("");

  // Speak helper
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (input)
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support Web Speech API.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setUserSpeech(transcript);

      if (step === 1) {
        if (transcript.includes("ice") || transcript.includes("giants")) {
          handleExhibitChoice("ice");
        } else if (transcript.includes("space")) {
          handleExhibitChoice("space");
        }
      } else if (step === 2) {
        if (transcript.includes("general")) {
          handleGuidance("general");
        } else if (transcript.includes("surprise")) {
          handleGuidance("surprise");
        }
      }
    };

    recognition.onerror = (event) => {
      alert("Speech recognition error: " + event.error);
    };
  };

  // Step handlers
  const handleExhibitChoice = (choice) => {
    if (choice === "ice") {
      setStep(2);
      speak(
        "You chose The Giants of the Ice Age. The exhibition is located at the north end of the museum. How would you like your visit to be?"
      );
    } else {
      alert("Voice guidance for that exhibit isn’t ready yet.");
    }
  };

  const handleGuidance = (option) => {
    setStep(3);
    if (option === "general") {
      const message = `
        Travel 14,000 years back in time with us.
        The Giants of the Ice Age exhibition is set at the end of the last Ice Age, between 120,000 and 11,000 years ago.
        The exhibition is divided into four areas: Finland, Europe and Eurasia, North America, and South America.
        You’ll see what nature looked like and what animal species lived in each region. Almost twenty life-size animal robots await you — including a mammoth and a saber-toothed cat!
      `;
      setResultText(message);
      speak(message);
    } else if (option === "surprise") {
      const message = `
        Rock Painting: You can use your finger to paint on the rock wall!
        This installation is at the north-east corner of the exhibition hall.
        These Ice Age paintings are among the earliest forms of art. They show animals in motion, human figures, and abstract symbols — made using natural dyes mixed with fat or saliva.
      `;
      setResultText(message);
      speak(message);
    }
  };

  const goBackToStep = (num) => {
    setStep(num);
    if (num === 1)
      speak("Which exhibition are you interested in visiting today?");
    if (num === 2) speak("How would you like your visit to be?");
  };

  useEffect(() => {
    speak(
      "Hi! I'm Curio. Welcome to Heureka. Which exhibition are you interested in visiting today?"
    );
  }, []);

  return (
    <div className="container">
      <h1>
        Hi! I’m Curio. <br />
        Welcome to Heureka.
      </h1>

      {step === 1 && (
        <div>
          <p>Which exhibition are you interested in visiting today?</p>
          <button onClick={() => handleExhibitChoice("space")}>
            Journey in Space
          </button>
          <button onClick={() => handleExhibitChoice("ice")}>
            The Giants of the Ice Age
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>The Giants of the Ice Age</h2>
          <p>
            <strong>Location:</strong> The exhibition is located at the north
            end of the museum.
          </p>
          <p>How would you like your visit to be?</p>
          <button onClick={() => handleGuidance("general")}>
            General guidance
          </button>
          <button onClick={() => handleGuidance("surprise")}>
            Surprise me
          </button>
          <button className="back-button" onClick={() => goBackToStep(1)}>
            ← Return to last page
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <div className="result-content">
            <h3>{resultText.includes("Rock Painting") ? "Surprise Me" : "General Guidance"}</h3>
            <p>{resultText}</p>
          </div>
          <button className="back-button" onClick={() => goBackToStep(2)}>
            ← Return to last page
          </button>
        </div>
      )}

      <button id="mic" onClick={startListening}>
        🎤 Speak Your Choice
      </button>
      {userSpeech && <div className="user-speech">You said: "{userSpeech}"</div>}
    </div>
  );
}

export default App;
