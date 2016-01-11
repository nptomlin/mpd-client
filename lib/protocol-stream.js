'use strict';

var util = require('util');
var Transform = require('stream').Transform;

function ProtocolStream () {
  Transform.call(this, { objectMode:true });
  this._sawFirstCr = false;
  this._rawChunks = [];
}
util.inherits(ProtocolStream, Transform);

ProtocolStream.prototype._transform = function (chunk, encoding, done) {
  // check for a \n\n for the end of command and emit this
  var split = -1;
  for (var i = 0; i < chunk.length; i++) {
    if (chunk[i] === 10) { // '\n'
      if (this._sawFirstCr) {
        split = i;
        var h = chunk.slice(0, split -1);
        this._rawChunks.push(h);
        this.push(Buffer.concat(this._rawChunks).toString().split('\n'));
        this.rawChunks = [];
        this._sawFirstCr = false;
      } else {
        this._sawFirstCr = true;
      }
    } else {
      this._sawFirstCr = false;
    }
  }

  if (split === -1) {
    this.__rawChunks.push(chunk);
  } else {
    var remaining = chunk.slice(0, split -1);
    this._rawChunks.push(remaining);
  }
  done();
};

module.exports = ProtocolStream;
