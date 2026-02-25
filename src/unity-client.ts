import type { UnityClientConfig, UACResponse, DiscoverResponse, EndpointInfo } from "./types.js";

const UAC_WEBSITE = "https://unity-api-communicator.com";

/** Short timeout used only for the initial discovery ping at startup. */
const DISCOVERY_TIMEOUT_MS = 3000;

export class UnityClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config: UnityClientConfig) {
    this.baseUrl = `http://${config.host}:${config.port}`;
    this.timeout = config.timeout;
  }

  async get(path: string): Promise<UACResponse> {
    return this.request("GET", path);
  }

  async post(path: string, body?: Record<string, unknown>): Promise<UACResponse> {
    return this.request("POST", path, body);
  }

  async isConnected(): Promise<boolean> {
    try {
      const res = await this.request("GET", "/api/status");
      return res.success;
    } catch {
      return false;
    }
  }

  async discover(): Promise<EndpointInfo[]> {
    try {
      // Use a short timeout for discovery so startup doesn't stall for 10s
      const res = await this.request("GET", "/api/discover", undefined, DISCOVERY_TIMEOUT_MS) as unknown as DiscoverResponse;
      if (res.success && res.data?.endpoints) {
        return res.data.endpoints;
      }
      return [];
    } catch {
      return [];
    }
  }

  private async request(
    method: string,
    path: string,
    body?: Record<string, unknown>,
    timeoutOverride?: number
  ): Promise<UACResponse> {
    const url = `${this.baseUrl}${path}`;
    const timeoutMs = timeoutOverride ?? this.timeout;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const options: RequestInit = {
        method,
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
      };

      if (body && method !== "GET") {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);
      const text = await response.text();

      try {
        return JSON.parse(text) as UACResponse;
      } catch {
        return {
          success: response.ok,
          data: { raw: text },
          timestamp: new Date().toISOString(),
        };
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("abort")) {
        return {
          success: false,
          error: `Unity Editor is not reachable (timeout after ${timeoutMs}ms). Make sure Unity is open and the Unity API Communicator plugin is installed and running. Download it at ${UAC_WEBSITE}`,
          timestamp: new Date().toISOString(),
        };
      }
      return {
        success: false,
        error: `Cannot connect to Unity at ${this.baseUrl}. Make sure Unity Editor is open and the Unity API Communicator plugin is installed. Download it at ${UAC_WEBSITE}`,
        timestamp: new Date().toISOString(),
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
