import type { VercelRequest, VercelResponse } from "@vercel/node";
import serverless from "serverless-http";
import { createServer } from "../server";

const handler = serverless(createServer());

export default async function apiHandler(req: VercelRequest, res: VercelResponse) {
  try {
    await handler(req, res);
  } catch (error) {
    console.error("[v0] Flutterwave API request failed", {
      method: req.method,
      url: req.url,
      message: error instanceof Error ? error.message : "Unknown server error",
    });

    if (!res.headersSent) {
      res.status(500).json({ error: "Payment service failed while preparing checkout." });
    }
  }
}
