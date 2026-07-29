import * as esbuild from 'esbuild';
import {sassPlugin} from 'esbuild-sass-plugin';
import {NodePackageImporter} from 'sass-embedded';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist/css',
  bundle: true,
  loader: {
    '.png': 'dataurl',
    '.svg': 'dataurl',
  },
  minify: false,
  sourcemap: true,
  plugins: [
    sassPlugin({
      embedded: true,
      importers: [new NodePackageImporter()],
    }),
  ],
});
