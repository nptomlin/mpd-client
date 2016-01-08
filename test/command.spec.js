'use strict';

var expect = require('expect.js');
var assert = require('assert');
var PassThrough = require('stream').PassThrough;
var PlaylistInfo = require('../lib/command').PlaylistInfo; 

describe('commands', function () {

  describe('the playlist command', function () {
      
    describe('when write is called', function () {

      var outputStream, playlistInfo;

      beforeEach(function () {
        outputStream = new PassThrough();
        playlistInfo = new PlaylistInfo();
      });

      it('should call the stream', function (done) {
        outputStream.on('data', function(chunk) {
          expect(chunk).to.be.ok();
          done();
        });
        playlistInfo.write(outputStream);
      });

    });
  });
});
