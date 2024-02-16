import { processStreamReader } from "../../common/process-stream-reader";

export async function* prosConsStreamGeneratorUseCase(prompt: string, signal: AbortSignal) {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ prompt }),
      signal,
    });

    if (!resp.ok) throw new Error("Something went wrong while trying to compare your text");

    const reader = resp.body?.getReader();

    yield* processStreamReader(reader, signal);
  } catch (error) {
    return null;
  }
}