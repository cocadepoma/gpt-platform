import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { ChatCompletionChunk } from 'openai/resources';
import { Stream } from 'openai/streaming';

import { GptService } from './gpt.service';
import { OrtthographyDto, ProsConsDiscusserDto, TranslateDto } from './dtos';

@Controller('gpt')
export class GptController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly gptService: GptService) { }

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrtthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDiscusserDto: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(prosConsDiscusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream =
      await this.gptService.prosConsDicusserStream(prosConsDiscusserDto);

    this.sendStreamResponse(res, stream);
  }

  @Post('translate')
  async translateStream(
    @Body() translateDto: TranslateDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.translateStream(translateDto);

    this.sendStreamResponse(res, stream);
  }

  private async sendStreamResponse(
    res: Response,
    stream: Stream<ChatCompletionChunk>,
  ) {
    try {
      res.setHeader('Content-Type', 'application/json');
      res.status(HttpStatus.OK);

      for await (const chunk of stream) {
        const piece = chunk.choices[0].delta.content || '';
        res.write(piece);
      }

      res.end();
    } catch (error) {
      console.error('Error during stream processing:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    }
  }
}
