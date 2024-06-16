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

      console.log("Valid URL found: " + tabUrl);
      // Call the Flask API GET endpoint '/parse_webpage', passing in the URL
      fetch(
        `http://127.0.0.1:5000/parse_webpage?url=${encodeURIComponent(tabUrl)}`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((parsedWebpage) => {
          console.log("Received parsed webpage: " + parsedWebpage);
          sendResponse({ status: "success", data: parsedWebpage });
        })
        .catch((error) => {
          console.error("Error fetching parsed webpage:", error);
          sendResponse({ status: "error", message: error.message });
        });
    });

    return true; // Indicates that the response is asynchronous
  }
});
