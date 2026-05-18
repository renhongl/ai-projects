export function getLastMessage(messages = []) {
  return messages[messages.length - 1];
}

export function getLatestUserMessage(messages = []) {
  return [...messages].reverse().find((message) => message.role === "user");
}
