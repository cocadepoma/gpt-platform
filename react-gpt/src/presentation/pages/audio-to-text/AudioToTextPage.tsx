import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBoxFile, TypingLoader } from "../../components"
import { audioToTextUseCase } from "../../../core/use-cases/audio-to-text.use-case";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string, audioFile: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);

    const resp = await audioToTextUseCase(audioFile, text);
    setIsLoading(false);

    if (!resp) return;

    const gptMessage = `
## Transcription:
__Duration:__ ${Math.round(resp.duration)}s

__Text:__
${resp.text}
`;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: gptMessage, isGpt: true }
    ]);

    for (const segment of resp.segments) {
      const segmentMessage = `
__From ${Math.round(segment.start)} to ${Math.round(segment.end)} seconds:__
${segment.text}
`;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: segmentMessage, isGpt: true }
      ]);
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Hello, add and audio file to generate the text" />
          <GptMessage text="Remember, the audio and the prompt should be in the same Language" />

          {
            messages.map((message, index) => (
              message.isGpt
                ? <GptMessage key={index} text={message.text} />
                : <MyMessage key={index} text={message.text === '' ? 'Transcribe the audio' : message.text} />
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

      <TextMessageBoxFile
        onSendMessage={handlePost}
        placeholder="Type tour text here..."
        accept="audio/*"
      />

    </div>
  )
}
