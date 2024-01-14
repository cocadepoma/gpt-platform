import { useRef, useState } from "react"
import { GptMessage, MyMessage, TextMessageBoxSelect, TypingLoader } from "../../components"
import { translateStreamUseCase } from "../../../core/use-cases/translate-stream.use";

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "german", text: "German" },
  { id: "arabic", text: "Arabic" },
  { id: "bengali", text: "Bengali" },
  { id: "french", text: "French" },
  { id: "hindi", text: "Hindi" },
  { id: "english", text: "English" },
  { id: "japanese", text: "Japanese" },
  { id: "mandarin", text: "Mandarin" },
  { id: "portuguese", text: "Portuguese" },
  { id: "russian", text: "Russian" },
  { id: "spanish", text: "Spanish" },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const handlePost = async (text: string, selectedLanguage: string) => {
    setIsLoading(true);

    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    const newMessage = `Translate: "${text}" to the language ${selectedLanguage}`;
    setMessages((prev) => [...prev, { text: newMessage, isGpt: false }]);

    const stream = translateStreamUseCase(text, selectedLanguage, abortController.current.signal);
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
          <GptMessage text="Hello, what do you need to translate?" />

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

      <TextMessageBoxSelect options={languages} onSendMessage={handlePost} placeholder="Type tour text here..." />

    </div>
  )
}
