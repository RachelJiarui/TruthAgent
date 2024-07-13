export default async function postMessagesToDatabase(
  url,
  focusType,
  focusSentence,
  userMessage,
  aiMessage,
) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/post-msg-pairing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        focusType: focusType,
        focusSentence: focusSentence,
        userMsg: userMessage,
        aiMsg: aiMessage,
      }),
    });
    const data = await response.json();
    console.log("Messages saved:", data);
  } catch (error) {
    console.error("Error saving messages:", error);
  }
}
