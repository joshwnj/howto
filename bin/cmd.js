#!/usr/bin/env node

require('../lib/args.js')(
    require('level-party'),
    process.argv.slice(2),
    { $0: 'modwiki' }
);
