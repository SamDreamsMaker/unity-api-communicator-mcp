import { z } from "zod";
import type { CuratedSchema } from "../types.js";

export const assetSchemas: Record<string, CuratedSchema> = {
  asset_create: {
    description:
      "Create a new asset in the project. Supported types: Material, Script, Shader, ScriptableObject, AnimationClip, AnimatorController, and more.",
    inputSchema: {
      assetType: z
        .string()
        .describe(
          "Type of asset: Material, Script, Shader, ScriptableObject, AnimationClip, AnimatorController, etc."
        ),
      name: z.string().describe("Name of the new asset"),
      template: z
        .string()
        .optional()
        .describe("Template or shader name (e.g. 'Standard' for materials)"),
      destination: z
        .string()
        .optional()
        .describe("Folder path (default: 'Assets'). E.g. Assets/Materials"),
    },
  },

  asset_delete: {
    description: "Delete an asset from the project by its path.",
    inputSchema: {
      path: z.string().describe("Asset path to delete (e.g. Assets/Materials/Wood.mat)"),
    },
    annotations: { destructiveHint: true },
  },

  asset_rename: {
    description: "Rename an asset.",
    inputSchema: {
      currentPath: z
        .string()
        .describe("Current asset path (e.g. Assets/Materials/Old.mat)"),
      newName: z.string().describe("New name for the asset (without extension)"),
    },
  },

  asset_move: {
    description: "Move an asset to a different folder.",
    inputSchema: {
      sourcePath: z
        .string()
        .describe("Current asset path (e.g. Assets/Materials/Wood.mat)"),
      destinationFolder: z
        .string()
        .describe("Target folder (e.g. Assets/NewFolder)"),
    },
  },

  assets_list: {
    description:
      "List assets in the project. Filter by type and/or folder. Returns name, path, and type for each asset.",
    inputSchema: {
      type: z
        .string()
        .optional()
        .describe(
          "Filter by asset type: Material, Texture2D, Prefab, Scene, Script, AudioClip, etc."
        ),
      folder: z
        .string()
        .optional()
        .describe("Folder to search in (default: 'Assets'). E.g. Assets/Materials"),
    },
    annotations: { readOnlyHint: true },
  },
};
