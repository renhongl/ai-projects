# Nest Simple Agent

This is a minimal NestJS project that exposes a tiny "agent" API backed by OpenAI.

## Endpoints

- `GET /`: health and project info
- `POST /agent/chat`: send a message to the agent

## Environment Variables

Create a `.env` file or set these values in PowerShell before starting:

```powershell
$env:OPENAI_API_KEY="your_api_key_here"
$env:OPENAI_MODEL="gpt-5-mini"
```

`gpt-5-mini` is a good low-cost default for this demo. For more demanding coding
or agentic tasks, OpenAI's current model docs describe `gpt-5.2` as the flagship
option, and OpenAI recommends the Responses API for new agent-style integrations.

## Example Request

```http
POST /agent/chat
Content-Type: application/json

{
  "message": "hello agent",
  "userId": "demo",
  "systemPrompt": "You are a helpful coding assistant."
}
```

## Example Response

```json
{
  "role": "assistant",
  "model": "gpt-5-mini",
  "responseId": "resp_123",
  "message": "Hello! How can I help you today?",
  "timestamp": "2026-04-15T00:00:00.000Z"
}
```

## Run

After installing dependencies:

```powershell
pnpm install
$env:OPENAI_API_KEY="your_api_key_here"
pnpm --filter @workspace/nest-simple-agent start:dev
```
