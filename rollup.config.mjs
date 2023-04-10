import { readFileSync } from 'fs';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';

const pkg = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  plugins: [
    url({ limit: 1000000000000000 }),
    typescript(),
  ],
};