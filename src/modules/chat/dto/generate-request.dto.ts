import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GenerateRequestDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsOptional()
  model?: string;
}
