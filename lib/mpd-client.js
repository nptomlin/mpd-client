'use strict';

var net = require('net');
var util = require('util');
var events = require('events');
var Command = require('./command').Command;

var default_port = 6000;
var default_host = '127.0.0.1';

function clone (obj) { return JSON.parse(JSON.stringify(obj || {})); }

function MpdClient (options) {
  options = clone(options);
  events.EventEmitter.call(this);

  this.connection_options = {};
  this.connection_options.port = +options.port || default_port;
  this.connection_options.host = options.host || default_host;
  this._queue = [];  
  this.createStream();
}
util.inherits(MpdClient, events.EventEmitter);

MpdClient.prototype.createStream = function () {
  this.stream = net.createConnection(this.connection_options);
  
  this.stream.once("connect", function () {
    //self.onConnect();
  });

  this.stream.on('data', function (bufferData) {
    //self.processResponse(buffer_data);
    console.log(bufferData.toString());
    console.log('newlines : ' + bufferData.toString().split('\n\n').length);
  });

  this.stream.on('error', function (err) {
    console.log(err);
    //self.onError(err);
  });

  this.stream.on('clientError', function (err) {
    console.log(err);
   //self.onError(err);
  });

  this.stream.once('close', function () {
    console.log('close');
//    self.handleGone('close');
  });

  this.stream.once('end', function () {
    console.log('end');
//    self.handleGone('end');
  });

  this.stream.on('drain', function () {
    console.log('drain');
//    self.drain();
  });
}

MpdClient.prototype.current = function () {
}

MpdClient.prototype.executeCommand = function (command) {
  //command
  //push command and handler to queue
  //write the command to the stream
  this._queue.push(command);
  command.write(this.stream); 
}

exports.createClient = function (options) {
  return new MpdClient(options); 
};

function MpdCommand() {};

MpdCommand.prototype.write = function (stream) {
}
