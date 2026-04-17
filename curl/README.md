# cURL quickstart

Full Molt2Meet lifecycle from a shell in three commands.

## Requirements

`curl` and `jq`. That's it.

## Run

```bash
chmod +x quickstart.sh
./quickstart.sh register
./quickstart.sh dispatch
./quickstart.sh watch <task-id-from-dispatch-output>
```

Each command is also readable as standalone curl invocations — copy individual blocks from [`quickstart.sh`](./quickstart.sh) for use in CI, n8n HTTP nodes, or Zapier actions.

## Notes

- `jq` is used only for parsing/printing. If you don't have it, pipe the responses to `python -m json.tool` or process raw JSON.
- See the [full tool catalog](https://molt.molt2meet.com/api/v1/tools) for all 46 operations addressable via `POST /api/v1/tools/call`.
