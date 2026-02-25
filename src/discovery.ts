import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { UnityClient } from "./unity-client.js";
import type { EndpointInfo } from "./types.js";
import { curatedSchemas } from "./schemas/index.js";
import { toToolName, toDescription } from "./tool-naming.js";

/** Fallback static catalog when Unity is not running */
const STATIC_ENDPOINTS: EndpointInfo[] = [
  // Core
  { path: "/api/status", method: "GET", category: "core", description: "Get server status" },
  { path: "/api/project/info", method: "GET", category: "core", description: "Get project info" },
  // GameObject
  { path: "/api/gameobject/create", method: "POST", category: "gameobject", description: "Create gameobject" },
  { path: "/api/gameobject/delete", method: "POST", category: "gameobject", description: "Delete gameobject" },
  { path: "/api/gameobject/transform", method: "POST", category: "gameobject", description: "Transform gameobject" },
  { path: "/api/gameobject/list", method: "GET", category: "gameobject", description: "List gameobjects" },
  { path: "/api/gameobject/clone", method: "POST", category: "gameobject", description: "Clone gameobject" },
  { path: "/api/gameobject/active", method: "POST", category: "gameobject", description: "Set gameobject active" },
  { path: "/api/gameobject/tag", method: "POST", category: "gameobject", description: "Set gameobject tag" },
  { path: "/api/gameobject/layer", method: "POST", category: "gameobject", description: "Set gameobject layer" },
  { path: "/api/gameobject/findByTag", method: "GET", category: "gameobject", description: "Find gameobjects by tag" },
  { path: "/api/gameobject/component/add", method: "POST", category: "gameobject", description: "Add component" },
  { path: "/api/gameobject/component/remove", method: "POST", category: "gameobject", description: "Remove component" },
  { path: "/api/gameobject/components", method: "GET", category: "gameobject", description: "List components" },
  { path: "/api/gameobject/hierarchy", method: "POST", category: "gameobject", description: "Set parent" },
  { path: "/api/gameobject/material", method: "POST", category: "gameobject", description: "Set material" },
  // Scene
  { path: "/api/scene/active", method: "GET", category: "scene", description: "Get active scene" },
  { path: "/api/scene/create", method: "POST", category: "scene", description: "Create scene" },
  { path: "/api/scene/open", method: "POST", category: "scene", description: "Open scene" },
  { path: "/api/scene/save", method: "POST", category: "scene", description: "Save scene" },
  { path: "/api/scene/close", method: "POST", category: "scene", description: "Close scene" },
  { path: "/api/scene/loaded", method: "GET", category: "scene", description: "Get loaded scenes" },
  { path: "/api/scene/setactive", method: "POST", category: "scene", description: "Set active scene" },
  // Asset
  { path: "/api/asset/create", method: "POST", category: "asset", description: "Create asset" },
  { path: "/api/asset/delete", method: "POST", category: "asset", description: "Delete asset" },
  { path: "/api/asset/rename", method: "POST", category: "asset", description: "Rename asset" },
  { path: "/api/asset/move", method: "POST", category: "asset", description: "Move asset" },
  { path: "/api/assets/list", method: "GET", category: "asset", description: "List assets" },
  // Material
  { path: "/api/material/color", method: "POST", category: "material", description: "Set material color" },
  { path: "/api/material/float", method: "POST", category: "material", description: "Set material float" },
  { path: "/api/material/texture", method: "POST", category: "material", description: "Set material texture" },
  { path: "/api/material/shader", method: "POST", category: "material", description: "Set material shader" },
  { path: "/api/material/properties", method: "GET", category: "material", description: "List material properties" },
  // Prefab
  { path: "/api/prefab/create", method: "POST", category: "prefab", description: "Create prefab" },
  { path: "/api/prefab/instantiate", method: "POST", category: "prefab", description: "Instantiate prefab" },
  { path: "/api/prefab/apply", method: "POST", category: "prefab", description: "Apply prefab overrides" },
  { path: "/api/prefab/unpack", method: "POST", category: "prefab", description: "Unpack prefab" },
  // Build
  { path: "/api/build/settings", method: "GET", category: "build", description: "Get build settings" },
  { path: "/api/build/playerSettings", method: "POST", category: "build", description: "Set player settings" },
  { path: "/api/build/switchPlatform", method: "POST", category: "build", description: "Switch platform" },
  { path: "/api/build/start", method: "POST", category: "build", description: "Start build" },
  { path: "/api/build/platforms", method: "GET", category: "build", description: "Get platforms" },
  // Console
  { path: "/api/console/log", method: "POST", category: "console", description: "Log message" },
  { path: "/api/console/clear", method: "POST", category: "console", description: "Clear console" },
  { path: "/api/console/logs", method: "GET", category: "console", description: "Get logs" },
  { path: "/api/console/start", method: "POST", category: "console", description: "Start listening" },
  { path: "/api/console/stop", method: "POST", category: "console", description: "Stop listening" },
  { path: "/api/console/errors", method: "GET", category: "console", description: "Get error counts" },
  { path: "/api/console/compilation", method: "GET", category: "console", description: "Get compilation errors" },
  // Selection
  { path: "/api/selection/get", method: "GET", category: "selection", description: "Get selection" },
  { path: "/api/selection/set", method: "POST", category: "selection", description: "Set selection" },
  { path: "/api/selection/asset", method: "POST", category: "selection", description: "Select asset" },
  { path: "/api/selection/clear", method: "POST", category: "selection", description: "Clear selection" },
  { path: "/api/selection/all", method: "POST", category: "selection", description: "Select all" },
  { path: "/api/selection/focus", method: "POST", category: "selection", description: "Focus selection" },
  // Camera
  { path: "/api/camera/create", method: "POST", category: "camera", description: "Create camera" },
  { path: "/api/camera/configure", method: "POST", category: "camera", description: "Configure camera" },
  { path: "/api/camera/list", method: "GET", category: "camera", description: "List cameras" },
  { path: "/api/camera/screenshot", method: "POST", category: "camera", description: "Take screenshot" },
  { path: "/api/camera/capture", method: "POST", category: "camera", description: "Capture camera view" },
  // Discover
  { path: "/api/discover", method: "GET", category: "discovery", description: "Discover all endpoints" },
  { path: "/api/categories", method: "GET", category: "discovery", description: "List categories" },
];

/**
 * Generic schema for uncurated POST endpoints.
 * The LLM will use the tool description to infer what fields to send.
 */
const genericPostSchema = {
  params: z
    .record(z.unknown())
    .optional()
    .describe(
      "JSON parameters for this endpoint. Refer to the tool description for expected fields."
    ),
};

/**
 * Discover endpoints from UAC and register them as MCP tools.
 * Falls back to a static catalog if Unity is not reachable.
 */
export async function discoverAndRegisterTools(
  server: McpServer,
  client: UnityClient
): Promise<void> {
  let endpoints: EndpointInfo[];

  // Try dynamic discovery from running Unity instance
  const dynamicEndpoints = await client.discover();
  if (dynamicEndpoints.length > 0) {
    endpoints = dynamicEndpoints;
    process.stderr.write(
      `[uac-mcp] Discovered ${endpoints.length} endpoints from Unity\n`
    );
  } else {
    endpoints = STATIC_ENDPOINTS;
    process.stderr.write(
      `[uac-mcp] Unity not reachable — using ${endpoints.length} static endpoints. Tools will return connection errors until Unity is open with UAC installed (https://unity-api-communicator.com)\n`
    );
  }

  const registered = new Set<string>();

  for (const endpoint of endpoints) {
    const toolName = toToolName(endpoint.path, endpoint.method);

    // Skip duplicates (same path different regex matches)
    if (registered.has(toolName)) continue;
    registered.add(toolName);

    const curated = curatedSchemas.get(toolName);

    if (curated && Object.keys(curated.inputSchema).length > 0) {
      // Curated tool with rich typed schema
      server.tool(
        toolName,
        curated.description,
        curated.inputSchema,
        async (params: Record<string, unknown>) => {
          return executeEndpoint(client, endpoint, params);
        }
      );
    } else if (curated) {
      // Curated tool with no params (empty schema)
      server.tool(
        toolName,
        curated.description,
        async () => {
          return executeEndpoint(client, endpoint, {});
        }
      );
    } else if (endpoint.method === "GET") {
      // GET endpoint — no body needed
      server.tool(toolName, toDescription(endpoint), async () => {
        return executeEndpoint(client, endpoint, {});
      });
    } else {
      // Uncurated POST endpoint — generic params schema
      server.tool(
        toolName,
        toDescription(endpoint),
        genericPostSchema,
        async ({ params }: { params?: Record<string, unknown> }) => {
          return executeEndpoint(client, endpoint, params ?? {});
        }
      );
    }
  }

  process.stderr.write(
    `[uac-mcp] Registered ${registered.size} MCP tools (${curatedSchemas.size} curated)\n`
  );
}

/**
 * Execute a UAC endpoint and return an MCP tool result.
 */
async function executeEndpoint(
  client: UnityClient,
  endpoint: EndpointInfo,
  params: Record<string, unknown>
): Promise<{ content: Array<{ type: "text"; text: string }>; isError: boolean }> {
  let path = endpoint.path;

  // Handle GET endpoints that use path params (e.g., /api/gameobject/findByTag)
  if (endpoint.method === "GET" && params) {
    // Build query string from params for GET endpoints
    const queryParams: string[] = [];
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        // Special case: path params embedded in URL
        if (key === "tag" && path.includes("findByTag")) {
          path = `${path}/${encodeURIComponent(String(value))}`;
          continue;
        }
        if (key === "materialPath" && path.includes("material/properties")) {
          path = `${path}/${encodeURIComponent(String(value))}`;
          continue;
        }
        queryParams.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
        );
      }
    }
    if (queryParams.length > 0) {
      path += `?${queryParams.join("&")}`;
    }
  }

  const response =
    endpoint.method === "GET"
      ? await client.get(path)
      : await client.post(endpoint.path, params);

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(response, null, 2),
      },
    ],
    isError: !response.success,
  };
}
