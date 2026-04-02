#!/usr/bin/env node

'use strict';

// Check Node.js version
const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  console.error('\x1b[31mError: RAPID CLI requires Node.js 18 or higher.\x1b[0m');
  console.error(`You are running Node.js ${process.versions.node}`);
  console.error('Please upgrade: https://nodejs.org');
  process.exit(1);
}

require('../dist/index.js');
