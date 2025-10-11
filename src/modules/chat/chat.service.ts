import { Injectable, Inject, Logger } from '@nestjs/common';
import { Ollama } from '@langchain/ollama';
import OpenAI from 'openai';
import { OLLAMA_PROVIDER } from '../../providers/ollama.provider';
import { CLIPROXY_PROVIDER } from '../../providers/cliproxy.provider';
import { GenerateRequestDto } from './dto/generate-request.dto';
import { GenerateResponseDto } from './dto/generate-response.dto';
import {
  LLMProvider,
  MODEL_PROVIDER_MAP,
  DEFAULT_MODEL,
  FALLBACK_MODEL,
} from '../../common/enums/llm-model.enum';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private providerAvailability: Map<LLMProvider, boolean> = new Map();

  constructor(
    @Inject(CLIPROXY_PROVIDER) private readonly cliproxyClient: OpenAI,
    @Inject(OLLAMA_PROVIDER) private readonly ollamaClient: Ollama,
  ) {
    this.checkServicesAvailability();
  }

  private async checkServicesAvailability() {
    // Check CLIProxy (Gemini) availability
    try {
      await this.cliproxyClient.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5,
      });
      this.providerAvailability.set(LLMProvider.GEMINI, true);
      this.logger.log('✅ CLIProxy (Gemini) service is available');
    } catch (error) {
      this.providerAvailability.set(LLMProvider.GEMINI, false);
      this.logger.warn('⚠️  CLIProxy (Gemini) service is not available');
    }

    // Check Ollama availability
    try {
      await this.ollamaClient.invoke('test');
      this.providerAvailability.set(LLMProvider.OLLAMA, true);
      this.logger.log('✅ Ollama service is available (fallback)');
    } catch (error) {
      this.providerAvailability.set(LLMProvider.OLLAMA, false);
      this.logger.warn('⚠️  Ollama service is not available');
    }
  }

  private isProviderAvailable(provider: LLMProvider): boolean {
    return this.providerAvailability.get(provider) || false;
  }

  private async generateWithGemini(model: string, prompt: string): Promise<string> {
    const completion = await this.cliproxyClient.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });
    return completion.choices[0]?.message?.content || 'No response generated';
  }

  private async generateWithOllama(model: string, prompt: string): Promise<string> {
    // Create a new Ollama client with the specified model
    // LangChain doesn't support dynamic model changes on existing instances
    const { Ollama } = await import('@langchain/ollama');
    const ollamaConfig = await import('../../config/ollama.config');

    const dynamicOllamaClient = new Ollama({
      baseUrl: ollamaConfig.ollamaConfig().baseUrl,
      model: model,
    });

    return await dynamicOllamaClient.invoke(prompt);
  }

  async generate(dto: GenerateRequestDto): Promise<GenerateResponseDto> {
    // Determine which model to use
    const requestedModel = dto.model || DEFAULT_MODEL;
    const modelConfig = MODEL_PROVIDER_MAP[requestedModel];

    if (!modelConfig) {
      this.logger.warn(`❌ Unknown model requested: ${requestedModel}, using default`);
      return this.generateWithFallback(DEFAULT_MODEL, dto.prompt);
    }

    this.logger.log(`🎯 Requested model: ${requestedModel} (Provider: ${modelConfig.provider})`);

    // Try the requested model
    try {
      const response = await this.generateWithModel(
        modelConfig.provider,
        modelConfig.modelName,
        dto.prompt,
      );
      return new GenerateResponseDto(response);
    } catch (error) {
      this.logger.error(`Error with ${requestedModel}:`, error.message);
      this.providerAvailability.set(modelConfig.provider, false);
      this.logger.log('Attempting fallback...');
    }

    // Fallback to default model if different from requested
    if (requestedModel !== DEFAULT_MODEL) {
      return this.generateWithFallback(DEFAULT_MODEL, dto.prompt);
    }

    // Fallback to Ollama if Gemini was requested
    return this.generateWithFallback(FALLBACK_MODEL, dto.prompt);
  }

  private async generateWithModel(
    provider: LLMProvider,
    model: string,
    prompt: string,
  ): Promise<string> {
    if (!this.isProviderAvailable(provider)) {
      throw new Error(`Provider ${provider} is not available`);
    }

    switch (provider) {
      case LLMProvider.GEMINI:
        this.logger.log(`Using Gemini model: ${model}`);
        return await this.generateWithGemini(model, prompt);

      case LLMProvider.OLLAMA:
        this.logger.log(`Using Ollama model: ${model}`);
        return await this.generateWithOllama(model, prompt);

      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private async generateWithFallback(
    fallbackModel: string,
    prompt: string,
  ): Promise<GenerateResponseDto> {
    const fallbackConfig = MODEL_PROVIDER_MAP[fallbackModel];

    if (!fallbackConfig) {
      this.logger.error('❌ Fallback model not configured');
      return new GenerateResponseDto(
        'I apologize, but all AI services are currently unavailable. Please try again later.',
      );
    }

    try {
      this.logger.log(`🔄 Falling back to ${fallbackModel}`);
      const response = await this.generateWithModel(
        fallbackConfig.provider,
        fallbackConfig.modelName,
        prompt,
      );
      return new GenerateResponseDto(response);
    } catch (error) {
      this.logger.error(`❌ Fallback failed:`, error.message);
      return new GenerateResponseDto(
        'I apologize, but all AI services are currently unavailable. Please try again later.',
      );
    }
  }
}
