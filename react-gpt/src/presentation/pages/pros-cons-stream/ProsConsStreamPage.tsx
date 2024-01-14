import { useRef, useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { prosConsStreamGeneratorUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const handlePost = async (text: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunning.current = true;
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    // const reader = await prosConsStreamUseCase(text);
    // setIsLoading(false);

    // if (!reader) return;

    // const decoder = new TextDecoder();
    // let message = '';
    // setMessages((messages) => [...messages, { text: message, isGpt: true }]);

    // // eslint-disable-next-line no-constant-condition
    // while (true) {
    //   const { value, done } = await reader.read();
    //   if (done) break;

    //   const decodedChunk = decoder.decode(value, { stream: true });
    //   message += decodedChunk;

    //   setMessages((messages) => {
    //     const newMessages = [...messages];
    //     newMessages[newMessages.length - 1].text = message;

    //     return newMessages;
    //   });
    // }

    const stream = prosConsStreamGeneratorUseCase(text, abortController.current.signal);
    setIsLoading(false);

    setMessages((messages) => [...messages, { text: '', isGpt: true }]);

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].text = text;

        return newMessages;
      });
    }
    isRunning.current = false;
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Hello, add the text you want to compare" />

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

      <TextMessageBox onSendMessage={handlePost} />

    </div>
  )
}
