var inherits = require('inherits');
var WikiDB = require('wikidb');
var through = require('through2');
var split = require('split');
var concat = require('concat-stream');
var xtend = require('xtend');
var writeonly = require('write-only-stream');
var parseMeta = require('./lib/meta.js');

inherits(Howto, WikiDB);
module.exports = Howto;

function Howto (db, opts) {
    if (!(this instanceof Howto)) return new Howto(db, opts);
    WikiDB.call(this, db, opts);
}

Howto.prototype.createWriteStream = function (meta, cb) {
    var self = this;
    var stream = through();
    stream.pipe(concat(function (body) {
        var docmeta = parseMeta(body);
        var wmeta = xtend(docmeta, meta);
        var w = WikiDB.prototype.createWriteStream.call(self, wmeta, cb);
        stream.pipe(w);
    }));
    return writeonly(stream);
};
