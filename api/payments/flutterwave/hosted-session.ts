import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createServer } from "../../../server/index.js";

let app: ReturnType<typeof createServer>;

try {
  app = createServer();
} catch (error) {
  console.error("[v0] Hosted session API initialization failed", {
    message: error instanceof Error ? error.message : "Unknown initialization error",
  });
}

export default function hostedSessionHandler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!app) {
      return res.status(500).json({ error: "Payment service is unavailable." });
    }

    return app(req, res);
  } catch (error) {
    console.error("[v0] Hosted session API failed", {
      method: req.method,
      url: req.url,
      message: error instanceof Error ? error.message : "Unknown server error",
    });

    if (!res.headersSent) {
      return res.status(500).json({ error: "Payment service failed while preparing checkout." });
    }
  }
}
