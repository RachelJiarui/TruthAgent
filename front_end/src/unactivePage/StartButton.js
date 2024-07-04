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
      chrome.runtime.sendMessage(
        { action: "runBackgroundTask" },
        (response) => {
          if (response.status === "success") {
            console.log(
              "Response retrieved from background.js: ",
              JSON.stringify(response),
            );
            const aiAnalysis = response.data.aiAnalysis.data;
            const url = response.data.url;
            setURL(url);
            setAIAnalysis(aiAnalysis);
            // TODO: Post on a database with the URL as a key and the ai analysis to store it
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
