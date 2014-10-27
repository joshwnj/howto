var lex = require('marked').lexer;

module.exports = function (src) {
    var parsed = lex(src);
    var meta = { tags: [] };
    for (var i = 0; i < parsed.length; i++) {
        var p = parsed[i];
        if (p.type === 'heading' && meta.key === undefined) {
            meta.key = scrub(p.text);
        }
        if (p.text) scan(p.text);
    }
    return meta;
    
    function scan (s) {
        var m = s.match(/\[[^\]]+\]\(tag:[^\)]+\)/g);
        if (!m) return;
        for (var i = 0; i < m.length; i++) {
            var tagm = /\[[^\]]+\]\(tag:([^\)]+)\)/.exec(m[i]);
            if (tagm) meta.tags.push(tagm[1]);
        }
    }
};

function scrub (s) {
    return s;
}
