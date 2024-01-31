import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { ImageGenerationUseCase, ImageVariationUseCase } from '../../../core/use-cases/';
import { GptMessageSelectableImage } from "../../components";

interface Message {
  text: string;
  isGpt: boolean;
  imageInfo?: {
    url: string;
    alt: string;
  };
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    isGpt: true,
    text: 'Base image',
    imageInfo: {
      url: 'http://localhost:3000/gpt/image-generation/01f42a6c-efc8-4e01-8ea6-c3355e9becce.png',
      alt: 'Base image'
    }
  }]);

  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async () => {
    setIsLoading(true);

    const resp = await ImageVariationUseCase(originalImageAndMask.original!);
    setIsLoading(false);

    if (!resp) {
      return setMessages((prev) => [...prev, { text: 'Sorry, something went wrong when generating the image', isGpt: true }]);
    }

    setMessages((prev) => [...prev, { text: 'Here is your image!', isGpt: true, imageInfo: resp }]);
  }

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const { original, mask } = originalImageAndMask;
    const imageInfo = await ImageGenerationUseCase(text, original, mask);

    if (!imageInfo) {
      return setMessages((prev) => [...prev, { text: 'Sorry, something went wrong when generating the image', isGpt: true }]);
    }

    setMessages((prev) => [...prev, { text: 'Here is your image!', isGpt: true, imageInfo: imageInfo }]);

    setIsLoading(false);

    // TODO add gpt message
  }

  return (
    <>
      {
        originalImageAndMask.original && (
          <div className="fixed flex flex-col items-center top-10 right-12 z-10 fade-in">
            <span>Editing...</span>
            <img src={originalImageAndMask.mask ?? originalImageAndMask.original} alt="Original image" className="border rounde-xl w-36 h-36 object-contain" />

            <button onClick={handleVariation} className="btn-primary mt-2">Generate variation</button>
          </div>
        )
      }
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            <GptMessage text="Hello, what image do you want to generate?" />

            {
              messages.map((message, index) => (
                message.isGpt
                  ? <GptMessageSelectableImage
                    key={index}
                    text={message.text}
                    url={message.imageInfo!.url}
                    alt={message.imageInfo!.url}
                    onImageSelected={(maskUrl) => setOriginalImageAndMask({ original: message.imageInfo?.url, mask: maskUrl })}
                  />

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
    </>
  )
}


{/* <GptMessageImage key={index} text={message.text} url={message.imageInfo!.url} alt={message.imageInfo!.url} onImageSelected={(url) => setOriginalImageAndMask({ original: url, mask: undefined })} /> */ }