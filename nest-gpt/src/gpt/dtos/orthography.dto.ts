import { IsInt, IsOptional, IsString } from 'class-validator';

export class OrtthographyDto {
  @IsString()
  readonly prompt: string;

  @IsInt()
  @IsOptional()
  readonly maxTokens?: number;
}
