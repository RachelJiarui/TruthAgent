import "../App.css";
/* global chrome */

function StartButton({ setAIAnalysis, setError, setURL }) {
  async function handleButtonClick() {
    setError("Fetching information...");

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
    <div>
      <button onClick={handleButtonClick}>Read over my shoulder</button>
    </div>
  );
}

export default StartButton;
