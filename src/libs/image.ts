import { join } from 'path';
import { readFile } from 'fs/promises';

export async function getImageBuffer(src: string): Promise<Buffer> {
  if (src.startsWith('http')) {
    const res = await fetch(src);
    return Buffer.from(await res.arrayBuffer());
  } else {
    return await readFile(join('./public', src));
  }
}
