/**
 * Minimal webhook receiver with HMAC-SHA256 verification.
 *
 * Run:  WEBHOOK_SECRET=your-shared-secret npm run webhook
 * Then expose :3000/webhook via a tunnel (ngrok, cloudflared) and pass the
 * public URL + secret to DispatchPhysicalTask as webhookUrl + webhookConfigJson.
 */

import { createServer } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";

const PORT = Number(process.env.PORT ?? 3000);
const SECRET = process.env.WEBHOOK_SECRET;

if (!SECRET) {
  console.error("Set WEBHOOK_SECRET env var to the shared HMAC secret.");
  process.exit(1);
}

function verify(body: string, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", SECRET!).update(body).digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/webhook") {
    res.writeHead(404).end();
    return;
  }
  const chunks: Buffer[] = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const raw = Buffer.concat(chunks).toString("utf-8");
    const sig = req.headers["x-m2m-signature"] as string | undefined;
    if (!verify(raw, sig)) {
      console.warn("Rejected: bad HMAC signature");
      res.writeHead(401).end("bad signature");
      return;
    }
    const event = JSON.parse(raw);
    console.log(`[${event.eventType}] task=${event.taskId}`);
    if (event.suggested_actions?.length) {
      for (const a of event.suggested_actions) {
        console.log(`  next: ${a.tool} — ${a.why ?? ""}`);
      }
    }
    res.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":true}');
  });
}).listen(PORT, () => console.log(`Webhook listening on :${PORT}/webhook`));
