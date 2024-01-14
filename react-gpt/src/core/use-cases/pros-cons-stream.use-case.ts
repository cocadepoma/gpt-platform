export const prosConsStreamUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ prompt }),
      // TODO: abortsignal
    });

    if (!resp.ok) throw new Error("Something went wrong while trying to compare your text");

    const reader = resp.body?.getReader();

    return reader;
  } catch (error) {
    return null;
  }
}