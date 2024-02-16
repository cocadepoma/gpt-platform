import { processStreamReader } from "../../common/process-stream-reader";

export async function* translateStreamUseCase(prompt: string, lang: string, signal: AbortSignal) {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ prompt, lang }),
      signal,
    });

    if (!resp.ok) throw new Error("Something went wrong while trying to translate your text");

    const reader = resp.body?.getReader();

    yield* processStreamReader(reader, signal);
  } catch (error) {
    return null;
  }
}


