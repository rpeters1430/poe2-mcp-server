# poe2-mcp-server

PoE2 AI Companion and MCP studio for experimenting with a Path of Exile 2 advisory workflow.

## What this repository currently is

This repository currently runs a local Express + Vite app that:

- serves a browser UI for inspecting character, inventory, log, and MCP screens
- exposes JSON endpoints for PoE2-style state and MCP tool execution
- can generate a standalone stdio MCP server script from `/api/mcp/code-bundle`
- uses in-memory sample data in the main app for characters, inventory, and logs
- optionally uses Gemini for AI responses when `GEMINI_API_KEY` is configured

Important: the main app is a studio/demo environment. It does **not** currently connect the UI to live Path of Exile 2 memory, and it should never be operated that way.

## Requirements

- Node.js
- npm

## Local setup

```bash
npm install
cp .env.example .env
```

Optional: set `GEMINI_API_KEY` in `.env` if you want Gemini-backed responses. If you do not set it, the app falls back to its local deterministic response logic.

## Run the app

Development:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

Lint / type-check:

```bash
npm run lint
```

## How to operate it

### Studio UI

After starting the app, use the browser UI to:

1. inspect the sample characters and equipment
2. switch the active character
3. simulate log events
4. test MCP tools from the workbench
5. send AI queries through the advisor panel
6. review the safety/compliance guidance shown in the app

### Useful local endpoints

- `GET /api/poe2/characters` - list sample characters
- `GET /api/poe2/inventory` - current sample inventory and equipment
- `GET /api/mcp/tools` - registered MCP tools
- `POST /api/mcp/execute` - execute an MCP tool
- `GET /api/codex/protocol-spec` - allowed vs blocked action classes
- `GET /api/codex/telemetry` - current telemetry snapshot
- `POST /api/codex/dispatch` - run the advisory dispatch flow
- `GET /api/mcp/code-bundle` - download the standalone MCP server script

### Standalone MCP script

The generated script is intended for stdio MCP clients such as Codex CLI or Claude Desktop.

Typical flow:

1. run the app locally
2. download the generated script from `/api/mcp/code-bundle`
3. point your MCP client at that script
4. keep usage advisory-only

## GGG ToS / Fair Play safety

This project should only be operated in a way that stays on the safe side of Grinding Gear Games fair-play rules.

### Safe operating rules

Use this project only for:

- reading log data from `Client.txt`
- reading official GGG APIs or user-exported data
- external overlays, desktop notifications, or audio callouts
- clipboard preparation for a **single** manual player action
- stash regex generation and general build advice

Do **not** use this project for:

- reading or writing game process memory
- `OpenProcess`, `ReadProcessMemory`, DLL injection, or hooks
- simulated keystrokes, mouse input, or input broadcasting
- auto-flask logic, combat rotations, auto-dodge, or botting
- unattended gameplay or macro loops

### Practical rule of thumb

If the tool would cause an in-game action without a direct human input for that exact action, do not use it.

### What to keep true if you extend this repo

If you add live integrations later, keep them limited to:

- local file reads such as `Client.txt`
- official GGG endpoints
- user-provided clipboard/export/import flows
- advisory output rendered outside the game client

If a feature needs memory access, input injection, or automation to work, it should not be added.

### Compliance note

This repository includes language and UI intended to enforce an advisory-only model, but you are still responsible for how you run or extend it. Re-check the current GGG Terms of Use and Fair Play policy before using any live game integration.

## Repository commands

```bash
npm run dev
npm run build
npm start
npm run lint
```
