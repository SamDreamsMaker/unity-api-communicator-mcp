# uac-mcp-server

MCP (Model Context Protocol) server that bridges AI agents to **Unity Editor** via the [Unity API Communicator](https://unity-api-communicator.com) plugin.

Control Unity Editor from any MCP-compatible AI client — Claude, Cursor, Windsurf, VS Code Copilot, and more.

## Features

- **200+ tools** auto-discovered from Unity API Communicator endpoints
- **54 curated schemas** with typed parameters for core operations (GameObjects, Scenes, Assets, Materials, Prefabs, Build, Console, Camera, Selection)
- **Zero config** — just install and connect
- **Universal** — works with any MCP client via stdio transport

## Prerequisites

1. **Unity API Communicator plugin** — install it from [unity-api-communicator.com](https://unity-api-communicator.com) into your Unity project, then open the Unity Editor. The plugin starts an HTTP server on `localhost:7777` automatically.
2. **Node.js** >= 18

> **This MCP server is a bridge — it requires Unity API Communicator to be installed and Unity Editor to be open.** Without it, the MCP server starts and tools are listed, but every tool call returns a connection error.

## Installation

### Claude Code

```bash
claude mcp add --transport stdio unity -- npx -y uac-mcp-server
```

### Claude Desktop

Add to your config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "unity": {
      "command": "npx",
      "args": ["-y", "uac-mcp-server"]
    }
  }
}
```

### Cursor

Go to **Settings > MCP Servers > Add new MCP Server**, then:
- Name: `unity`
- Type: `command`
- Command: `npx -y uac-mcp-server`

Or add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "unity": {
      "command": "npx",
      "args": ["-y", "uac-mcp-server"]
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "unity": {
      "command": "npx",
      "args": ["-y", "uac-mcp-server"]
    }
  }
}
```

### VS Code (GitHub Copilot)

Add to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "unity": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "uac-mcp-server"]
    }
  }
}
```

### Any MCP Client

The server uses **stdio transport**. Launch it as a subprocess:

```bash
npx -y uac-mcp-server
```

It reads JSON-RPC 2.0 messages from stdin and writes responses to stdout, following the [MCP specification](https://modelcontextprotocol.io).

## Configuration

| Environment Variable | Default     | Description                      |
|---------------------|-------------|----------------------------------|
| `UAC_HOST`          | `localhost` | Unity API Communicator host      |
| `UAC_PORT`          | `7777`      | Unity API Communicator port      |
| `UAC_TIMEOUT`       | `10000`     | Request timeout in milliseconds  |

Pass environment variables via your MCP client config:

```json
{
  "mcpServers": {
    "unity": {
      "command": "npx",
      "args": ["-y", "uac-mcp-server"],
      "env": {
        "UAC_HOST": "localhost",
        "UAC_PORT": "7777"
      }
    }
  }
}
```

## Available Tools

### Curated (typed parameters)

| Category    | Tools                                                              |
|-------------|-------------------------------------------------------------------|
| GameObject  | create, delete, transform, list, clone, active, tag, layer, find_by_tag, component_add, component_remove |
| Scene       | active, create, open, save, close, loaded, setactive              |
| Asset       | create, delete, rename, move, list                                |
| Material    | color, float, texture, shader, properties                         |
| Prefab      | create, instantiate, apply, unpack                                |
| Build       | settings, player_settings, switch_platform, start, platforms      |
| Console     | log, clear, logs, start, stop, errors, compilation                |
| Selection   | get, set, asset, clear, focus                                     |
| Camera      | create, configure, list, screenshot, capture                      |

### Auto-discovered

All additional endpoints from the UAC plugin (Animation, Terrain, Physics, UI, Lights, Navigation, Addressables, Timeline, etc.) are automatically registered with generic parameter schemas. The AI agent uses tool descriptions to determine the correct parameters.

## How It Works

```
AI Client (Claude, Cursor, Copilot, ...)
    │
    │  MCP (stdio, JSON-RPC 2.0)
    ▼
┌──────────────────────────┐
│  uac-mcp-server          │
│  (bridge MCP → HTTP)     │
└───────────┬──────────────┘
            │  HTTP REST (localhost:7777)
            ▼
┌──────────────────────────┐
│  Unity Editor + UAC      │
│  Plugin (200+ endpoints) │
└──────────────────────────┘
```

On startup, the server calls `/api/discover` on the UAC plugin to dynamically register all available endpoints as MCP tools. If Unity is not running, it falls back to a built-in static catalog of core tools.

## Development

```bash
git clone <repo>
cd mcp-server
npm install
npm run build
```

Test locally:

```bash
node dist/index.js
```

## Troubleshooting

**`Connection refused` / tool calls return errors**
Unity Editor is not open, or UAC is not running. Open your Unity project — the plugin starts automatically.

**`UAC_PORT` mismatch**
If you changed the UAC port in the plugin settings, pass the matching value:
```json
"env": { "UAC_PORT": "8888" }
```

**Tools not showing up**
The server calls `/api/discover` on startup. If Unity starts after the MCP client, restart the MCP server (or the AI client) so it can re-discover tools.

## License

MIT
