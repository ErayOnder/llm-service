import { Injectable, Inject, Logger } from '@nestjs/common';
import { Ollama } from '@langchain/ollama';
import { OLLAMA_PROVIDER } from '../../providers/ollama.provider';
import { GenerateRequestDto } from './dto/generate-request.dto';
import { GenerateResponseDto } from './dto/generate-response.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private isOllamaAvailable: boolean = false;

  constructor(
    @Inject(OLLAMA_PROVIDER) private readonly llm: Ollama,
  ) {
    this.checkOllamaAvailability();
  }

  private async checkOllamaAvailability() {
    try {
      await this.llm.invoke('test');
      this.isOllamaAvailable = true;
      this.logger.log('Ollama service is available');
    } catch (error) {
      this.isOllamaAvailable = false;
      this.logger.warn('Ollama service is not available, using fallback responses');
    }
  }

  async generate(dto: GenerateRequestDto): Promise<GenerateResponseDto> {
    try {
      if (this.isOllamaAvailable) {
        const response = await this.llm.invoke(dto.message);
        return new GenerateResponseDto(response);
      } else {
        return this.getFallbackResponse(dto.message);
      }
    } catch (error) {
      this.logger.error('Error in generate:', error);
      return new GenerateResponseDto(
        "I apologize, but I'm having trouble processing your request right now. Please try again later."
      );
    }
  }

  private getFallbackResponse(message: string): GenerateResponseDto {
    const fallbackResponses = [
      `I'm a demo chatbot. Ollama isn't connected yet, but I received your message: ${message}`,
      `Hello! I'm currently running in demo mode. Your message was: ${message}`,
      `Thanks for your message! I'm working in fallback mode right now. You said: ${message}`,
    ];
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    return new GenerateResponseDto(randomResponse);
  }
}
