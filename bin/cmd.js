#!/usr/bin/env node

require('./args.js')(
    require('level'),
    process.argv.slice(2),
    { $0: 'modwiki' }
);
