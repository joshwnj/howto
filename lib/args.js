#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var minimist = require('minimist');
var defined = require('defined');
var pager = require('default-pager');
var editor = require('editor');
var osenv = require('osenv');
var modwiki = require('../');
var mserver = require('../lib/server.js');

module.exports = function (level, args, opts) {
    if (!opts) opts = {};
    var $0 = opts.$0 || 'modwiki';
    
    var argv = minimist(args, {
        alias: { h: 'help', d: 'datadir', p: 'port' }
    });
    
    if (argv.help || argv._[0] === 'help') {
        usage(0);
    }
    else if (argv._[0] === 'server') {
        // TODO
    }
    else if (argv._[0] === 'read') {
        var hdb = gethdb();
        var r = hdb.createReadStream(argv._[1]);
        r.pipe(process.stdout);
    }
    else if (argv._[0] === 'browse') {
        var hdb = gethdb();
        var r = hdb.createReadStream(argv._[1]);
        r.pipe(process.stdout);
    }
    else if (argv._[0] === 'show') {
        var hdb = gethdb();
        var r = hdb.createReadStream(argv._[1]);
        r.pipe(pager(function () {
            hdb.db.close();
        }));
    }
    else if (argv._[0] === 'edit') {
        var hash = argv._[1];
        if (!hash) return error('usage: ' + $0 + ' edit HASH');
        var tmpfile = path.join(osenv.tmpdir(), 'modwiki-' + Math.random());
        
        var hdb = gethdb();
        var w = fs.createWriteStream(tmpfile);
        var r = hdb.createReadStream(hash);
        w.on('close', function () {
            editor(tmpfile, function (code, sig) {
                if (code !== 0) return process.exit(code);
                
                var opts = { prev: hash }
                var w = hdb.createWriteStream(opts, function (err, key) {
                    if (err) return error(err)
                    console.log(key);
                    hdb.db.close();
                });
                fs.createReadStream(tmpfile).pipe(w);
            });
        });
        r.pipe(w);
    }
    else if (argv._[0] === 'sync' || argv._[0] === 'pull' || argv._[0] === 'push') {
        var hdb = gethdb();
        var d = hdb.replicate({ mode: argv._[0] }, function (err) {
            if (err) error(err)
            else hdb.db.close()
        });
        process.stdin.pipe(d).pipe(process.stdout);
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
        hdb.search(argv._.slice(1)).on('data', function (row) {
            console.log('# ' + row.key);
            console.log('hash: ' + row.hash + '\n');
        });
    }
    else if (argv._[0] === 'recent') {
        var hdb = gethdb();
        hdb.recent().on('data', function (row) {
            console.log('# ' + row.meta.key );
            console.log('hash: ' + row.hash);
            console.log('tags:', row.meta.tags);
            console.log('date: ' + new Date(row.meta.time));
            console.log();
        });
    }
    else if (argv._[0] === 'heads') {
        var key = argv._.slice(1).join(' ');
        if (!key) error('usage: ' + $0 + ' heads KEY');
        var hdb = gethdb();
        hdb.heads(key).on('data', function (row) {
            console.log(row.hash);
        });
    }
    else usage(1);
    
    function usage (code) {
        var file = path.join(__dirname, '../bin/usage.txt');
        fs.readFile(file, function (err, src) {
            if (err) return error(err);
            console.log(src.toString('utf8').replace(/\$0/g, $0));
        });
    }
    
    function gethdb () {
        var dir = getdir();
        var blobdir = path.join(dir, 'blob');
        mkdirp.sync(blobdir);
        
        var db = level(path.join(dir, 'db'));
        return modwiki(db, { dir: blobdir });
    }
    
    function getdir () {
        var dir = defined(
            opts.datadir,
            argv.datadir,
            process.env.HOWTO_PATH
        );
        if (!dir) {
            dir = defined(process.env.HOME, process.env.USERDIR);
            if (dir) dir = path.join(dir, '.config', $0);
        }
        if (!dir) dir = process.cwd();
        return dir;
    }
}

function error (err) {
    console.error(err);
    process.exit(1);
}
