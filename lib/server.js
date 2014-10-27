var VERSION = require('../package.json').version;
var routes = require('routes');
var through = require('through2');

module.exports = function (mdb) {
    var router = routes();
    
    router.addRoute('/', function (req, res, params) {
        res.setHeader('content-type', 'text/plain');
        res.end('modwiki server version ' + VERSION + '\n');
    });
    
    router.addRoute('/replicate', function (req, res, params) {
        res.setHeader('content-type', 'multipart/octet-stream');
        req.pipe(mdb.replicate(params)).pipe(res);
    });
    
    router.addRoute('/read/:hash', function (req, res, params) {
        res.setHeader('content-type', 'text/plain');
        mdb.createReadStream(params.hash).pipe(res);
    });
    
    router.addRoute('/recent', function (req, res, params) {
        res.setHeader('content-type', 'application/ndjson');
        mdb.recent(params).pipe(ndjson()).pipe(res);
    });
    
    router.addRoute('/search/:terms', function (req, res, params) {
        res.setHeader('content-type', 'application/ndjson');
        mdb.search(params.terms).pipe(ndjson()).pipe(res);
    });
    
    return function (req, res) {
        var m = router.match(req.url);
        if (!m) return false;
        m.fn(req, res, m.params);
        return true;
    };
};

function ndjson () {
    return through.obj(function (row, enc, next) {
        this.push(JSON.stringify(row) + '\n');
        next();
    });
}
