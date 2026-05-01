import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ChatDto {
  @IsString()
  @MaxLength(1000)
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  userId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  systemPrompt?: string;
}
