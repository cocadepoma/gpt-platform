import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { ImageGenerationUseCase } from '../../../core/use-cases/';
import { GptMessageImage } from "../../components";

interface Message {
  text: string;
  isGpt: boolean;
  imageInfo?: {
    url: string;
    alt: string;
  };
}

export const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    // TODO use case

    const imageInfo = await ImageGenerationUseCase(text);

    if (!imageInfo) {
      return setMessages((prev) => [...prev, { text: 'Sorry, something went wrong when generating the image', isGpt: true }]);
    }

    setMessages((prev) => [...prev, { text: 'Here is your image!', isGpt: true, imageInfo: imageInfo }]);

    setIsLoading(false);

    // TODO add gpt message
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Hello, what image do you want to generate?" />

          {
            messages.map((message, index) => (
              message.isGpt
                ? <GptMessageImage key={index} text={message.text} url={message.imageInfo!.url} alt={message.imageInfo!.url} />
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
