import { z } from "zod";
import type { CuratedSchema } from "../types.js";

export const selectionSchemas: Record<string, CuratedSchema> = {
  selection_get: {
    description:
      "Get the current editor selection: active GameObject, active object, and all selected objects with their types.",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },

  selection_set: {
    description:
      "Select a GameObject by name in the editor. Optionally add to existing selection.",
    inputSchema: {
      name: z.string().describe("Name of the GameObject to select"),
      addToSelection: z
        .string()
        .default("false")
        .describe("'true' to add to current selection, 'false' to replace"),
    },
  },

  selection_asset: {
    description:
      "Select and ping an asset in the Project window by its path.",
    inputSchema: {
      path: z
        .string()
        .describe("Asset path to select (e.g. Assets/Materials/Wood.mat)"),
    },
  },

  selection_clear: {
    description: "Clear the current editor selection.",
    inputSchema: {},
  },

  selection_focus: {
    description:
      "Focus the Scene View camera on the currently selected GameObject (equivalent to pressing F).",
    inputSchema: {},
  },
};
