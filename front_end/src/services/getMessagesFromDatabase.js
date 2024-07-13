export default async function getMessagesFromDatabase(
  url,
  focusType,
  focusSentence,
) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/get-msgs?url=${encodeURIComponent(url)}&focusType=${encodeURIComponent(focusType)}&focusSentence=${encodeURIComponent(focusSentence)}`,
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Messages retrieved:", data.messages);
      return data.messages;
    } else {
      console.error("Error retrieving messages:", data.error);
      return [];
    }
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return [];
  }
}
