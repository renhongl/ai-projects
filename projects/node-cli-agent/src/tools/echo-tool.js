export function createEchoTool() {
  return {
    name: "echo",
    definition: {
      name: "echo",
      description: "Echo text back to the agent.",
      inputSchema: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "The text to echo."
          }
        },
        required: ["text"]
      }
    },
    async execute(input) {
      return input.text;
    }
  };
}
