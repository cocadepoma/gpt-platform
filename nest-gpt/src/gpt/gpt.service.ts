import OpenAI from 'openai';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

import {
  AudioToTextDto,
  OrtthographyDto,
  ProsConsDiscusserDto,
  TranslateDto,
} from './dtos';
import { TextToAudioDto } from './dtos/text-to-audio.dto';

import {
  orthographyCheckUseCase,
  prosConsDiscusserStreamUseCase,
  prosConsDiscusserUseCase,
  translateStreamUseCase,
  textToAudioUseCase,
  audioToTextUseCase,
} from './use-cases';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async orthographyCheck(orthographyDto: OrtthographyDto) {
    return await orthographyCheckUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async prosConsDicusserStream(prosConsDiscusserDto: ProsConsDiscusserDto) {
    return await prosConsDiscusserStreamUseCase(this.openai, {
      prompt: prosConsDiscusserDto.prompt,
    });
  }

  async translateStream(translateDto: TranslateDto) {
    return await translateStreamUseCase(this.openai, {
      prompt: translateDto.prompt,
      lang: translateDto.lang,
    });
  }

  async textToAudio(textToAudioDto: TextToAudioDto) {
    return await textToAudioUseCase(this.openai, {
      prompt: textToAudioDto.prompt,
      voice: textToAudioDto.voice,
    });
  }

  async getTextToAudio(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios',
      `${fileId}.mp3`,
    );

    const fileFound = fs.existsSync(filePath);

    if (!fileFound) throw new NotFoundException(`File: ${fileId} not found`);

    return filePath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    return await audioToTextUseCase(this.openai, {
      audioFile,
      prompt: audioToTextDto.prompt,
    });
  }
}
