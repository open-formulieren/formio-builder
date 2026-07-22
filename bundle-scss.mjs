import * as esbuild from 'esbuild';
import {sassPlugin} from 'esbuild-sass-plugin';
import * as sass from 'sass';

await esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'lib/css',
  bundle: true,
  loader: {
    '.png': 'dataurl',
    '.svg': 'dataurl',
  },
  minify: false,
  sourcemap: true,
  plugins: [
    sassPlugin({
      embedded: false,
      importers: [new sass.NodePackageImporter()],
    }),
  ],
});
