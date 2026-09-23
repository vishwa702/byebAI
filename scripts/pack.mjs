import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const staging = join(dist, 'staging');
const zipPath = join(dist, 'byebai.zip');

const files = [
  'manifest.json',
  'background.js',
  'detection.js',
  'content.js',
  'content.css',
  'popup.html',
  'popup.js',
  'popup.css',
  'onboarding.html',
  'privacy.html',
  'LICENSE'
];

rmSync(dist, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });

for (const file of files) {
  cpSync(join(root, file), join(staging, file));
}

const iconNames = ['icon16.png', 'icon32.png', 'icon48.png', 'icon128.png'];
mkdirSync(join(staging, 'icons'), { recursive: true });
for (const name of iconNames) {
  cpSync(join(root, 'icons', name), join(staging, 'icons', name));
}

if (existsSync(zipPath)) rmSync(zipPath);

const ps = spawnSync(
  'powershell',
  [
    '-NoProfile',
    '-Command',
    `Compress-Archive -Path (Join-Path '${staging}' '*') -DestinationPath '${zipPath}' -Force`
  ],
  { stdio: 'inherit' }
);

if (ps.status !== 0) {
  const zip = spawnSync('zip', ['-r', zipPath, '.'], {
    cwd: staging,
    stdio: 'inherit'
  });
  if (zip.status !== 0) {
    console.error('Could not create zip. Staging folder is at', staging);
    process.exit(1);
  }
}

console.log('Wrote', zipPath);
