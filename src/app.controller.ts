import { Controller, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {
  @Post('generate')
  generate(@Body() body: any) {
    return { response: "Hello from the LLM service!" };
  }
}