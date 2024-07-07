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

    const redStyle = document.createElement("style");
    redStyle.textContent = `
      .red-highlight {
        background-color: red;
        display: inline;
      }
    `;
    const orangeStyle = document.createElement("style");
    orangeStyle.textContent = `
      .orange-highlight {
        background-color: orange;
        display: inline;
      }
    `;
    const blueStyle = document.createElement("style");
    blueStyle.textContent = `
      .blue-highlight {
        background-color: blue;
        display: inline;
      }
    `;

    document.head.appendChild(redStyle);
    document.head.appendChild(blueStyle);
    document.head.appendChild(orangeStyle);

    const alertToStyle = {
      red: "red-highlight",
      orange: "orange-highlight",
      blue: "blue-highlight",
    };

    const webAnnotations = aiInfo.webpage_annotations;
    Object.entries(webAnnotations).forEach(([color, listOfAlerts]) => {
      let highlightStyle = alertToStyle[color];
      listOfAlerts.forEach((alert) => {
        searchAndWrap(document.body, highlightStyle, alert.sentence);
      });
    });

    searchAndWrap(document.body, "blue-highlight", "Technology");

    sendResponse({ result: "Highlighting completed" });
  }
  return true;
});
