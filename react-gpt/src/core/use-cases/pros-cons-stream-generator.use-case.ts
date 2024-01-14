export async function* prosConsStreamGeneratorUseCase(prompt: string, signal: AbortSignal) {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ prompt }),
      signal,
      // TODO: abortsignal
    });

    if (!resp.ok) throw new Error("Something went wrong while trying to compare your text");

    const reader = resp.body?.getReader();

    if (!reader) {
      console.log('Reader could not be generated');
      return null;
    }

    const decoder = new TextDecoder();
    let text = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const decodedChunk = decoder.decode(value, { stream: true });
      text += decodedChunk;

      yield text;
    }
  } catch (error) {
    return null;
  }
}