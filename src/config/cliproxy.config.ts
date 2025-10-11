export interface CliProxyConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export const cliproxyConfig = (): CliProxyConfig => ({
  baseUrl: process.env.CLIPROXY_URL || 'http://cli-proxy-api:8317/v1',
  apiKey: process.env.CLIPROXY_API_KEY || 'chatbot-api-key-12345',
  model: process.env.CLIPROXY_MODEL || 'gemini-2.5-flash',
});
