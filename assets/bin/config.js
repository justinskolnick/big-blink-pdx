const pkg = require('../package.json');

const defaults = {
  bundle: true,
  entryPoints: pkg.config.scripts.build,
  format: 'esm',
  jsx: 'automatic',
  logLevel: 'info',
  outdir: pkg.config.scripts.dist,
  sourcemap: true,
  target: 'es2021',
};

const development = {
  ...defaults,
  minify: false,
  outExtension: { '.js': '.js' },
};

const production = {
  ...defaults,
  legalComments: 'external',
  minify: true,
  outExtension: { '.js': '.min.js' },
};

module.exports = {
  development,
  production,
};
