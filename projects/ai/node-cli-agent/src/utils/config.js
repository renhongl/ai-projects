import path from "node:path";
import {
  getFirstDefined,
  parseEnvFile,
  toBoolean,
  toTrimmedString
} from "@workspace/shared-utils";

export function loadConfig() {
  const envPath = path.resolve(process.cwd(), ".env");
  const localEnv = parseEnvFile(envPath);

  return {
    provider: toTrimmedString(getFirstDefined(process.env.AGENT_PROVIDER, localEnv.AGENT_PROVIDER), "demo"),
    model: toTrimmedString(getFirstDefined(process.env.AGENT_MODEL, localEnv.AGENT_MODEL), "demo-loop"),
    apiKey: toTrimmedString(getFirstDefined(process.env.AGENT_API_KEY, localEnv.AGENT_API_KEY), ""),
    baseUrl: toTrimmedString(getFirstDefined(process.env.AGENT_BASE_URL, localEnv.AGENT_BASE_URL), ""),
    allowShell: toBoolean(getFirstDefined(process.env.ALLOW_SHELL, localEnv.ALLOW_SHELL), false)
  };
}
