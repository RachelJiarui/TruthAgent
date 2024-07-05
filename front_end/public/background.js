/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "runBackgroundTask") {
    // Get the URL of the current window tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ status: "error", message: "No active tab found" });
        return;
      }

      const tab = tabs[0];
      const tabUrl = tab.url;

      if (tabUrl.startsWith("chrome://")) {
        sendResponse({
          status: "error",
          message: "Cannot process chrome:// URLs",
        });
        return;
      }

      console.log("Valid URL found: " + tabUrl + ". Calling AI info API...");
      // Call the Flask API GET endpoint '/ai-reading', passing in the URL
      fetch(
        `http://127.0.0.1:5000/ai-reading?url=${encodeURIComponent(tabUrl)}`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((aiInfo) => {
          console.log(
            "Successfully fetched AI info: " + JSON.stringify(aiInfo),
          );
          highlightInfo(tab.id, aiInfo);
          sendResponse({
            status: "success",
            data: { aiAnalysis: aiInfo, url: tabUrl },
          });
        })
        .catch((error) => {
          console.error("Error fetching AI info:", error);
          sendResponse({ status: "error", message: error.message });
        });
    });

    return true; // Indicates that the response is asynchronous
  }
});

function highlightInfo(tabId, aiInfo) {
  console.log("Executing highlightInfo function...");
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      files: ["contentScript.js"],
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error injecting content script:",
          chrome.runtime.lastError.message,
        );
        return;
      }
      chrome.tabs.sendMessage(
        tabId,
        { command: "init", aiInfo: aiInfo },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error sending message to content script:",
              chrome.runtime.lastError.message,
            );
            return;
          }
          if (response && response.result) {
            console.log(response.result);
          } else {
            console.error("No response from content script.");
          }
        },
      );
    },
  );
}
