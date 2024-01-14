import { useState } from "react"
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}

export const OrthographyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const { ok, errors, message, userScore } = await orthographyUseCase(text);

    console.log({ ok, errors, message, userScore });

    setMessages((prev) => [...prev, { text: ok ? message : 'Text correction failed', info: { errors, message, userScore }, isGpt: true, }]);
    setIsLoading(false);
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Hello, add your text and I will help you with the corrections" />

          {
            messages.map((message, index) => (
              message.isGpt
                ? <GptOrthographyMessage key={index} {...message.info!} />
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
