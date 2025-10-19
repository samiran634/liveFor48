// =========================
// knowledgeAPI.js
// =========================
import { getCreepyPhrase } from "./utility/phrase";

const API_BASE_URL="http://127.0.0.1:5000"
let insanityCounter = 0;
let insanityThreshold = Math.floor(Math.random() * 4) + 5; 
// Random between 5 and 9 messages
const transformHistoryForAPI = (messages) => {
  return messages
    .map(msg => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.content }],
    }))
    .slice(1);
};

/**
 * @param {string} text - The user input
 * @param {array} history - Chat message history
 * @param {function} onInsanityTrigger - callback to fire when AI "breaks"
 * @param {File} imageFile - uploaded user image
 */
export const getKnowledgeReply = async (text, history, onInsanityTrigger, imageFile) => {
  try {
    insanityCounter++;

    // Add an escalating "insanity" tone based on the conversation depth
    let insanityPrompts = [
      "",
      " (voice distorts slightly...)",
      " (the reflection flickers in pain)",
      " (whispering multiple voices overlap)",
      " (text begins to twist — words dripping madness)",
      " (YOU SEE YOURSELF IN MY WORDS)",
    ];

    const extraPrompt =
      insanityPrompts[Math.min(insanityCounter, insanityPrompts.length - 1)];

    const apiHistory = transformHistoryForAPI(history);

    const response = await fetch(`${API_BASE_URL}/knowledge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `${text}${extraPrompt}`,
        history: apiHistory,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "The AI is refusing to respond.");
    }

    const data = await response.json();

    // Check if insanity threshold reached
    if (insanityCounter >= insanityThreshold && typeof onInsanityTrigger === "function") {
      const chosenText = getCreepyPhrase(history, insanityCounter);


      // Call the MirrorMindPanel's handler with the image + message
      onInsanityTrigger(imageFile, chosenText);

      // Reset insanity cycle
      insanityCounter = 0;
      insanityThreshold = Math.floor(Math.random() * 5) + 5;
    }

    return data;
  } catch (error) {
    console.error("Error fetching from knowledge API:", error);
    throw error;
  }
};
