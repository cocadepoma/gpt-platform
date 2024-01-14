import OpenAI from 'openai';
interface Options {
  prompt: string;
  lang: string;
}

export const translateStreamUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { prompt, lang } = options;

  return await openai.chat.completions.create({
    stream: true,
    messages: [
      {
        role: 'system',
        content: `Traduce el siguiente texto al idioma ${lang}:${prompt}`,
      },
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.2,
  });
};
