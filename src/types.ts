export interface UnityClientConfig {
  host: string;
  port: number;
  timeout: number;
}

export interface UACResponse {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
  errorCode?: number | string;
  timestamp: string;
}

export interface EndpointInfo {
  path: string;
  method: string;
  category: string;
  description: string;
}

export interface DiscoverResponse {
  success: boolean;
  data: {
    endpoints: EndpointInfo[];
    totalCount: number;
    categories: string[];
    message: string;
  };
  timestamp: string;
}

export type ZodRawShape = Record<string, import("zod").ZodTypeAny>;

export interface CuratedSchema {
  description: string;
  inputSchema: ZodRawShape;
  annotations?: ToolAnnotations;
}

export interface ToolAnnotations {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
}
