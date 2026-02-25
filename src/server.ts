import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UnityClient } from "./unity-client.js";
import { discoverAndRegisterTools } from "./discovery.js";

/**
 * Create and configure the MCP server with all UAC tools registered.
 */
export async function createServer(): Promise<McpServer> {
  const server = new McpServer(
    {
      name: "uac-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: { listChanged: true },
      },
    }
  );

  const client = new UnityClient({
    host: process.env.UAC_HOST || "localhost",
    port: parseInt(process.env.UAC_PORT || "7777", 10),
    timeout: parseInt(process.env.UAC_TIMEOUT || "10000", 10),
  });

  await discoverAndRegisterTools(server, client);

  return server;
}
