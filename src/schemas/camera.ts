import { z } from "zod";
import type { CuratedSchema } from "../types.js";

export const cameraSchemas: Record<string, CuratedSchema> = {
  camera_create: {
    description:
      "Create a new Camera GameObject in the scene with optional position, FOV, and orthographic mode.",
    inputSchema: {
      name: z.string().default("New Camera").describe("Camera name"),
      x: z.number().optional().describe("X position"),
      y: z.number().optional().describe("Y position"),
      z: z.number().optional().describe("Z position"),
      fov: z.number().optional().describe("Field of view in degrees (default: 60)"),
      orthographic: z
        .string()
        .optional()
        .describe("'true' for orthographic camera"),
    },
  },

  camera_configure: {
    description:
      "Configure an existing camera's properties: FOV, clip planes, orthographic mode, background color, depth.",
    inputSchema: {
      name: z.string().describe("Name of the camera GameObject"),
      fov: z.number().optional().describe("Field of view in degrees"),
      nearClip: z.number().optional().describe("Near clip plane distance"),
      farClip: z.number().optional().describe("Far clip plane distance"),
      orthographic: z.string().optional().describe("'true' or 'false'"),
      orthographicSize: z.number().optional().describe("Orthographic camera size"),
      depth: z.number().optional().describe("Camera render depth/priority"),
    },
    annotations: { idempotentHint: true },
  },

  camera_list: {
    description:
      "List all cameras in the scene with their settings (FOV, orthographic, depth, clip planes).",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },

  camera_screenshot: {
    description: "Take a screenshot using ScreenCapture.",
    inputSchema: {
      path: z
        .string()
        .default("Assets/Screenshot.png")
        .describe("Output file path"),
    },
  },

  camera_capture: {
    description:
      "Capture what a specific camera sees using RenderTexture. Higher quality than screenshot. Falls back to main camera if not specified.",
    inputSchema: {
      name: z
        .string()
        .optional()
        .describe("Camera name (falls back to Main Camera)"),
      path: z
        .string()
        .default("Assets/CameraCapture.png")
        .describe("Output PNG file path"),
      width: z.number().default(1280).describe("Image width in pixels"),
      height: z.number().default(720).describe("Image height in pixels"),
    },
  },
};
