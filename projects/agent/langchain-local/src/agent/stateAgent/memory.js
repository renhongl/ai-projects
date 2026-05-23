export function createEmptyMemory() {
  return {
    userName: null,
    location: null,
  };
}

function normalizeMemory(memory = {}) {
  return {
    userName: memory.userName ?? null,
    location: memory.location ?? memory.localtion ?? null,
  };
}

function getLatestUserText(messages = []) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i];

    if (message?.role !== 'user' || typeof message.content !== 'string') {
      continue;
    }

    return message.content.trim();
  }

  return '';
}

function extractUserName(text) {
  const patterns = [
    /我叫\s*([^\s，。！？,.!?\n]+)/,
    /我的名字是\s*([^\s，。！？,.!?\n]+)/,
    /你可以叫我\s*([^\s，。！？,.!?\n]+)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function extractLocation(text) {
  const patterns = [
    /我现在在\s*([^\s，。！？,.!?\n]+)/,
    /我在\s*([^\s，。！？,.!?\n]+)/,
    /我住在\s*([^\s，。！？,.!?\n]+)/,
    /我目前在\s*([^\s，。！？,.!?\n]+)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

export function updateMemory(memory, messages) {
  const nextMemory = normalizeMemory(memory);
  const latestUserText = getLatestUserText(messages);

  if (!latestUserText) {
    return nextMemory;
  }

  const userName = extractUserName(latestUserText);
  const location = extractLocation(latestUserText);

  if (userName) {
    nextMemory.userName = userName;
  }

  if (location) {
    nextMemory.location = location;
  }

  return nextMemory;
}
