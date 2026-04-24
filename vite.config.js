import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import chatHandler from "./api/chat.js";

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;

      if (raw.length > 1_000_000) {
        reject(new Error("Request body too large"));
      }
    });

    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });

const attachResponseHelpers = (res) => {
  const response = res;

  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };

  response.json = (payload) => {
    if (!response.headersSent) {
      response.setHeader("Content-Type", "application/json; charset=utf-8");
    }

    response.end(JSON.stringify(payload));
    return response;
  };

  return response;
};

const devChatApiPlugin = () => ({
  name: "dev-chat-api-plugin",
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith("/api/chat")) {
        next();
        return;
      }

      if (req.method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
      }

      try {
        req.body = await readRequestBody(req);
        const enhancedRes = attachResponseHelpers(res);
        await chatHandler(req, enhancedRes);

        if (!res.writableEnded) {
          res.end();
        }
      } catch (error) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.end(
          JSON.stringify({
            error: "Failed to process /api/chat in Vite dev middleware.",
            detail: error?.message || "Unknown middleware error",
          }),
        );
      }
    });
  },
});

export default defineConfig({
  plugins: [react(), devChatApiPlugin()],
});
