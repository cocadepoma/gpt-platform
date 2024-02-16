import { useEffect, useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { createThreadUseCase, postQuestionUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<string | null>(null);

  useEffect(() => {
    const threadId = sessionStorage.getItem('threadId');

    if (threadId) {
      setThreadId(threadId);
    } else {
      createThreadUseCase()
        .then((id) => {
          setThreadId(id);
          sessionStorage.setItem('threadId', id);
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
        });
    }
  }, []);

  useEffect(() => {
    if (threadId) {
      setMessages((prev) => [...prev, { text: 'Hello, I am Sam, what can I do for you?', isGpt: true }]);
      setIsLoading(false);
    }
  }, [threadId]);

  const handlePost = async (text: string) => {
    if (!threadId) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    try {
      const replies = await postQuestionUseCase(threadId, text);
      for (const reply of replies) {
        for (const text of reply.content) {
          setMessages((prev) => [...prev, { text, isGpt: reply.role === 'assistant', info: reply }]);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {
            messages.map((message, index) => (
              message.isGpt
                ? <GptMessage key={index} text={message.text} />
                : <MyMessage key={index} text={message.text} />
            ))
          }

          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader className="fade-in" />
              </div>
            )
          }

        </div>
      </div>

      <TextMessageBox onSendMessage={handlePost} placeholder="Type tour text here..." />

    </div>
  )
}
