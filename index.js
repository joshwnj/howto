var inherits = require('inherits');
var WikiDB = require('wikidb');

inherits(Howto, WikiDB);
module.exports = Howto;

function Howto (db) {
    if (!(this instanceof Howto)) return new Howto(db);
    WikiDB.call(this, db);
}
