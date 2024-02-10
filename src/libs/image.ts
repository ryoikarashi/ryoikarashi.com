import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export async function getImageBuffer(src: string): Promise<Buffer> {
  if (src.startsWith('http')) {
    const res = await fetch(src);
    return Buffer.from(await res.arrayBuffer());
  } else {
    return await readFile(join(__dirname, '../../..', './public', src));
  }
}
