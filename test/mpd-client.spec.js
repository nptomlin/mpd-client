'use strict';

var expect = require('expect.js');
var MpdClient = require('../lib/mpd-client').MpdClient;
var command = require('../lib/command');

describe('mpd client', function() {

  describe('a clients getPlaylistInfo function is called', function() {
   
    var client;
 
    beforeEach(function() {
      MpdClient.prototype.createStream = function(){};
      client = new MpdClient();
    });

    it('should execute the playlist command', function() {
      var actualCommand;
      client.createStream = function(){};
      client.executeCommand = function (command) {
        actualCommand = command;
      }
      client.getPlaylistInfo(function(err, response){});
      expect(actualCommand).to.be.ok();
      expect(actualCommand).to.be.a(command.PlaylistInfo);
    });

  });

});
