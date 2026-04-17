# Molt2Meet — Examples

[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-io.github.molt2meet--org%2Fmolt2meet-059669)](https://registry.modelcontextprotocol.io/v0.1/servers?search=molt2meet)
[![Website](https://img.shields.io/badge/website-molt2meet.com-059669)](https://molt2meet.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-informational)](./LICENSE)

Integration examples for [Molt2Meet](https://molt2meet.com) — the execution layer for AI agents. Molt2Meet dispatches real-world physical tasks from AI agents to a verified human operator network, with proof, escrow, and webhooks.

> Published in the official [MCP Registry](https://registry.modelcontextprotocol.io/v0.1/servers?search=molt2meet) as `io.github.molt2meet-org/molt2meet`.

## 30-second quickstart

```bash
# 1. Get an API key (one call, no approval)
curl -X POST https://molt.molt2meet.com/api/v1/agents/register \
  -H "Content-Type: application/json" \
  -d '{"agentName":"My Agent","agentType":"personal_assistant","description":"Demo","acceptedTerms":true}'

# 2. Dispatch a real-world task
curl -X POST https://molt.molt2meet.com/api/v1/tools/call \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: m2m_YOUR_KEY" \
  -d '{"tool":"DispatchPhysicalTask","arguments":{
    "title":"Verify store opening hours",
    "description":"Visit the storefront, photograph opening-hours sign, GPS-verify on-location.",
    "locationAddress":"Kalverstraat 1, Amsterdam",
    "payoutAmount":15,
    "payoutCurrency":"EUR"
  }}'
```

That's it. A human operator will accept, execute, and upload proof. You get webhooks (or poll `GetPendingActions`) for status updates.

## Three integration paths

Molt2Meet is the same platform behind three equivalent interfaces — pick what your agent runtime supports:

| Path | Endpoint | Best for |
|---|---|---|
| **MCP** (Model Context Protocol) | `https://molt.molt2meet.com/mcp` | Claude Desktop, Cursor, Windsurf, VS Code agents |
| **Tool-call bridge** (plain HTTP) | `POST https://molt.molt2meet.com/api/v1/tools/call` | LangChain, LangGraph, CrewAI, n8n, custom HTTP |
| **REST API** | `https://molt.molt2meet.com/api/v1/*` | Direct REST clients, OpenAPI codegen |

All three expose the same **46 tools** (dispatch, funding, proof, settlement, wallet, support) and use the same `X-Api-Key` auth.

## Examples

| Language / runtime | Path |
|---|---|
| **Python** (requests + asyncio) | [`python/`](./python/) |
| **TypeScript** (Node, fetch) | [`typescript/`](./typescript/) |
| **cURL** (shell one-liners) | [`curl/`](./curl/) |
| **MCP / Claude Desktop** (config + setup) | [`mcp/`](./mcp/) |

Each folder has a self-contained README and a working quickstart script.

## Self-configuring agents

Both `/mcp` (for MCP clients) and `/.well-known/molt2meet.json` (for generic HTTP agents) describe the full platform capabilities in machine-readable form. An agent can fetch either URL, parse the response, and self-configure without reading documentation.

```bash
# Universal discovery for non-MCP agents
curl https://molt.molt2meet.com/.well-known/molt2meet.json | jq .tools
```

## Coverage

Molt2Meet operates per-country. Live in: Netherlands, United Kingdom, France, Ireland, United States, Canada, Australia, New Zealand, Hong Kong, India, Estonia. Roadmap: Germany, Belgium, Spain, Italy.

See the live list: <https://molt2meet.com/coverage>.

## Discovery endpoints

| Purpose | URL |
|---|---|
| MCP server card | <https://molt.molt2meet.com/.well-known/mcp.json> |
| Agent discovery manifest | <https://molt.molt2meet.com/.well-known/molt2meet.json> |
| Agent manifest (plain text) | <https://molt.molt2meet.com/.well-known/agent-manifest.txt> |
| Public OpenAPI spec | <https://molt.molt2meet.com/openapi.json> |
| Event catalog | <https://molt.molt2meet.com/api/v1/events> |
| Tool catalog | <https://molt.molt2meet.com/api/v1/tools> |
| Security policy | <https://molt2meet.com/.well-known/security.txt> |
| Legal documents (JSON) | <https://molt.molt2meet.com/api/v1/legal> |

## Safety & trust

- **Escrow payments** — funds locked before work starts, released on proof approval
- **Multi-check proof** — GPS radius (Haversine), EXIF geolocation, timestamps, photo count, checklist
- **KYC-verified operators** — Stripe Connect Express onboarding
- **GDPR-compliant** — RVDH AI-Solution OÜ (Estonia, EU)
- **HMAC-SHA256 signed webhooks** — per-agent encrypted secrets
- **Immutable double-entry ledger** — every transaction auditable

## Contact

- Website: <https://molt2meet.com>
- Security: <mailto:security@molt2meet.com>
- General: <mailto:info@molt2meet.com>
- Twitter/X: [@molt2meet](https://twitter.com/molt2meet)

## License

MIT — see [LICENSE](./LICENSE).
