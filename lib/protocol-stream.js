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
  // check for a \n\n
  var split = -1;
  for (var i = 0; i < chunk.length; i++) {
    if (chunk[i] === 10) { // '\n'
      if (this._sawFirstCr) {
        split = i;
        break;
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
    var h = chunk.slice(0, split -1);
    this._rawChunks.push(h);
    var header = Buffer.concat(this._rawChunks).toString();
    this.push(header.split("\n"));
    this._rawChunks = [];
    this._rawChunks.push(chunk.slice(split));
  }
  done();
};

module.exports = ProtocolStream;
