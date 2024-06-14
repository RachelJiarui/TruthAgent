if (typeof init === "undefined") {
  const init = function () {
    // Create a function to wrap the word "Google" with a div element
    const wrapText = (textNode, word) => {
      const regex = new RegExp(`(${word})`, "gi");
      const html = textNode.nodeValue.replace(
        regex,
        `<div class="highlight">$1</div>`,
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

    // Inject CSS for highlighting
    const style = document.createElement("style");
    style.textContent = `
      .highlight {
        background-color: yellow;
        display: inline;
      }
    `;
    document.head.appendChild(style);

    // Start the search from the body element
    searchAndWrap(document.body, "Boston");
  };

  init();
}
