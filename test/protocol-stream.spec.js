'use strict';

var expect = require('expect.js');
var assert = require('assert');
var Readable = require('stream').Readable
var ProtocolStream = require('../lib/protocol-stream'); 

describe('protocol-stream', function () {

  describe('when data is recieved', function () {

    describe('that is a complete response', function () {
      
      var protocolStream, rawStream;

      beforeEach(function () {
        rawStream = new Readable();
        protocolStream = new ProtocolStream();
        rawStream.pipe(protocolStream);
      });

      it('should emit the data', function (done) {
        protocolStream.on('data', function(chunk) {
          expect(chunk).to.be.ok();
          done();
        });  
        rawStream.push('{"x":1}\n\n');
        rawStream.push(null);
      });

      it('should split lines', function (done) {
        protocolStream.on('data', function(chunk) {
          expect(chunk.length).to.be(2);
          done();
        });  
        rawStream.push('foo\nbar\n\n');
        rawStream.push(null);
      });

    });
  });
});
