import { z } from "zod";
import type { CuratedSchema } from "../types.js";

export const consoleSchemas: Record<string, CuratedSchema> = {
  console_log: {
    description:
      "Log a message to the Unity Console. Supports Log, Warning, and Error types.",
    inputSchema: {
      message: z.string().describe("Message to log"),
      type: z
        .enum(["Log", "Warning", "Error"])
        .default("Log")
        .describe("Log type: Log, Warning, or Error"),
    },
  },

  console_clear: {
    description: "Clear the Unity Console and the internal log buffer.",
    inputSchema: {},
    annotations: { destructiveHint: true },
  },

  console_logs: {
    description:
      "Get captured console logs. Requires console listening to be started first.",
    inputSchema: {
      type: z
        .string()
        .optional()
        .describe("Filter by type: Log, Warning, Error, Exception (omit for all)"),
    },
    annotations: { readOnlyHint: true },
  },

  console_start: {
    description:
      "Start listening to Unity Console messages. Required before console_logs will capture anything.",
    inputSchema: {},
  },

  console_stop: {
    description: "Stop listening to Unity Console messages.",
    inputSchema: {},
  },

  console_errors: {
    description: "Get error and warning counts from the console log buffer.",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },

  console_compilation: {
    description:
      "Get compilation errors and warnings directly from Unity's internal log system (up to 100 entries).",
    inputSchema: {},
    annotations: { readOnlyHint: true },
  },
};
