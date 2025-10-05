import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ollamaProvider } from '../../providers/ollama.provider';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ollamaProvider],
  exports: [ChatService],
})
export class ChatModule {}
