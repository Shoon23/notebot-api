interface Message {
  role: string;
  parts: {
    text: string;
  }[];
}

export interface iGenQuizzes {
  raw_text: string;
}
export function interleaveUserContent(
  messages: iGenQuizzes[],
  content: string
): Message[] {
  const result: Message[] = [];

  // Loop through each message and insert a user content message before it.
  for (const message of messages) {
    // Create a new user message for the given content.
    result.push({
      role: "user",
      parts: [{ text: content }],
    });
    // Then add the original message.
    result.push({
      role: "model",
      parts: [{ text: message.raw_text }],
    });
  }

  // If you also want to add the content at the very start when the list is empty,
  // you can uncomment the following block:
  // if (messages.length === 0) {
  //   result.push({
  //     role: "user",
  //     parts: [{ text: content }],
  //   });
  // }

  return result;
}
