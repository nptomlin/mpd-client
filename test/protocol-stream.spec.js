'use strict';

var expect = require('expect.js');
var assert = require('assert');
var timers = require('timers');
var Readable = require('stream').Readable
var ProtocolStream = require('../lib/protocol-stream'); 

describe('protocol-stream', function () {


  describe('when data is received', function () {

    describe('that contains multiple responses', function () {
      
      var protocolStream, rawStream;

      beforeEach(function () {
        rawStream = new Readable();
        protocolStream = new ProtocolStream();
        rawStream.pipe(protocolStream);
      });

      it('should emit data for each response', function (done) {
        var count = 0;
        protocolStream.on('data', function(chunk) {
          count++;
          if(count === 2) {
            done();
          }
        });  
        rawStream.push('{"x":1}\nOK\nfoo\nOK\n');
        rawStream.push(null);
      });


      it('should emit data for only each complete response', function (done) {
        var count = 0;
        protocolStream.on('data', function(chunk) {
          count++;
          if(count === 2) {
            done('should not have been called for an incomplete response');
          }
            timers.setTimeout(function() { done(); }, 50);
        });  
        rawStream.push('{"x":1}\nOK\n\n');
        rawStream.push(null);
      });

    });


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
        rawStream.push('{"x":1}\nOK\n');
        rawStream.push(null);
      });

      it('should split lines', function (done) {
        protocolStream.on('data', function(chunk) {
          expect(chunk.length).to.be(3);
          done();
        });  
        rawStream.push('foo\nbar\nOK\n');
        rawStream.push(null);
      });

    });
  });
});
