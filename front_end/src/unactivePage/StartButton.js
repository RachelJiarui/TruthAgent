import "../App.css";
/* global chrome */

function StartButton({ setAIAnalysis, setError }) {
  async function handleButtonClick() {
    setError("Fetching information...");
    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.sendMessage
    ) {
      chrome.runtime.sendMessage(
        { action: "runBackgroundTask" },
        (response) => {
          if (response.status === "success") {
            const resp = JSON.parse(response.data);
            console.log("Response: " + resp);
            setAIAnalysis(resp);
          } else {
            console.log("Error:", response.message);
            setError(response.message);
          }
        },
      );
    } else {
      const errorMessage = "Chrome runtime is not available";
      setError(errorMessage);
    }
  }

  return (
    <div>
      <button onClick={handleButtonClick}>Read over my shoulder</button>
    </div>
  );
}

export default StartButton;
