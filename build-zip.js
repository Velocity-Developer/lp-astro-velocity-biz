import { constants, createWriteStream } from 'node:fs';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { ZipArchive } from 'archiver';

const distDir = path.resolve('dist');
const outputFile = path.join(distDir, 'build.zip');

try {
  await access(distDir, constants.F_OK);
} catch {
  throw new Error(`Folder dist tidak ditemukan: ${distDir}`);
}

await new Promise((resolve, reject) => {
  const output = createWriteStream(outputFile);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  output.on('close', resolve);
  output.on('error', reject);
  archive.on('error', reject);

  archive.pipe(output);
  archive.glob('**/*', {
    cwd: distDir,
    dot: true,
    ignore: ['build.zip'],
  });
  archive.finalize();
});

console.log(`ZIP created: ${outputFile}`);
