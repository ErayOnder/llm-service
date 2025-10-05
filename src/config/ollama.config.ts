export interface OllamaConfig {
  baseUrl: string;
  model: string;
}

export const ollamaConfig = (): OllamaConfig => ({
  baseUrl: process.env.OLLAMA_URL || 'http://host.docker.internal:11434',
  model: process.env.OLLAMA_MODEL || 'llama3.2',
});
