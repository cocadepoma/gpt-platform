import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';

interface Options {
  prompt: string;
  voice?: string;
}

type OpenAiVoices = 'nova' | 'alloy' | 'fable' | 'onyx' | 'echo' | 'shimmer';

export const textToAudioUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, voice = 'nova' } = options;

  const voices: { [key in OpenAiVoices]: OpenAiVoices } = {
    nova: 'nova',
    alloy: 'alloy',
    fable: 'fable',
    onyx: 'onyx',
    echo: 'echo',
    shimmer: 'shimmer',
  };

  const folderPath = path.resolve(__dirname, '../../../generated/audios');
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  fs.mkdirSync(folderPath, { recursive: true });

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: voices[voice],
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);

  return speechFile;
};
