import { Module } from '@nestjs/common';
import { ChatModule } from './modules/chat/chat.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [ChatModule, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}