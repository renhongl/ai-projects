import fs from "node:fs";
import path from "node:path";

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);
  const values = {};

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex < 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    values[key] = value;
  }

  return values;
}

export function loadConfig() {
  const envPath = path.resolve(process.cwd(), ".env");
  const localEnv = parseEnvFile(envPath);

  return {
    provider: process.env.AGENT_PROVIDER || localEnv.AGENT_PROVIDER || "demo",
    model: process.env.AGENT_MODEL || localEnv.AGENT_MODEL || "demo-loop",
    apiKey: process.env.AGENT_API_KEY || localEnv.AGENT_API_KEY || "",
    baseUrl: process.env.AGENT_BASE_URL || localEnv.AGENT_BASE_URL || "",
    allowShell:
      (process.env.ALLOW_SHELL || localEnv.ALLOW_SHELL || "false").toLowerCase() === "true"
  };
}
