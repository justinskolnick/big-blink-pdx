#!/usr/bin/env node

const esbuild = require('esbuild');
const config = require('./config');

(async () => {
  const context = await esbuild
    .context(config.development)
    .catch(() => process.exit(1));

  await context.watch();
  console.log('watching...');
})();
