export const textToAudioUseCase = async (prompt: string, voice: string) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ prompt, voice })
    });

    if (!resp.ok) throw new Error("Something went wrong while trying to generated the audio");

    const audioFile = await resp.blob();
    const audioUrl = URL.createObjectURL(audioFile);
    return {
      ok: true,
      message: prompt,
      audioUrl,
    };
  } catch (error) {
    return {
      ok: false,
      message: 'Something went wrong while trying to generated the audio'
    }
  }
}