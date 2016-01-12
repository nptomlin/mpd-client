'use strict';

var util = require('util');

function Command(command, args, callback) {
    this.command = command;
    this.args = args;
    this.callback = callback;
}

Command.prototype.write = function (stream) {
}

Command.prototype.handleResponse = function (data) {
  console.log('here i am');
  console.log(data);
}

function PlaylistInfo(callback) {
  Command.call(this, 'playlistinfo', {}, callback);
}
util.inherits(PlaylistInfo, Command);
 

PlaylistInfo.prototype.write = function (stream) {
  stream.write('playlistinfo\n');
}

module.exports.Command = Command;
module.exports.PlaylistInfo = PlaylistInfo;
