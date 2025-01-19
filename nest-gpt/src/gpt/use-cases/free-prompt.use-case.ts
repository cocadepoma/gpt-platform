import OpenAI from 'openai';
interface Options {
  prompt: string;
}

export const freePromptUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt } = options;

  return await openai.chat.completions.create({
    stream: true,
    messages: [
      {
        role: 'system',
        content: `El usuario te va a pasar un prompt, recuerda responderle en el idioma del prompt, el prompt es: ${prompt}`,
      },
    ],
    model: 'gpt-4o-mini',
    temperature: 0.2,
  });
};
