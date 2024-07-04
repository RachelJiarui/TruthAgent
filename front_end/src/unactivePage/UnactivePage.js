import StartButton from "./StartButton";
import { useState } from "react";

function UnactivePage({ setAIAnalysis, setURL }) {
  const [error, setError] = useState("");

  return (
    <div>
      <StartButton
        setAIAnalysis={setAIAnalysis}
        setError={setError}
        setURL={setURL}
      />
      {error}
    </div>
  );
}

export default UnactivePage;
