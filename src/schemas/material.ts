import { z } from "zod";
import type { CuratedSchema } from "../types.js";

export const materialSchemas: Record<string, CuratedSchema> = {
  material_color: {
    description:
      "Set a color property on a material. Default property is '_Color' (main color). Color values are 0-1 floats.",
    inputSchema: {
      materialPath: z
        .string()
        .describe("Asset path to the material (e.g. Assets/Materials/Wood.mat)"),
      propertyName: z
        .string()
        .default("_Color")
        .describe("Shader property name (default: '_Color')"),
      r: z.number().min(0).max(1).default(1).describe("Red (0-1)"),
      g: z.number().min(0).max(1).default(1).describe("Green (0-1)"),
      b: z.number().min(0).max(1).default(1).describe("Blue (0-1)"),
      a: z.number().min(0).max(1).default(1).describe("Alpha (0-1)"),
    },
    annotations: { idempotentHint: true },
  },

  material_float: {
    description:
      "Set a float property on a material (e.g. _Metallic, _Smoothness, _Glossiness).",
    inputSchema: {
      materialPath: z.string().describe("Asset path to the material"),
      propertyName: z
        .string()
        .describe("Shader property name (e.g. _Metallic, _Smoothness)"),
      value: z.number().describe("Float value to set"),
    },
    annotations: { idempotentHint: true },
  },

  material_texture: {
    description:
      "Set a texture on a material. Default property is '_MainTex' (albedo/diffuse).",
    inputSchema: {
      materialPath: z.string().describe("Asset path to the material"),
      texturePath: z
        .string()
        .optional()
        .describe("Asset path to the texture (omit to clear)"),
      propertyName: z
        .string()
        .default("_MainTex")
        .describe("Shader property name (default: '_MainTex')"),
    },
    annotations: { idempotentHint: true },
  },

  material_shader: {
    description:
      "Change the shader of a material (e.g. 'Standard', 'Universal Render Pipeline/Lit').",
    inputSchema: {
      materialPath: z.string().describe("Asset path to the material"),
      shaderName: z
        .string()
        .describe(
          "Shader name (e.g. 'Standard', 'Universal Render Pipeline/Lit', 'Unlit/Color')"
        ),
    },
    annotations: { idempotentHint: true },
  },

  material_properties: {
    description:
      "List all shader properties of a material with their current values, types, and names.",
    inputSchema: {
      materialPath: z.string().describe("Asset path to the material"),
    },
    annotations: { readOnlyHint: true },
  },
};
