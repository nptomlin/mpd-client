'use strict';

var util = require('util');

function Command(command, args, callback) {
    this.command = command;
    this.args = args;
    this.callback = callback;
}

Command.prototype.write = function (stream) {
}

Command.prototype.parseResponse = function (buffer) {
}

function PlaylistInfo(command, args, callback) {
  Command.call(this, command, args, callback);
}
util.inherits(PlaylistInfo, Command);
 

PlaylistInfo.prototype.write = function (stream) {
  stream.write('playlistinfo\n');
}

module.exports.Command = Command;
module.exports.PlaylistInfo = PlaylistInfo;
