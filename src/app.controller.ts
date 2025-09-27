import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { Ollama } from '@langchain/ollama';

@Controller()
export class AppController {
  private llm: Ollama;
  private isOllamaAvailable: boolean = false;

  constructor() {
    this.llm = new Ollama({
      baseUrl: process.env.OLLAMA_URL || "http://host.docker.internal:11434",
      model: process.env.OLLAMA_MODEL || "llama3.2",
    });
    this.checkOllamaAvailability();
  }

  private async checkOllamaAvailability() {
    try {
      await this.llm.invoke("test");
      this.isOllamaAvailable = true;
      console.log('Ollama service is available');
    } catch (error) {
      this.isOllamaAvailable = false;
      console.log('Ollama service is not available, using fallback responses');
    }
  }

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generate(@Body() body: { message: string }) {
    try {
      if (this.isOllamaAvailable) {
        const response = await this.llm.invoke(body.message);
        return { response };
      } else {
        // Fallback response when Ollama is not available
        const fallbackResponses = [
          "I'm a demo chatbot. Ollama isn't connected yet, but I received your message: " + body.message,
          "Hello! I'm currently running in demo mode. Your message was: " + body.message,
          "Thanks for your message! I'm working in fallback mode right now. You said: " + body.message
        ];
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        return { response: randomResponse };
      }
    } catch (error) {
      console.error('Error in generate endpoint:', error);
      return { response: "I apologize, but I'm having trouble processing your request right now. Please try again later." };
    }
  }
}