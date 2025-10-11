export enum LLMProvider {
  GEMINI = 'gemini',
  OLLAMA = 'ollama',
}

export enum LLMModel {
  // Gemini models
  GEMINI_2_5_PRO = 'gemini-2.5-pro',
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',
  GEMINI_2_5_FLASH_LITE = 'gemini-2.5-flash-lite',

  // Ollama models
  LLAMA_3_2 = 'llama3.2',
  LLAMA_3_1 = 'llama3.1',
  MISTRAL = 'mistral',
}

export interface ModelConfig {
  provider: LLMProvider;
  modelName: string;
}

// Map model names to their providers
export const MODEL_PROVIDER_MAP: Record<string, ModelConfig> = {
  // Gemini models
  [LLMModel.GEMINI_2_5_PRO]: {
    provider: LLMProvider.GEMINI,
    modelName: LLMModel.GEMINI_2_5_PRO,
  },
  [LLMModel.GEMINI_2_5_FLASH]: {
    provider: LLMProvider.GEMINI,
    modelName: LLMModel.GEMINI_2_5_FLASH,
  },
  [LLMModel.GEMINI_2_5_FLASH_LITE]: {
    provider: LLMProvider.GEMINI,
    modelName: LLMModel.GEMINI_2_5_FLASH_LITE,
  },

  // Ollama models
  [LLMModel.LLAMA_3_2]: {
    provider: LLMProvider.OLLAMA,
    modelName: LLMModel.LLAMA_3_2,
  },
  [LLMModel.LLAMA_3_1]: {
    provider: LLMProvider.OLLAMA,
    modelName: LLMModel.LLAMA_3_1,
  },
  [LLMModel.MISTRAL]: {
    provider: LLMProvider.OLLAMA,
    modelName: LLMModel.MISTRAL,
  },
};

// Default fallback chain
export const DEFAULT_MODEL = LLMModel.GEMINI_2_5_FLASH;
export const FALLBACK_MODEL = LLMModel.LLAMA_3_2;
