var stream = require('stream');
var util = require('util');

if (!stream.Transform)
  stream = require('readable-stream');

var matchstick = require('matchstick');

function LineParse(options) {
  if (!(this instanceof LineParse))
    return new LineParse(options);

  options = util._extend({
    decodeStrings: false,
    encoding: 'utf8',
  }, options);

  options.objectMode = true;

  stream.Transform.call(this, options);

  this._patterns = [];
}
util.inherits(LineParse, stream.Transform);

LineParse.prototype._transform = function LineParseTransform(chunk, encoding, done) {
  for (var i = 0; i < this._patterns.length; i++) {
    var p = this._patterns[i];
    var m = p.match(chunk);
    var r = true;
    if (m)
      r = p.cb.call(this, p.matches);
    if (r === false)
      break;
  }
  done();
};

LineParse.prototype.match = function LineParseMatch(pattern, style, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = undefined;
  }

  if (typeof style === 'function') {
    cb = style;
    style = undefined;
  }

  var m = matchstick(pattern, style || 'strict');
  m.cb = cb;
  this._patterns.push(m);
  return this;
};

module.exports = LineParse;
