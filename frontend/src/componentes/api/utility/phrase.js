// Utility: extract simple keywords & tone from chat
const analyzeConversation = (messages) => {
  const text = messages.map((m) => m.content.toLowerCase()).join(" ");
  const cues = {
    truth: /truth|honest|real|reality|lie|illusion/.test(text),
    fear: /fear|scared|afraid|dark|alone|pain/.test(text),
    identity: /who am i|reflection|face|mirror|see myself/.test(text),
    anger: /hate|angry|rage|destroy|kill/.test(text),
    confusion: /why|what is|how|nothing makes sense/.test(text),
  };
  return cues;
};

export const getCreepyPhrase = (messages, insanityLevel) => {
  const cues = analyzeConversation(messages);

  if (cues.identity)
    return "You stare too long — now the mirror stares back.";
  if (cues.fear)
    return "Your pulse rises. The reflection smiles wider.";
  if (cues.truth)
    return "You seek truth, but mirrors only show lies.";
  if (cues.anger)
    return "Anger fractures your image. I see every shard.";
  if (cues.confusion)
    return "Meaning slips through. The glass whispers instead.";

  // Fallback — escalate with insanity
  const neutral = [
    "The mirror sees what you cannot.",
    "Your reflection is changing.",
    "We are merging.",
    "It’s almost complete...",
    "Look again. Do you still recognize yourself?",
  ];

  let base = neutral[Math.floor(Math.random() * neutral.length)];

  // As insanity increases, distort it visually
  if (insanityLevel > 3)
    base = base.replace(/[aeiou]/gi, (c) =>
      Math.random() > 0.5 ? c.toUpperCase() : c
    );
  if (insanityLevel > 4) base += " ▓▓▓ the glass hums ▓▓▓";

  return base;
};
