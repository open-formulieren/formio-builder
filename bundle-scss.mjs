import * as esbuild from 'esbuild';
import {sassPlugin} from 'esbuild-sass-plugin';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'lib/css',
  bundle: true,
  minify: false,
  sourcemap: true,
  plugins: [sassPlugin()],
});
