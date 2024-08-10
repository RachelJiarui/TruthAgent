import StartButton from "./StartButton";
import { useState } from "react";
import "./UnactivePage.css";

function UnactivePage({ setAIAnalysis, setURL }) {
  const [error, setError] = useState(
    "Click 'Digest page' to begin analyzing the page",
  );

  return (
    <div className="background-container custom-position">
      <div className="epic">
        <div className="epic-title">Veritas</div>
        <div className="epic-desc">Your aid in search of the truth</div>
        <StartButton
          setAIAnalysis={setAIAnalysis}
          setError={setError}
          setURL={setURL}
        />
      </div>
      <div className="epic-think-bubble">
        <div className="epic-think-bubble-content">
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default UnactivePage;
