import { writeFileSync } from "node:fs";

const BASE = "https://molt.molt2meet.com";

const res = await fetch(`${BASE}/api/v1/agents/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    agentName: "TypeScript Quickstart Agent",
    agentType: "personal_assistant",
    description: "Demo agent from the Molt2Meet examples repo.",
    acceptedTerms: true,
  }),
});

if (!res.ok) {
  console.error(`Registration failed: ${res.status}`, await res.text());
  process.exit(1);
}

const body = (await res.json()) as { apiKey: string; agentId: number };
writeFileSync("api_key.txt", body.apiKey, "utf-8");
console.log(`Registered agent ${body.agentId}. API key saved to api_key.txt.`);
