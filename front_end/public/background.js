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

      console.log("Valid URL found: " + tabUrl + ". Calling ai info API...");
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
          console.log("Successfully fetched AI info: " + aiInfo);
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
