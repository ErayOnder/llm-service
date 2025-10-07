import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GenerateRequestDto } from './dto/generate-request.dto';
import { GenerateResponseDto } from './dto/generate-response.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generate(@Body() dto: GenerateRequestDto): Promise<GenerateResponseDto> {
    return this.chatService.generate(dto);
  }
}
