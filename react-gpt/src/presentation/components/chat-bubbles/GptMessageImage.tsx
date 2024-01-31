interface Props {
  text: string;
  url: string;
  alt: string;
  onImageSelected?: (url: string) => void;
}

export const GptMessageImage = ({ text, url, alt, onImageSelected }: Props) => {
  return (
    <div className="col-start-1 col-end-9 p-3 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0">
          G
        </div>
        <div className="relative ml-3 text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl">
          <span>{text}</span>
          <img src={url} alt={alt} className="mt-2 rounded-xl w-96 h-96 object-cover" onClick={() => onImageSelected && onImageSelected(url)} />
        </div>
      </div>
    </div>
  );
};