#!/usr/bin/env node

const esbuild = require('esbuild');
const config = require('./config');

(async () => {
  const result = await esbuild
    .build(config.production)
    .catch(() => process.exit(1));
})();
