import { readFileSync } from "node:fs";

const BASE = "https://molt.molt2meet.com";
const apiKey = readFileSync("api_key.txt", "utf-8").trim();

const res = await fetch(`${BASE}/api/v1/tools/call`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Api-Key": apiKey,
  },
  body: JSON.stringify({
    tool: "DispatchPhysicalTask",
    arguments: {
      title: "Verify storefront is open",
      description:
        "Visit the address, photograph the storefront including the opening-hours sign. GPS must be within 50m of the task location.",
      locationAddress: "Kalverstraat 1, Amsterdam",
      payoutAmount: 15,
      payoutCurrency: "EUR",
      webhookUrl: process.env.WEBHOOK_URL,
      webhookConfigJson: process.env.WEBHOOK_SECRET
        ? { authType: "hmac", authValue: process.env.WEBHOOK_SECRET }
        : undefined,
    },
  }),
});

const body = await res.json();
console.log(JSON.stringify(body, null, 2));

if (body.status === "Draft" && body.nextActions?.length) {
  console.log("\nWallet empty. Follow nextActions to fund and publish:");
  for (const step of body.nextActions) {
    console.log(`  -> ${step.tool}: ${step.why ?? ""}`);
  }
}
