import { Ollama } from '@langchain/ollama';
import { ollamaConfig } from '../config/ollama.config';

export const OLLAMA_PROVIDER = 'OLLAMA_PROVIDER';

export const ollamaProvider = {
  provide: OLLAMA_PROVIDER,
  useFactory: () => {
    const config = ollamaConfig();
    return new Ollama({
      baseUrl: config.baseUrl,
      model: config.model,
    });
  },
};
