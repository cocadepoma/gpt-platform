import OpenAI from 'openai';

interface Options {
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId = 'asst_QtJ7eqbM1Iktm2c2r8A2mx5q' } = options;
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    // instructions be carefull because it overrides the previous assistant instructions
  });

  return run;
};
