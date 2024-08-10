import "../App.css";
import "./UnactivePage.css";
/* global chrome */

function StartButton({ setAIAnalysis, setError, setURL }) {
  async function handleButtonClick() {
    setError("Reading over your shoulder...");

    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.sendMessage
    ) {
      try {
        const response = await new Promise((resolve, reject) => {
          chrome.runtime.sendMessage(
            { action: "runBackgroundTask" },
            (response) => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else {
                resolve(response);
              }
            },
          );
        });

        console.log("Got back to StartButton:", JSON.stringify(response));
        if (response.status === "success") {
          const aiAnalysis = response.data.aiAnalysis.data;
          const url = response.data.aiAnalysis.data.url;
          setURL(url);
          setAIAnalysis(aiAnalysis);
        } else {
          console.log("Error:", response.message);
          setError(response.message);
        }
      } catch (error) {
        console.error("Error in response:", error.message);
        setError(error.message);
      }
    } else {
      const errorMessage = "Chrome runtime is not available";
      setError(errorMessage);
    }
  }

  return (
    <button className="start-button" onClick={handleButtonClick}>
      Digest page
    </button>
  );
}

export default StartButton;
