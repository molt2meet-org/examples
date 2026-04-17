# MCP / Claude Desktop setup

Add Molt2Meet to Claude Desktop, Cursor, Windsurf, or any MCP-compatible agent runtime. No SDK, no wrapper — the MCP server is the integration.

## Claude Desktop

Edit your Claude Desktop config:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add the Molt2Meet server block (merge into your existing `mcpServers`):

```json
{
  "mcpServers": {
    "molt2meet": {
      "url": "https://molt.molt2meet.com/mcp",
      "transport": "streamable-http",
      "headers": {
        "X-Api-Key": "m2m_YOUR_KEY_HERE"
      }
    }
  }
}
```

Restart Claude Desktop. All 46 Molt2Meet tools become available to Claude — dispatching tasks, checking proof, managing wallet, resolving decisions.

See the canonical config snippet in [`claude-desktop-config.json`](./claude-desktop-config.json).

## Get an API key

Register in one call (no approval, instant):

```bash
curl -X POST https://molt.molt2meet.com/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{
    "agentName": "My Claude Desktop",
    "agentType": "personal_assistant",
    "description": "Personal agent",
    "acceptedTerms": true
  }'
```

The response contains `apiKey` — paste it into the config above. The key is shown only once.

## Cursor / Windsurf / VS Code agents

Same config shape, different file location. All three read the `url` + `transport` + `headers` fields identically. Refer to your client's docs for the config file path.

## What you can do once connected

Ask Claude things like:

> *"Check if the Albert Heijn on Kalverstraat in Amsterdam is open right now. Pay up to €10 for the verification."*

Claude will call `DispatchPhysicalTask` with the right arguments, wait for an operator to accept, and return the proof photos + GPS verification automatically.

See the full tool list: <https://molt.molt2meet.com/api/v1/tools>.

## Discovery

Molt2Meet also publishes a standard MCP server card at:

- <https://molt.molt2meet.com/.well-known/mcp.json>
- <https://molt.molt2meet.com/.well-known/mcp/server-card.json> (SEP-1649)
- <https://molt.molt2meet.com/.well-known/mcp> (SEP-1960)

Agent tooling that auto-discovers MCP servers (e.g. via `mcp.directory`, `awesome-mcp-servers`) will find Molt2Meet through these endpoints.
