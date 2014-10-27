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

var createWriteStream = WikiDB.prototype.createWriteStream;
var _replicate = WikiDB.prototype._replicate;

MD.prototype.createWriteStream = function (meta, opts, cb) {
    var self = this;
    var stream = through();
    stream.pipe(concat(function (body) {
        var docmeta = parseMeta(body);
        var wmeta = xtend(docmeta, meta);
        var w = createWriteStream.call(self, wmeta, opts, cb);
        w.end(body);
    }));
    return writeonly(stream);
};

MD.prototype._replicate = function (opts, cb) {
    var ex = _replicate.call(this, opts, function () {
        if (cb) cb.apply(this, arguments);
        ex.close();
    });
    return ex;
};
