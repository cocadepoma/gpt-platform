export async function* processStreamReader(reader: ReadableStreamDefaultReader<Uint8Array> | undefined, signal: AbortSignal) {
  if (!reader) {
    console.log('Reader could not be generated');
    return;
  }

  const decoder = new TextDecoder();
  let text = '';

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (signal.aborted) {
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      const decodedChunk = decoder.decode(value, { stream: true });
      text += decodedChunk;

      yield text;
    }
  } catch (error) {
    console.error('Error during stream processing:', error);
  } finally {
    reader.releaseLock();
  }
}