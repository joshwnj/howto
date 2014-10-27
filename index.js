var inherits = require('inherits');
var WikiDB = require('wikidb');
var through = require('through2');
var split = require('split');
var concat = require('concat-stream');
var xtend = require('xtend');
var writeonly = require('write-only-stream');
var parseMeta = require('./lib/meta.js');

inherits(MD, WikiDB);
module.exports = MD;

function MD (db, opts) {
    if (!(this instanceof MD)) return new MD(db, opts);
    WikiDB.call(this, db, opts);
}

MD.prototype.createWriteStream = function (meta, cb) {
    var self = this;
    var stream = through();
    stream.pipe(concat(function (body) {
        var docmeta = parseMeta(body);
        var wmeta = xtend(docmeta, meta);
        var w = WikiDB.prototype.createWriteStream.call(self, wmeta, cb);
        w.end(body);
    }));
    return writeonly(stream);
};
