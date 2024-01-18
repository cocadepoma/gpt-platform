import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

export const downloadBase64ImageAsPng = async (
  base64Image: string,
  completePath = false,
) => {
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageName = `${new Date().getTime()}-64.png`;

  const fullPath = path.join(folderPath, imageName);

  await sharp(imageBuffer).png().ensureAlpha().toFile(fullPath);

  return completePath ? fullPath : imageName;
};
