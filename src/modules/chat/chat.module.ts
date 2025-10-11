import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ollamaProvider } from '../../providers/ollama.provider';
import { cliproxyProvider } from '../../providers/cliproxy.provider';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ollamaProvider, cliproxyProvider],
  exports: [ChatService],
})
export class ChatModule {}
