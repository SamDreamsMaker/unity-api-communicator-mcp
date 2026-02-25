#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";

async function main(): Promise<void> {
  const server = await createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.stderr.write("[uac-mcp] Server started on stdio transport\n");
}

main().catch((err) => {
  process.stderr.write(`[uac-mcp] Fatal error: ${err}\n`);
  process.exit(1);
});
