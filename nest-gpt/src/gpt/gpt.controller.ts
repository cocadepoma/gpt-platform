import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { ChatCompletionChunk } from 'openai/resources';
import { Stream } from 'openai/streaming';

import { GptService } from './gpt.service';
import {
  OrtthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';

@Controller('gpt')
export class GptController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly gptService: GptService) { }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.textToAudio(textToAudioDto);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async getTextToAudio(@Param('fileId') fileId: string, @Res() res: Response) {
    const filePath = await this.gptService.getTextToAudio(fileId);

    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

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
