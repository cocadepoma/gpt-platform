import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';

import { ChatCompletionChunk } from 'openai/resources';
import { Stream } from 'openai/streaming';

import { GptService } from './gpt.service';
import {
  AudioToTextDto,
  OrtthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
  ImageGenerationDto,
  ImageVariationDto,
} from './dtos';

@Controller('gpt')
export class GptController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly gptService: GptService) { }

  @Get('image-generation/:fileId')
  async getGeneratedImage(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const filePath = await this.gptService.getGeneratedImage(fileId);

    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('free-prompt')
  async freePromt(
    @Body() { prompt }: { prompt: string },
    @Res() res: Response,
  ) {
    const stream = await this.gptService.freePrompt(prompt);

    this.sendStreamResponse(res, stream);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration(imageGenerationDto);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return await this.gptService.imageVariation(imageVariationDto);
  }

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

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callbak) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${new Date().getTime()}.${fileExtension}`;

          return callbak(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5 mb',
          }),
          new FileTypeValidator({ fileType: 'audio/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return await this.gptService.audioToText(file, audioToTextDto);
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
