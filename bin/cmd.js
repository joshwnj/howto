#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var minimist = require('minimist');
var defined = require('defined');

var argv = minimist(process.argv.slice(2), {
    alias: { h: 'help', d: 'datadir' }
});

if (argv.help || argv._[0] === 'help') {
    usage(0);
}
else if (argv.showdir) {
    console.log(getdir());
}
else if (argv._[0] === 'show') {
    
}
else if (argv._[0] === 'edit') {
    
}
else if (argv._[0] === 'create') {
    var hdb = gethdb();
    var w = hdb.createWriteStream();
    process.stdin.pipe(w);
    w.pipe(process.stdout);
}
else if (argv._[0] === 'search') {
    var hdb = gethdb();
    hdb.search(argv._.slice(1)).on('data', console.log);
}
else usage(1);

function usage (code) {
    var r = fs.createReadStream(path.join(__dirname, 'usage.txt'));
    r.pipe(process.stdout);
    r.on('end', function () {
        if (code) process.exit(code);
    });
}

function gethdb () {
    var howto = require('../');
    var level = require('level');
    
    var dir = getdir();
    var blobdir = path.join(dir, 'blob');
    mkdirp.sync(blobdir);
    
    var db = level(path.join(dir, 'db'));
    return wikidb(db, { dir: blobdir });
}

function getdir () {
    var dir = defined(argv.datadir, process.env.HOWTO_PATH);
    if (!dir) {
        dir = defined(process.env.HOME, process.env.USERDIR);
        if (dir) dir = path.join(dir, '.config', 'howto');
    }
    if (!dir) dir = process.cwd();
    return dir;
}
