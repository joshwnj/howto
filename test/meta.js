var parse = require('../lib/meta.js');
var test = require('tape');

test('meta parser', function (t) {
    t.plan(1);
    var meta = parse('# beep\n\nboop\n\n[yo](tag:hey)\n'
        + '[another](http://example.com) thing'
        + '[woo](tag:woop) thing'
    );
    t.deepEqual(meta, {
        key: 'beep',
        tags: [ 'hey', 'woop' ]
    });
});
