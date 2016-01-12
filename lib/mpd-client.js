'use strict';

var net = require('net');
var util = require('util');
var events = require('events');
var command = require('./command');
var ProtocolStream = require('./protocol-stream');
var default_port = 6000;
var default_host = '127.0.0.1';

function clone (obj) { return JSON.parse(JSON.stringify(obj || {})); };

function MpdClient (options) {
  options = clone(options);
  events.EventEmitter.call(this);

  this.connection_options = {};
  this.connection_options.port = +options.port || default_port;
  this.connection_options.host = options.host || default_host;
  this._queue = [];  
  this.createStream();
};
util.inherits(MpdClient, events.EventEmitter);

MpdClient.prototype.createStream = function () {
  var self = this;

  this.socketStream = net.createConnection(this.connection_options);
  this.stream = new ProtocolStream();
//  this.socketStream.pipe(this.stream);

  this.socketStream.once("connect", function () {});

  this.socketStream.on('data', function (data) {
    //self.processResponse(data);
    console.log('here');
    console.log(data);
  });

  this.socketStream.on('error', function (err) {
    console.log(err);
    //self.onError(err);
  });

  this.socketStream.on('clientError', function (err) {
    console.log(err);
   //self.onError(err);
  });

  this.socketStream.once('close', function () {
    console.log('close');
  });

  this.socketStream.once('end', function () {
    console.log('end');
//    self.handleGone('end');
  });

  this.socketStream.on('drain', function () {
    console.log('drain');
//    self.drain();
  });

};

MpdClient.prototype.current = function () {
};

MpdClient.prototype.executeCommand = function (command) {
  //command
  //push command and handler to queue
  //write the command to the stream
  this._queue.push(command);
  command.write(this.socketStream); 
};

MpdClient.prototype.processResponse = function (data) {
  var command = this._queue.shift();
  if(command !== null && command !== undefined) {
    command.handleResponse(data);
  }
};

MpdClient.prototype.getPlaylistInfo = function (callback) { 
  this.executeCommand(new command.PlaylistInfo(callback));
};

exports.MpdClient = MpdClient;
exports.createClient = function (options) {
  return new MpdClient(options); 
};

