import type { EndpointInfo } from "./types.js";

/**
 * Convert a REST API path to an MCP tool name.
 * /api/gameobject/create      → gameobject_create
 * /api/gameobject/findByTag   → gameobject_find_by_tag
 * /api/terrain/height/set     → terrain_height_set
 * /api/component/light/set    → component_light_set
 * /api/assets/list            → assets_list
 */
export function toToolName(path: string, _method: string): string {
  return path
    .replace(/^\/api\//, "")
    .replace(/\/$/, "")
    // Convert camelCase segments to snake_case
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    // Replace slashes with underscores
    .replace(/\//g, "_")
    // Clean up any double underscores
    .replace(/_+/g, "_")
    // Remove path parameter placeholders like {tag}
    .replace(/\{[^}]+\}/g, "")
    .replace(/_+$/, "");
}

/**
 * Generate a human-readable description for an endpoint.
 * Enriches the auto-generated descriptions from UAC with more context.
 */
export function toDescription(endpoint: EndpointInfo): string {
  const { path, method, category, description } = endpoint;

  // Build a richer description
  const parts: string[] = [];

  // Add the original description
  parts.push(description);

  // Add method context
  if (method === "GET") {
    parts.push("(read-only, no parameters required)");
  } else {
    parts.push(`(${method} ${path})`);
  }

  // Add category context
  parts.push(`[Category: ${category}]`);

  return parts.join(" ");
}
