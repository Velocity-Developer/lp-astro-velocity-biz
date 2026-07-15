import { constants, createWriteStream } from 'node:fs';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { ZipArchive } from 'archiver';

const sourceDir = path.resolve('dist', 'build');
const outputFile = path.resolve('dist', 'build.zip');

try {
  await access(sourceDir, constants.F_OK);
} catch {
  throw new Error(`Folder dist/build tidak ditemukan: ${sourceDir}`);
}

await new Promise((resolve, reject) => {
  const output = createWriteStream(outputFile);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  output.on('close', resolve);
  output.on('error', reject);
  archive.on('error', reject);

  archive.pipe(output);
  archive.glob('**/*', {
    cwd: sourceDir,
    dot: true,
  });
  archive.finalize();
});

console.log(`ZIP created: ${outputFile}`);
