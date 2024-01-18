import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';

import { InternalServerErrorException } from '@nestjs/common';

export const downloadImageAsPng = async (url: string, completePath = false) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new InternalServerErrorException(
      'An error occurred while downloading the image',
    );
  }

  const folderPath = path.resolve('./', './generated/images');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageName = `${crypto.randomUUID()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());
  const fullPath = path.join(folderPath, imageName);

  await sharp(buffer).png().ensureAlpha().toFile(fullPath);

  return completePath ? fullPath : imageName;
};
