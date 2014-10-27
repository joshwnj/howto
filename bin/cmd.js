#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var minimist = require('minimist');
var defined = require('defined');
var pager = require('default-pager');
var howto = require('../');

var argv = minimist(process.argv.slice(2), {
    alias: { h: 'help', d: 'datadir', p: 'port' }
});

if (argv.help || argv._[0] === 'help') {
    usage(0);
}
else if (argv.showdir) {
    console.log(getdir());
}
else if (argv._[0] === 'server') {
    var hdb = gethdb();
    var server = http.createServer(function (req, res) {
    });
    server.listen(argv.port, function () {
        console.error('listening on :' + server.address().port);
    });
}
else if (argv._[0] === 'read') {
    var hdb = gethdb();
    var r = hdb.createReadStream(argv._[1]);
    r.pipe(process.stdout);
}
else if (argv._[0] === 'show') {
    var hdb = gethdb();
    var r = hdb.createReadStream(argv._[1]);
    r.pipe(pager(function () {
        hdb.close();
    }));
}
else if (argv._[0] === 'edit') {
}
else if (argv._[0] === 'sync') {
}
else if (argv._[0] === 'create') {
    var hdb = gethdb();
    var w = hdb.createWriteStream(argv, function (err, hash) {
        if (err) error(err)
        else console.log(hash)
    });
    process.stdin.pipe(w);
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
    return howto(db, { dir: blobdir });
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

function error (err) {
    console.error(err);
    process.exit(1);
}
