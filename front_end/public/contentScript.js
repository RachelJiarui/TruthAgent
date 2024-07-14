/* global chrome */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "init") {
    const aiInfo = message.aiInfo.data;
    console.log("Content script ran. Received:", JSON.stringify(aiInfo));

    const wrapText = (textNode, highlight, word) => {
      const regex = new RegExp(`(${word})`, "gi");
      const html = textNode.nodeValue.replace(
        regex,
        `<span class="${highlight}">$1</span>`,
      );
      const tempElement = document.createElement("div");
      tempElement.innerHTML = html;

      // Replace the text node with the newly created nodes
      while (tempElement.firstChild) {
        textNode.parentNode.insertBefore(tempElement.firstChild, textNode);
      }
      textNode.parentNode.removeChild(textNode);
    };

    const searchAndWrap = (node, highlight, word) => {
      if (node.nodeType === 3) {
        // Node.TEXT_NODE
        if (node.nodeValue.toLowerCase().includes(word.toLowerCase())) {
          wrapText(node, highlight, word);
        }
      } else if (node.nodeType === 1) {
        // Node.ELEMENT_NODE
        for (
          let child = node.firstChild;
          child !== null;
          child = child.nextSibling
        ) {
          searchAndWrap(child, highlight, word);
        }
      }
    };

    const styles = `
      .red-highlight {
        background-color: #ff9a9a; /* Red background with 30% opacity */
        display: inline;
        position: relative;
        text-decoration: underline;
        text-decoration-color: red;
      }

      .orange-highlight {
        background-color:#ffd099;
        display: inline;
        position: relative;
        text-decoration: underline;
        text-decoration-color: orange;
      }

      .blue-highlight {
        background-color: #9acdff; /* Blue background with 30% opacity */
        display: inline;
        position: relative;
        text-decoration: underline;
        text-decoration-color: blue;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    const alertToStyle = {
      red: "red-highlight",
      orange: "orange-highlight",
      blue: "blue-highlight",
    };

    const webAnnotations = aiInfo.webpage_annotations;
    Object.entries(webAnnotations).forEach(([color, listOfAlerts]) => {
      let highlightStyle = alertToStyle[color];
      console.log("Highlight: ", alert.sentence, highlightStyle);
      listOfAlerts.forEach((alert) => {
        searchAndWrap(document.body, highlightStyle, alert.sentence);
      });
    });

    sendResponse({ result: "Highlighting completed" });
  }
  return true;
});
