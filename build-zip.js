import { constants } from 'node:fs';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const distDir = path.resolve('dist');
const outputFile = path.join(distDir, 'build.zip');

try {
  await access(distDir, constants.F_OK);
} catch {
  throw new Error(`Folder dist tidak ditemukan: ${distDir}`);
}

await new Promise((resolve, reject) => {
  const child = spawn(
    'powershell.exe',
    [
      '-NoProfile',
      '-Command',
      `Compress-Archive -Path * -DestinationPath '${outputFile.replace(/'/g, "''")}' -Force`,
    ],
    {
      cwd: distDir,
      stdio: 'inherit',
    },
  );

  child.on('error', reject);
  child.on('exit', (code) => {
    if (code === 0) {
      resolve();
      return;
    }

    reject(new Error(`Compress-Archive gagal. Exit code: ${code}`));
  });
});

console.log(`ZIP created: ${outputFile}`);
