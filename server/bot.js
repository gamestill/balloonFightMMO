var Conf = require('./botConf.js');
var DataConf = require('./conf/dataConf.js');
var MainConf = require('./gameConf.js');
var STATES = MainConf.BOT_STATES;
var TOTAL_WEIGHT = MainConf.BOT_WEIGHTS_TOTAL;
var STATES_WEI = MainConf.BOT_WEIGHTS;
var W_AT = STATES_WEI['attacking'];
var W_FL = STATES_WEI['flee'];
var W_FR = STATES_WEI['free'];
var W_MU = STATES_WEI['movingup'];
var W_MA = STATES_WEI['awayfromwall'];



var SERVER_COLS_COUNT = MainConf.SERVER_BLOCKS_COUNT;
var TOTAL_BLOCKS_COUNT = SERVER_COLS_COUNT * SERVER_COLS_COUNT;
var worldSize = MainConf.WORLD_SIZE;
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var BW = require("./lib/BinaryWriter.js");
var BR = require("./lib/BinaryReader.js");
var H_WIDTH = 960;
var H_HEIGHT = 540;
var WIDTH = 1920;
var WALL_DIST = 200;
var FMath = require('./fastmath.js');
var fMath = new FMath();
var HEIGHT = 1080;
var REVERSE_DIST = 300;
var PLAYERS_UPTO_DISTANCE = 900 * 900; // in pixels !!!  !!!

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4();
}
var ID_PREFIX = 'kak1923'
var BotSocket = function () {
    this.id = 0;
};
BotSocket.prototype.iamabot321 = 1;

BotSocket.prototype.init = function () {
    var id = guid();
    this.id = ID_PREFIX + '-' + id;
};
BotSocket.prototype.send = function () {

};
BotSocket.prototype.end = function () {

};

var Bot = function () {
    this.player = null;
    this.state = STATES.free;
    this.botSocket = new BotSocket();
    this.m = [0, 0];
    this.now = 0;
    this.fm = null;
    this.dx = 0;
    this.chasingPl = null;
    this.dy = 0;
    this.lastAngleChange = 0;
    this.stateFreeXDir = Math.random() > 0.5 ? 1 : -1;
    this.rStateTime = 1500;
    this.stateAction = this.stateActionFree;
    this.angle = 0;
    this.botName = "";
    this.nearByPlayers = [];
    this.bounds = [0, 0, 0, 0];
    this.lastBounds = [0, 0, 0, 0];
    this.towards = [0, 0, 0, 0];
};
Bot.prototype.init = function () {

    var names = DataConf.BotNames.Names2;
    var rand = Math.floor(Math.random() * (names.length));
    this.botSocket = new BotSocket();
    this.botSocket.init();
    this.botName = names[rand];


    return this.botName;
};
Bot.prototype.setPlayer = function (player, fMath, pos, x, y) {
    this.player = player;
    this.fm = fMath;
    var r1 = x || Math.floor(200 + Math.random() * (worldSize - 200));
    var r2 = y || Math.floor(200 + Math.random() * (worldSize - 200));
    if (pos) {
        this.player.position = [r1, r2];
    }
}

Bot.prototype.withInDist = function (pos) {
    var plPos = this.player.position;
    var dl = (plPos[0] - pos[0]) * (plPos[0] - pos[0]) + (plPos[1] - pos[1]) * (plPos[1] - pos[1]);
    return dl < PLAYERS_UPTO_DISTANCE;
};

Bot.prototype.ChangeState = function (state,allClosePl) {

    if (this.state === state) {
        return;
    }
    // previous state speeding
    if (state === STATES.attacking) {
        var rand = fMath.getRandom(0,allClosePl.length);
        this.chasingPl = allClosePl[rand];
        this.stateAction = this.stateActionAttack;
    } else if (state === STATES.awayfromwall) {
        this.stateAction = this.stateActionAway;
    } else if (state === STATES.free) {
        this.stateAction = this. stateActionFree;
    } else if (state === STATES.flee) {
        this.stateAction = this.stateActionFlee;
    } else if (state === STATES.movingup) {
        this.stateAction = this.stateActionMoveUp;
    }
    this.state = state;
};

Bot.prototype.closeToWall = function () {
    var pos = this.player.position;
    if (pos[1] > (worldSize - WALL_DIST * 1.5)) {

        return [0, -1, -1];
    }
    if (pos[0] < WALL_DIST && this.player.vel[0] <= 0) {
        return [1, 0];
    }
    if (pos[0] > (worldSize - WALL_DIST) && this.player.vel[0] >= 0) {
        return [-1, 0];
    }
    if (pos[1] < WALL_DIST && this.player.vel[1] <= 0) {

        return [0, 1];
    }

    return [];
};
Bot.prototype.calcInput = function (param) {
    var sblocks = param[0],
        newState = 0,
        closeToWall = false,
        allPlayers = param[1],
        mapper = param[2],
        arr = [],
        inp = [],
        pos = this.player.position,
        pl = null,
        allClosePl = [],
        chosenPlIndex = -1,
        chosenPlayer = null;

    this.updateNearbyPlayers(sblocks);

    for (var i = 0; i < this.nearByPlayers.length; i++) {
        pl = allPlayers[mapper[this.nearByPlayers[i]]];
        if (pl && pl.pid !== this.player.pid && this.withInDist(pl.position)) {
            allClosePl.push(pl);
        }
    }
    var ctowall = this.closeToWall();

    var state = this.state;
    var sum = 0;
    var free = true;
    var nearWall = ctowall.length > 0 ? W_MA : 0; // max 10
    var closePl = allClosePl.length > 0 ? W_AT : 0; // max 50
    var flee = allClosePl.length > 0 ? W_FL : 0; // max 30
    var sinking = ctowall.length > 2 ? W_MU : 0; // max 30
    this.stateFreeXDir = Math.random() > 0.5 ? 1 : -1;
    if (sinking) {
        nearWall = 0;
        closePl = 0;
        flee = 0;
        free = false;
        state = STATES.movingup;
    }
    if (!sinking && !flee && !closePl && !nearWall) {
        free = true;
        state = STATES.free;
        if(nearWall){
            state =STATES.awayfromwall;
        }
    }
    else{
        state = STATES.attacking;
    }
    // else{
    //     if (Math.random()> 0.3) {   
    //         state = STATES.attacking;
    //     }else{
    //         state = STATES.flee;
    //     }
    
    // }
    this.ChangeState(state,allClosePl);

};


Bot.prototype.stateActionFree = function () {
  
    var no = 0 + Math.random() * 30;
    var yno = 0;
    var xno = 0;
    if (no < 10) {    
       yno = -35;
       this.player.balloonPowerOnFlag = true;
       this.player.leftArrowRec = true;
       xno = -this.stateFreeXDir * 10;
    }
    else if (no < 29) {
        this.player.balloonPowerOffFlag = true;
        this.player.rightArrowRec = true;
        xno = this.stateFreeXDir * 10;
    } else {
        this.player.balloonPowerOffFlag = true;
        this.player.leftArrowRec = true;
        xno = -this.stateFreeXDir * 10;
    }
    this.player.vel[0] += xno;
    this.player.vel[1] += yno;
};
Bot.prototype.stateActionAttack = function () {
    //   console.log('attacking');
    if(this.chasingPl){
        this.player.balloonPowerOnFlag = true;
        var yDist = (this.player.position[1] - this.chasingPl.happyPos[1])>0?-1:0;
       // console.log(yDist);
        this.player.vel[1] += yDist*20;
//        console.log('chasing:' + this.chasingPl.position[0]);
    }
};
Bot.prototype.stateActionFlee = function () {
    this.player.balloonPowerOffFlag = true;
    //   console.log('fleeeing');
};
Bot.prototype.stateActionAway = function () {
    this.player.balloonPowerOffFlag = true;
    //  console.log('moving away from wall');
};
Bot.prototype.stateActionMoveUp = function () {
    this.player.balloonPowerOnFlag = true;
    this.player.vel[1] -= 20;
};
Bot.prototype.empty = function () {
    this.player.balloonPowerOffFlag = true;
}
Bot.prototype.update = function () {
    this.stateAction();
};
Bot.prototype.updateBounds = function () {
    // this.bounds[0] = this.player.position[0];
    // this.bounds[1] = this.player.position[1];
    // this.bounds[2] = worldSize - this.bounds[0];
    // this.bounds[3] = worldSize - this.bounds[1];

    // for (var i = 0; i < 4; i++) {
    //     this.towards[i] = 0;
    //     if (this.bounds[i] > this.lastBounds[i]) {
    //         this.towards[i] = 0;
    //     }
    // }
    // this.lastBounds = this.bounds;
};

Bot.prototype.updateNearbyPlayers = function (sblocks) {
    var block = this.player.currBlock;
    var bindex = [];
    this.nearByPlayers = [];
    if (block < 0) {
        return [];
    } else {
        bindex = [block - SERVER_COLS_COUNT - 1, block - SERVER_COLS_COUNT, block - SERVER_COLS_COUNT + 1,
            block - 1, block + 1, block,
            block + SERVER_COLS_COUNT - 1, block + SERVER_COLS_COUNT, block + SERVER_COLS_COUNT + 1
        ];
        for (var i = 0; i < bindex.length; i++) {
            if (sblocks.blocks[bindex[i]]) {
                this.nearByPlayers = this.nearByPlayers.concat(sblocks.blocks[bindex[i]].getPlayers());
            }
        }
    }
};

Bot.prototype.input = function (param, now) {
    this.now = now;
    // this.updateBounds();
    this.calcInput(param);

}


module.exports = Bot;