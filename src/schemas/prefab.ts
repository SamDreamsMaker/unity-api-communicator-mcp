import { z } from "zod";
import type { CuratedSchema } from "../types.js";

export const prefabSchemas: Record<string, CuratedSchema> = {
  prefab_create: {
    description:
      "Create a prefab asset from an existing scene GameObject. The prefab is saved as a .prefab file.",
    inputSchema: {
      name: z
        .string()
        .describe("Name of the scene GameObject to convert to prefab"),
      path: z
        .string()
        .default("Assets")
        .describe("Folder to save the prefab in (default: 'Assets')"),
      prefabName: z
        .string()
        .optional()
        .describe("Custom name for the prefab file (default: same as GameObject)"),
    },
  },

  prefab_instantiate: {
    description:
      "Instantiate a prefab in the current scene. Creates a prefab instance linked to the original asset.",
    inputSchema: {
      prefabPath: z
        .string()
        .describe("Asset path to the prefab (e.g. Assets/Prefabs/Tree.prefab)"),
      name: z.string().optional().describe("Custom name for the instance"),
      x: z.number().default(0).describe("X position"),
      y: z.number().default(0).describe("Y position"),
      z: z.number().default(0).describe("Z position"),
    },
  },

  prefab_apply: {
    description:
      "Apply all overrides from a prefab instance back to the original prefab asset.",
    inputSchema: {
      name: z.string().describe("Name of the prefab instance in the scene"),
    },
  },

  prefab_unpack: {
    description:
      "Unpack a prefab instance, breaking the prefab link. Mode 'OutermostRoot' unpacks the top level, 'Completely' unpacks all nested prefabs.",
    inputSchema: {
      name: z.string().describe("Name of the prefab instance to unpack"),
      mode: z
        .enum(["OutermostRoot", "Completely"])
        .default("OutermostRoot")
        .describe("Unpack depth: OutermostRoot or Completely"),
    },
  },
};
