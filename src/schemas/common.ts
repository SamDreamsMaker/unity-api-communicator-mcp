import { z } from "zod";

export const Vector3Schema = z
  .object({
    x: z.number().default(0).describe("X coordinate"),
    y: z.number().default(0).describe("Y coordinate"),
    z: z.number().default(0).describe("Z coordinate"),
  })
  .describe("3D vector (x, y, z)");

export const ColorSchema = z
  .object({
    r: z.number().min(0).max(1).default(1).describe("Red (0-1)"),
    g: z.number().min(0).max(1).default(1).describe("Green (0-1)"),
    b: z.number().min(0).max(1).default(1).describe("Blue (0-1)"),
    a: z.number().min(0).max(1).default(1).describe("Alpha (0-1)"),
  })
  .describe("RGBA color with values from 0 to 1");
