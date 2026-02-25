import { z } from "zod";
import type { CuratedSchema } from "../types.js";

export const buildSchemas: Record<string, CuratedSchema> = {
  build_settings: {
    description:
      "Get current build settings: active platform, enabled scenes, development mode, player settings (company, product, version).",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },

  build_player_settings: {
    description:
      "Update Player settings. All fields are optional — only provided fields are changed.",
    inputSchema: {
      companyName: z.string().optional().describe("Company name"),
      productName: z.string().optional().describe("Product name"),
      bundleVersion: z.string().optional().describe("Version string (e.g. '1.0.0')"),
      fullscreen: z
        .string()
        .optional()
        .describe("'true' for fullscreen, 'false' for windowed"),
      defaultScreenWidth: z.number().optional().describe("Default screen width in pixels"),
      defaultScreenHeight: z.number().optional().describe("Default screen height in pixels"),
    },
    annotations: { idempotentHint: true },
  },

  build_switch_platform: {
    description:
      "Switch the active build platform. This may take time as Unity reimports assets.",
    inputSchema: {
      platform: z
        .enum(["windows", "windows64", "mac", "osx", "linux", "android", "ios", "webgl"])
        .describe("Target platform"),
    },
  },

  build_start: {
    description:
      "Start a build with the current build settings. Uses enabled scenes from Build Settings. This may take a long time.",
    inputSchema: {
      outputPath: z
        .string()
        .describe(
          "Output path for the build (e.g. 'Build/MyGame.exe' or 'Build/MyGame')"
        ),
    },
  },

  build_platforms: {
    description: "List all available build platforms and the currently active one.",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },
};
