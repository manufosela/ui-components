import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: [
    'src/index.js',
    'src/app-modal.js',
    'src/slide-notification.js',
    'src/multi-select.js'
  ],
  outdir: 'dist',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  external: ['lit', 'lit/*'],
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production'
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      await esbuild.build(buildOptions);
      console.log('Build completed successfully');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
