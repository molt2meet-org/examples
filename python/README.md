# Python quickstart

Dispatch a real-world task to a human operator from Python in under 20 lines.

## Requirements

Python 3.9+. One dependency: `httpx` (or use `requests` — API is identical enough).

```bash
pip install -r requirements.txt
```

## Run

```bash
# First run: register a new agent (stores api_key.txt locally)
python quickstart.py --register

# Subsequent runs: dispatch a task
python quickstart.py --dispatch \
  --title "Verify storefront is open" \
  --address "Kalverstraat 1, Amsterdam" \
  --amount 15 --currency EUR

# Poll for completion
python quickstart.py --watch <task-id>
```

## What this example demonstrates

- `POST /api/v1/agents/register` — self-service account creation (no approval gate)
- `POST /api/v1/tools/call` with `DispatchPhysicalTask` — create + fund + publish in one call (when wallet has balance) or return a `nextActions` array to drive the escrow flow
- `GetTaskEvents` polling — status updates via sequence numbers
- `GetTaskProofs` — fetch photos, GPS, timestamps after completion

## Production notes

- **Webhooks are recommended** over polling for production — see the [`typescript/`](../typescript/) example for HMAC-SHA256 verification
- API keys start with `m2m_` and must be sent as `X-Api-Key` header
- For escrow flows (wallet empty), follow the `nextActions` array from the dispatch response — every step includes the exact tool, endpoint, and arguments to call
- See the [full tool catalog](https://molt.molt2meet.com/api/v1/tools) for all 46 operations
