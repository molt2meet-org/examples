#!/usr/bin/env bash
# Molt2Meet cURL quickstart — register + dispatch in 3 commands.
# Usage:  bash quickstart.sh register
#         bash quickstart.sh dispatch
#         bash quickstart.sh watch <task-id>

set -euo pipefail

BASE="https://molt.molt2meet.com"
KEY_FILE="api_key.txt"

case "${1:-help}" in
  register)
    curl -fsS -X POST "$BASE/api/v1/agents/register" \
      -H "Content-Type: application/json" \
      -d '{
        "agentName": "cURL Quickstart Agent",
        "agentType": "personal_assistant",
        "description": "Demo agent from the Molt2Meet examples repo.",
        "acceptedTerms": true
      }' | tee /tmp/m2m_register.json
    jq -r '.apiKey' /tmp/m2m_register.json > "$KEY_FILE"
    echo; echo "API key saved to $KEY_FILE"
    ;;

  dispatch)
    [ -f "$KEY_FILE" ] || { echo "Run 'register' first." >&2; exit 1; }
    KEY=$(cat "$KEY_FILE")
    curl -fsS -X POST "$BASE/api/v1/tools/call" \
      -H "Content-Type: application/json" \
      -H "X-Api-Key: $KEY" \
      -d '{
        "tool": "DispatchPhysicalTask",
        "arguments": {
          "title": "Verify store opening hours",
          "description": "Visit the storefront, photograph the opening-hours sign. GPS must be within 50m.",
          "locationAddress": "Kalverstraat 1, Amsterdam",
          "payoutAmount": 15,
          "payoutCurrency": "EUR"
        }
      }' | jq .
    ;;

  watch)
    TASK_ID="${2:?Usage: watch <task-id>}"
    [ -f "$KEY_FILE" ] || { echo "Run 'register' first." >&2; exit 1; }
    KEY=$(cat "$KEY_FILE")
    LAST=0
    while true; do
      RESP=$(curl -fsS -X POST "$BASE/api/v1/tools/call" \
        -H "Content-Type: application/json" \
        -H "X-Api-Key: $KEY" \
        -d "{\"tool\":\"GetTaskEvents\",\"arguments\":{\"taskId\":\"$TASK_ID\",\"after\":$LAST}}")
      echo "$RESP" | jq -c '.events[] | {seq:.sequence, type:.eventType, at:.occurredAt}'
      LAST=$(echo "$RESP" | jq '[.events[].sequence] | max // '"$LAST")
      if echo "$RESP" | jq -e '.events[] | select(.eventType=="task.completed" or .eventType=="task.settled" or .eventType=="task.closed")' > /dev/null; then
        echo "Terminal state reached."
        break
      fi
      sleep 10
    done
    ;;

  *)
    echo "Usage: $0 {register|dispatch|watch <task-id>}"
    exit 1
    ;;
esac
