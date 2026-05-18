export function updateMemory(memory, messages) {
  const last = messages[messages.length - 1];

  const text = last.content || "";

  // 简单规则抽取（demo）
  if (text.includes("我叫")) {
    const name = text.replace("我叫", "").trim();
    memory.userName = name;
  }

  if (text.includes("我在")) {
    memory.location = text;
  }

  return memory;
}
