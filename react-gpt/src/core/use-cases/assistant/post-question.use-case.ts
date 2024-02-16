import { QuestionReponse } from "../../../interfaces/assistant.response";

export const postQuestionUseCase = async (threadId: string, question: string) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_ASSISTANT_API}/user-question`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({ threadId, question })
    });

    if (!resp.ok) throw new Error("Something went wrong while trying to post a question");

    const replies = await resp.json() as QuestionReponse[];

    return replies
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while trying to post a question")
  }
}