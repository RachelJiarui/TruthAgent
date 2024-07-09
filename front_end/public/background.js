/* global chrome */
function getCurrentTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        resolve(null);
        return;
      }
      const tab = tabs[0];
      const tabUrl = tab.url;

      if (tabUrl.startsWith("chrome://")) {
        resolve(null);
        return;
      }

      resolve(tab); // Resolve the promise with the tab (tab.url) is the actual url
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "runBackgroundTask") {
    (async () => {
      try {
        const tab = await getCurrentTab();
        console.log("This is what tab stores:", JSON.stringify(tab));
        const url = tab?.url;
        if (!url) {
          sendResponse({
            status: "error",
            message: "No active tab found or invalid URL",
          });
          return;
        }

        console.log("Calling /check-cache");
        // Call Flask API GET endpoint /check-cache with the url to see if there is anything
        const response = await fetch(
          `http://127.0.0.1:5000/check-cache?url=${encodeURIComponent(url)}`,
        );
        if (!response.ok) {
          throw new Error(
            `HTTP error for checking cache! status: ${response.status}`,
          );
        }

        const isAiInfo = await response.json();
        console.log("Received AI analysis from check-cache:", isAiInfo);
        if (isAiInfo) {
          sendResponse({
            status: "success",
            data: { aiAnalysis: isAiInfo, url: url },
          });
        } else {
          console.log("Valid URL found: " + url + ". Calling AI info API...");
          const aiResponse = await fetch(
            `http://127.0.0.1:5000/ai-reading?url=${encodeURIComponent(url)}`,
          );
          if (!aiResponse.ok) {
            throw new Error(
              `HTTP error for AI Analysis! status: ${aiResponse.status}`,
            );
          }

          const aiInfo = await aiResponse.json();
          console.log(
            "Successfully fetched AI info: " + JSON.stringify(aiInfo),
          );
          highlightInfo(tab.id, aiInfo);
          sendResponse({
            status: "success",
            data: { aiAnalysis: aiInfo, url: url },
          });
        }
      } catch (error) {
        console.error("Error in background task:", error.message);
        sendResponse({ status: "error", message: error.message });
      }
    })();

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
