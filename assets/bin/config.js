const pkg = require('../../package.json');

const { sassPlugin } = require('esbuild-sass-plugin');
const postcss = require('postcss');
const postcssPresetEnv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');

const defaults = {
  bundle: true,
  entryPoints: pkg.config.scripts.build,
  format: 'esm',
  jsx: 'automatic',
  logLevel: 'info',
  outdir: pkg.config.scripts.dist,
  plugins: [
    sassPlugin({
      filter: /\.scss$/,
      async transform(source, resolveDir) {
        const { css } = await postcss([
          autoprefixer,
          postcssPresetEnv({
            stage: 0,
          })
        ])
          .process(source, {
            from: undefined,
          });
        return css;
      }
    }),
  ],
  sourcemap: false,
  target: 'es2021',
};

const development = {
  ...defaults,
  banner: {
    js: '/* eslint-disable */',
  },
  minify: false,
  outExtension: {
    '.js': '.js',
    '.css': '.css'
  },
};

const production = {
  ...defaults,
  legalComments: 'external',
  minify: true,
  outExtension: {
    '.js': '.min.js',
    '.css': '.min.css'
  },
};

module.exports = {
  development,
  production,
};
