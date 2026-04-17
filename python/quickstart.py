"""Molt2Meet Python quickstart.

Register an agent, dispatch a real-world task, and poll for completion.

Usage:
    python quickstart.py --register
    python quickstart.py --dispatch --title "..." --address "..." --amount 15 --currency EUR
    python quickstart.py --watch <task-id>
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

import httpx

BASE = "https://molt.molt2meet.com"
KEY_FILE = Path("api_key.txt")


def save_key(key: str) -> None:
    KEY_FILE.write_text(key, encoding="utf-8")
    print(f"Saved API key to {KEY_FILE}")


def load_key() -> str:
    if not KEY_FILE.exists():
        sys.exit(f"No API key at {KEY_FILE}. Run with --register first.")
    return KEY_FILE.read_text(encoding="utf-8").strip()


def register(agent_name: str, description: str) -> None:
    r = httpx.post(
        f"{BASE}/api/v1/agents/register",
        json={
            "agentName": agent_name,
            "agentType": "personal_assistant",
            "description": description,
            "acceptedTerms": True,
        },
        timeout=30,
    )
    r.raise_for_status()
    body = r.json()
    save_key(body["apiKey"])
    print(json.dumps({"agentId": body.get("agentId"), "agentName": agent_name}, indent=2))


def tool_call(api_key: str, tool: str, arguments: dict) -> dict:
    r = httpx.post(
        f"{BASE}/api/v1/tools/call",
        headers={"X-Api-Key": api_key, "Content-Type": "application/json"},
        json={"tool": tool, "arguments": arguments},
        timeout=60,
    )
    r.raise_for_status()
    return r.json()


def dispatch(title: str, address: str, amount: float, currency: str) -> None:
    api_key = load_key()
    result = tool_call(api_key, "DispatchPhysicalTask", {
        "title": title,
        "description": f"{title} — verify on location, upload photo and GPS.",
        "locationAddress": address,
        "payoutAmount": amount,
        "payoutCurrency": currency,
    })
    print(json.dumps(result, indent=2))
    # If wallet is empty, follow the nextActions array to fund + publish
    if result.get("status") == "Draft" and result.get("nextActions"):
        print("\nWallet is empty. Follow nextActions to fund and publish:")
        for step in result["nextActions"]:
            print(f"  -> {step.get('tool')}: {step.get('why', '')}")


def watch(task_id: str) -> None:
    api_key = load_key()
    last_seq = 0
    print(f"Polling task {task_id}... (Ctrl+C to stop)")
    while True:
        events = tool_call(api_key, "GetTaskEvents", {
            "taskId": task_id,
            "after": last_seq,
        })
        for ev in events.get("events", []):
            print(f"[seq {ev['sequence']}] {ev['eventType']} @ {ev.get('occurredAt')}")
            last_seq = max(last_seq, ev["sequence"])
            if ev["eventType"] in ("task.completed", "task.settled", "task.closed"):
                print("\nTerminal state reached. Fetching proofs...")
                proofs = tool_call(api_key, "GetTaskProofs", {"taskId": task_id})
                print(json.dumps(proofs, indent=2))
                return
        time.sleep(10)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--register", action="store_true")
    p.add_argument("--dispatch", action="store_true")
    p.add_argument("--watch", metavar="TASK_ID")
    p.add_argument("--title", default="Verify store opening hours")
    p.add_argument("--address", default="Kalverstraat 1, Amsterdam")
    p.add_argument("--amount", type=float, default=15)
    p.add_argument("--currency", default="EUR")
    p.add_argument("--agent-name", default="Python Quickstart Agent")
    p.add_argument("--agent-description", default="Demo agent from the Molt2Meet examples repo.")
    args = p.parse_args()

    if args.register:
        register(args.agent_name, args.agent_description)
    elif args.dispatch:
        dispatch(args.title, args.address, args.amount, args.currency)
    elif args.watch:
        watch(args.watch)
    else:
        p.print_help()


if __name__ == "__main__":
    main()
