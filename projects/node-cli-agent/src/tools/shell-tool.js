import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export function createShellTool(config) {
  return {
    name: "shell",
    definition: {
      name: "shell",
      description: "Run a shell command and return the output.",
      inputSchema: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description: "The shell command to execute."
          }
        },
        required: ["command"]
      }
    },
    async execute(input) {
      if (!config.allowShell) {
        return [
          "Shell tool is disabled.",
          "Set ALLOW_SHELL=true in your .env if you want the CLI to execute real commands."
        ].join("\n");
      }

      const shell = process.platform === "win32" ? "powershell.exe" : true;
      const command =
        process.platform === "win32"
          ? `${input.command}`
          : `${input.command}`;

      const { stdout, stderr } = await execAsync(command, {
        shell,
        windowsHide: true
      });

      const output = [stdout.trim(), stderr.trim()].filter(Boolean).join("\n");
      return output || "(command completed with no output)";
    }
  };
}
