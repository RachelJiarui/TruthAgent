try {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (
      changeInfo.status === "complete" &&
      tab.url &&
      !tab.url.startsWith("chrome://")
    ) {
      chrome.scripting.executeScript({
        files: ["contentScript.js"],
        target: { tabId: tab.id },
      });
    }
  });

  console.log("Did we get here?");

  (async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab && tab.url && !tab.url.startsWith("chrome://")) {
        console.log("Did we get there?");
        console.log(tab.url);
      } else {
        console.log("Tab is not available or is a chrome:// URL");
      }
    } catch (err) {
      console.error("Error querying the active tab:", err);
    }
  })();
} catch (e) {
  console.log(e);
}
