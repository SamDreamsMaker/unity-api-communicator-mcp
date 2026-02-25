import type { CuratedSchema } from "../types.js";
import { gameobjectSchemas } from "./gameobject.js";
import { sceneSchemas } from "./scene.js";
import { assetSchemas } from "./asset.js";
import { materialSchemas } from "./material.js";
import { prefabSchemas } from "./prefab.js";
import { buildSchemas } from "./build.js";
import { consoleSchemas } from "./console.js";
import { selectionSchemas } from "./selection.js";
import { cameraSchemas } from "./camera.js";

/**
 * Registry of all curated tool schemas.
 * Key = MCP tool name, Value = { description, inputSchema, annotations? }
 *
 * Tools in this registry get rich, typed parameters.
 * All other tools discovered from /api/discover get a generic params schema.
 */
export const curatedSchemas: Map<string, CuratedSchema> = new Map(
  Object.entries({
    ...gameobjectSchemas,
    ...sceneSchemas,
    ...assetSchemas,
    ...materialSchemas,
    ...prefabSchemas,
    ...buildSchemas,
    ...consoleSchemas,
    ...selectionSchemas,
    ...cameraSchemas,
  })
);
