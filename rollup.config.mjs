import { readFileSync } from 'fs';
import typescript from '@rollup/plugin-typescript';

const pkg = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));

export default {
  input: 'src/lib/index.ts',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  plugins: [
    typescript(),
  ],
};