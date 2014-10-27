var parse = require('../lib/meta.js');
var test = require('tape');

test('meta parser', function (t) {
    t.plan(3);
    
    var meta = parse('# beep\n\nboop\n\n[yo](tag:hey)\n'
        + '[another](http://example.com) thing'
        + '[woo](tag:woop) thing'
    );
    t.deepEqual(meta, {
        key: 'beep',
        tags: [ 'hey', 'woop' ]
    });
    
    t.deepEqual(
        parse('# [beep](example.com)\n'),
        { key: 'beep', tags: [] }
    );
    
    t.deepEqual(
        parse('#  [beep](example.com)  [boop](wizard.institute) \n'),
        { key: 'beep boop', tags: [] }
    );
});
