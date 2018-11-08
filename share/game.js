//Game.js
//Contains update loops for the client side


var SRCONF = require('../server/gameConf.js').RATE;
var CONF = require('./gameConf.js');
var gameloop = require('../server/gameloop.js');

var Game = function (fps, name, liveroom) {
    this.onUpdate = function (delta) {};
    this.onUpdateSlow = function (delta) {};
    this.isRunning = false;
    this.servSlow = null;
    this.servFast = null;
    this.servLoop = null;
    this.liveRoom = liveroom;
    this.name = name;
};
Game.prototype.stopServerLoops = function () {

    if (this.servSlow !== undefined) {
        gameloop.clearGameLoop(this.servSlow);
        gameloop
    }

    if (this.servFast !== undefined) {
        gameloop.clearGameLoop(this.servFast);
    }
};

Game.prototype.Running = function () {
    return this.isRunning;
};

Game.prototype.allSet = function () {
    this.servFast = gameloop.setGameLoop(this.onUpdate.bind(this.liveRoom), 1000.0 / SRCONF.LOOP_FAST_RATE);
    this.servSlow = gameloop.setGameLoop(this.onUpdateSlow.bind(this.liveRoom), 1000.0 / SRCONF.LOOP_SLOW_RATE);
}

Game.prototype.startGame = function (gameloop) {
    this.isRunning = true;
};

module.exports = Game;