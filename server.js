import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bundlePath = path.join(__dirname, 'dist', 'server.cjs');

if (!fs.existsSync(bundlePath)) {
  console.log('[Hostinger Boot] dist/server.cjs not found, compiling production bundle...');
  const { execSync } = await import('child_process');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
}

await import('./dist/server.cjs');
