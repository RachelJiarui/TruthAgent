if (typeof init === "undefined") {
  const init = function (aiInfo) {
    // Create a function to wrap a given string with a div element
    const wrapText = (textNode, highlight, word) => {
      const regex = new RegExp(`(${word})`, "gi");
      const html = textNode.nodeValue.replace(
        regex,
        `<div class="${highlight}">$1</div>`,
      );
      const tempElement = document.createElement("div");
      tempElement.innerHTML = html;

      // Replace the text node with the newly created nodes
      while (tempElement.firstChild) {
        textNode.parentNode.insertBefore(tempElement.firstChild, textNode);
      }
      textNode.parentNode.removeChild(textNode);
    };

    // Function to recursively search and wrap the word in text nodes
    const searchAndWrap = (node, word) => {
      if (node.nodeType === 3) {
        // Node.TEXT_NODE
        if (node.nodeValue.toLowerCase().includes(word.toLowerCase())) {
          wrapText(node, word);
        }
      } else if (node.nodeType === 1) {
        // Node.ELEMENT_NODE
        for (
          let child = node.firstChild;
          child !== null;
          child = child.nextSibling
        ) {
          searchAndWrap(child, word);
        }
      }
    };

    // Setting up the colors
    const redStyle = document.createElement("redStyle");
    redStyle.textContent = `
      .red-highlight {
        background-color: red;
        display: inline;
      }
    `;
    const orangeStyle = document.createElement("orangeStyle");
    orangeStyle.textContent = `
      .orange-highlight {
        background-color: orange;
        display: inline;
      }
    `;
    const blueStyle = document.createElement("blueStyle");
    blueStyle.textContent = `
      .red-highlight {
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

    // going through all the sentence alerts and highlighting them appropriately
    console.log("Got to contentScript. AiInfo:", aiInfo);
    searchAndWrap(document.body, "Boston");
  };

  init();
}
