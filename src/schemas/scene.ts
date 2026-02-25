import { z } from "zod";
import type { CuratedSchema } from "../types.js";

export const sceneSchemas: Record<string, CuratedSchema> = {
  scene_active: {
    description:
      "Get information about the currently active scene: name, path, build index, dirty state, root object count.",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },

  scene_create: {
    description:
      "Create a new empty scene. Mode 'Single' replaces current scene, 'Additive' adds alongside existing scenes.",
    inputSchema: {
      name: z.string().optional().describe("Scene name (default: 'New Scene')"),
      mode: z
        .enum(["Single", "Additive"])
        .default("Single")
        .describe("Single replaces current scene, Additive loads alongside"),
    },
  },

  scene_open: {
    description:
      "Open/load an existing scene by its asset path (e.g. 'Assets/Scenes/Main.unity').",
    inputSchema: {
      path: z.string().describe("Scene asset path (e.g. Assets/Scenes/Main.unity)"),
      mode: z
        .enum(["Single", "Additive"])
        .default("Single")
        .describe("Single replaces current scene, Additive loads alongside"),
    },
  },

  scene_save: {
    description:
      "Save the active scene. Optionally specify a new path to 'Save As'.",
    inputSchema: {
      path: z
        .string()
        .optional()
        .describe("Path to save to (omit to save in place). E.g. Assets/Scenes/Level1.unity"),
    },
  },

  scene_close: {
    description: "Close a scene. Optionally save before closing.",
    inputSchema: {
      path: z
        .string()
        .optional()
        .describe("Scene path to close (omit for active scene)"),
      save: z
        .string()
        .default("true")
        .describe("'true' to save before closing, 'false' to discard changes"),
    },
  },

  scene_loaded: {
    description:
      "List all currently loaded scenes with their name, path, dirty state, and which is active.",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },

  scene_setactive: {
    description: "Set a loaded scene as the active scene.",
    inputSchema: {
      path: z.string().describe("Path of the loaded scene to set as active"),
    },
  },
};
