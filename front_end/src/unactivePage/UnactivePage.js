import StartButton from "./StartButton";
import { useState } from "react";

function UnactivePage({ setAIAnalysis }) {
  const [error, setError] = useState("");

  return (
    <div>
      <StartButton setAIAnalysis={setAIAnalysis} setError={setError} />
      {error}
    </div>
  );
}

export default UnactivePage;
