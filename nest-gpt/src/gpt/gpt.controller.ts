import { Body, Controller, Post } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrtthographyDto } from './dtos';

@Controller('gpt')
export class GptController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly gptService: GptService) { }

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrtthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }
}
