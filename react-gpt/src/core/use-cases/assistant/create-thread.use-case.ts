export const createThreadUseCase = async () => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_ASSISTANT_API}/create-thread`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
    });

    if (!resp.ok) throw new Error("Something went wrong while trying to create a thread");

    const { id } = await resp.json() as { id: string };

    return id
  } catch (error) {
    throw new Error("Something went wrong while trying to create a thread")
  }
}