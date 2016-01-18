'use strict';

var util = require('util');
var Transform = require('stream').Transform;

function ProtocolStream () {
  Transform.call(this, { objectMode:true });
  this._sawFirstCr = false;
  this._rawChunks = [];
  this._body = []
}
util.inherits(ProtocolStream, Transform);

ProtocolStream.prototype._transform = function (chunk, encoding, done) {
  // check for a \n\n for the end of command and emit this
  //console.log('got chunk');
  var i = 0;
  while (i < chunk.length) {
    if (chunk[i] === 10) { // '\n'
        var h = chunk.slice(0, i); //lose the \n
        this._rawChunks.push(h);
        var line = Buffer.concat(this._rawChunks).toString();
        this._body.push(line);
        const OK = /^OK$/;
        if(OK.test(line) == true) {
          //console.log('got ok');
          this.push(this._body);
          this._body = [];
        }
        chunk = chunk.slice(i + 1);
        this._rawChunks = [];
        i = 0;
    } else {
      i++;
    }
  }

  if (chunk.length > 0) {
    this._rawChunks.push(chunk);
  }
  done();
};

module.exports = ProtocolStream;
