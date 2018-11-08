var EventEmitter = require('events').EventEmitter;
var BW = require("./lib/BinaryWriter.js");
var BR = require("./lib/BinaryReader.js");
var HappyFaceManager = require('./happyface.js');
var util = require('util');
var Conf = require('./gameConf.js');
var SCORE_INC_FOR_CWP = Conf.SCORE_INC_FOR_CWP;
var SCORE_INC_FOR_CWP_BAR = Conf.SCORE_INC_FOR_CWP_BAR;
var SCORE_INC_FOR_DOT_EATEN = Conf.SCORE_INC_FOR_DOT_EATEN;
var SCORE_INC_FOR_KILL = Conf.SCORE_INC_FOR_KILL;
var SCORE_INC_FOR_KILL_BAR = Conf.SCORE_INC_FOR_KILL_BAR;
var waterDepth = Conf.waterDepth;
var PI = Math.PI;
var POWER_REQ_TO_ATTACK = Conf.POWER_REQ_TO_ATTACK;
var TWOPI = Math.PI * 2;
var PL_FOOD_RAD = Conf.PL_FOOD_RAD;
var BALLON_RAD = Conf.BALOON_RAD;
var PL_REAL_RAD = Conf.PL_REAL_RAD;
var PL_LEGS_RAD = PL_REAL_RAD / 2;
var MAX_TAG_LENGTH = Conf.MAX_TAG_LENGTH;
var FMath = require('./fastmath.js');
var fMath = new FMath();
var SAT = require('./sat.js');
var SV = SAT.Vector;
var SC = SAT.Circle;
var S_R = SAT.Response;
var SP = SAT.Polygon;
var CIC = SAT.testCircleCircle;
var PIC = SAT.pointInCircle;
var worldSize = Conf.WORLD_SIZE;
var COMBO_AWARD = 100;
var Rect = require('./lib/Rect.js');
var BotScript = require('./bot.js');
var SPACE_MULT = 1.6;
var KILL_RESET_TIME = Conf.COMBO_TIME;
var SPEED_BAR_MAX = Conf.POWER_BAR_MAX;
var BASE_SPEED_BAR_MAX = SPEED_BAR_MAX[0];
var MAX_POWER_LEVEL = SPEED_BAR_MAX.length;
var PlayerServ = function (belly, chat, ww, wh, ctime, bot, pid, fpt, id, pos, pname, skin, face, weaponColor,teamNo) {
    var $this = this;
    this.belly = belly;
    this.teamNo = teamNo;
    this.speed2x = 1;
    this.currentMaxPower = BASE_SPEED_BAR_MAX;
    this.powerLevel = 1;
    this.powerLevelChangeFlag = false;
    this.currSpeedPower = 450;
    this.chat = chat;
    this.toSendMsg = null;
    this.kills = 0;
    this.deadOn = false;
    this.lastRank  = 30;
    this.deadCounter = 0;
    this.mouseDownTime = 0;
    this.ballonPoppedFlag = false;
    this.topPosition = 999;
    this.fanCollOn = true;
    this.endData = {
        'kills': 0,
        'killedby': 0,
        'ckills': 0,
        'score': 0,
        'topposition': 999,
        'deaths:': 0
    };
    this.resetSpeed = Conf.PLA_SP_BASIC;
    this.rightArrowRec = 0;
    this.leftArrowRec = 0;
    this.mouseDown = false;
    this.sleeping = false;
    this.wColor = weaponColor;
    this.currAccX = Conf.PLA_ACC_BASIC_X;
    this.currAccY = Conf.PLA_ACC_BASIC_Y;
    this.position = [
        pos[0],
        pos[1]
    ];
    this.rClick = false;
    this.mouseCalled = false;
    this.happyPos = [pos[0],pos[1]];
    this.legsPos = [pos[0], pos[1]];
    this.savedPeople = [];
    this.vel = [0, 0];
    this.face = ('' + face).trim();
    this.killFlag = null;
    this.botScript = bot;
    this.deadFlagFn = null;
    this.deadFlagFn2 = null;
    this.deadBFunc = null;
    this.processInput = this.processInputP;
    if (bot) { 
        bot.setPlayer(this, fMath, true, pos[0], pos[1]);
        this.processInput = this.processInputB;
    }
    this.lifeTime = 0;
    this.deathCount = 0;
    this.collWithPlayer = 0;
    this.combokills = 0;
    this.dotsEaten = 0;
    this.score = 0;
    this.screenRect = new Rect(0, 0, 0, 0);
    this.pid = pid;
    this.killTime = 0;
    this.blockNo = -1;
    this.range = [];
    this.enterColl = [];
    this.toSendExColl = [];
    this.toSendEnColl = [];
    this.comboStartKills = 0;
    this.lastKillTime = 0;
    this.exitColl = [];
    this.networkBull = [];
    this.networkBullR = [];
    this.lDown = false;
    this.rDown = false;
    this.spaceDown = false;
    this.totalComboKills = 0;
    this.toSendBlock = 64000;
    this.currBlock = 64000;
    this.lastBlock = 64000;
    this.powerMultiplier = 1;
    this.deadSpec = false;
    this.followPl = this;
    this.fpt = fpt;
    PlayerServ.prototype.MAX_COORD = Conf.WORLD_SIZE;

    this.clientTime1 = ctime;
    this.servLogTime1 = 0;
    this.clientTime_spec = 0;
    this.plStartTime = fMath.clockMilli(fpt);
    this.ww = ww; // window width
    this.wh = wh; // window height
    this.packetSentTime = 0;

    this.inputPackNumber = 0;
    this.outPackNumber = 0;
    this.deadSock = null;
    this.name = "" + pname;
    this.id = id;
    this.maxSpeed_N = Conf.PLA_SP_BASIC;
    this.skin = skin;

    this.node = null;
    this.node_legs = null;
    this.happyNode = null;
    this.dead = false;
    this.popped = false;

    this.legRadius = PL_REAL_RAD - PL_REAL_RAD / 3;
    this.happyRadius = BALLON_RAD;
    this.realRadius = PL_REAL_RAD;

    this.vec = new SV(this.position[0] - PL_REAL_RAD, this.position[1] - PL_REAL_RAD);
    this.foodCollider = new SC(this.vec, PL_FOOD_RAD);
    this.realCollider = new SC(this.vec, PL_REAL_RAD);
    this.legCollider = new SC(new SV(this.position[0] - PL_LEGS_RAD, this.position[1] - PL_LEGS_RAD), PL_LEGS_RAD)
    this.happyCollider = new SC(new SV(this.position[0] - BALLON_RAD, this.position[1] - BALLON_RAD), BALLON_RAD);
    util.inherits(PlayerServ, EventEmitter);
    this.getColor = function () {
        return this.skin;
    };

    this.init();
    this.servEmpty = function(now,delta){

    };
    this.servUpdate2 = function (now, delta) {
        this.lifeTime += delta;
        this.processInput(delta);
        return this.limitInBoundary();
    };
    
    this.plUpdate = function (now, delta) {
        this.lifeTime += delta;
    
        if (!this.deadOn) {
            if (this.lifeTime > 3) {
                this.deadOn = true;
                this.servUpdate = this.servUpdate2;
            }
        }
        this.processInput(delta);
        return this.limitInBoundary();
    };
    this.servUpdate = this.plUpdate;
};

module.exports.worldSize = Conf.WORLD_SIZE;
module.exports.player = PlayerServ;

PlayerServ.prototype.init = function () {

};
PlayerServ.prototype.respawn = function(){
    this.currentMaxPower = BASE_SPEED_BAR_MAX;
    this.powerLevel = 1;
    this.score = 0;
    this.currSpeedPower = 450;
    this.vel[0] = 0;
    this.vel[1] = 0;
    this.currAccX = Conf.PLA_ACC_BASIC_X;
    this.currAccY = Conf.PLA_ACC_BASIC_Y;
    this.maxSpeed_N = Conf.PLA_SP_BASIC;
    
}
PlayerServ.prototype.addBullet = function(id){
    this.networkBull.push(id);
};

PlayerServ.prototype.fuelTaken = function (val) {
    this.dotsEaten += val;
    this.belly.foodInBelly += val;
    this.incPowerBar(5);
    this.score += val;
};

PlayerServ.prototype.resetMyDataSoItsNotSentToOthers = function () {
    this.toSendEnColl = [];
    this.toSendBlock = 64000;

    this.toSendExColl = [];
    this.lastBlock = this.currBlock;
};

PlayerServ.prototype.resetFrameData = function () {
    this.lastBlock = this.currBlock;
};

// runs after the main client packet is sent
PlayerServ.prototype.repeatMsgSent = function () {
    console.log('repeat msg:' + this.id);
};

PlayerServ.prototype.setTopPos = function (pos) {
    this.topPosition = 999;
    var p1 = pos + 1;
    if (p1 < 0) {
        return;
    }

    if (p1 < this.topPosition) {
        this.topPosition = p1;
    }
};

PlayerServ.prototype.incPowerBar = function(val){
    this.currSpeedPower +=val;
    var oldPower = this.powerLevel;
    if(this.powerLevel>0 && this.currSpeedPower> SPEED_BAR_MAX[this.powerLevel-1] ){
        this.powerLevel++;
       
    }
    
    else if(this.powerLevel>1 &&  this.currSpeedPower<SPEED_BAR_MAX[ this.powerLevel-2]){
        this.powerLevel--;
    }

    this.powerLevel= Math.min(MAX_POWER_LEVEL,Math.max(1,this.powerLevel));
    if(this.powerLevel!== oldPower && !this.botScript){
       this.powerLevelChangeFlag = true;
    }
    var index  = this.powerLevel -1;
    var currMaxPower = SPEED_BAR_MAX[index];
    this.currSpeedPower = Math.min(currMaxPower , Math.max(0, this.currSpeedPower));

};

PlayerServ.prototype.powerUse = function () {
    this.incPowerBar(-1);
    if (this.currSpeedPower <= 0) {
        this.currAccX = Conf.PLA_ACC_BASIC_X;
        this.currAccY = Conf.PLA_ACC_BASIC_Y;
        this.currSpeedPower = 0;
        this.powerMultiplier = 1;
    }
};

PlayerServ.prototype.cwp = function (by) {
    this.collWithPlayer++;
};

PlayerServ.prototype.updateNode = function (qt) {
    var pos = this.position;
    var hPos = this.happyPos;
    var lPos = this.legsPos;
    var r = this.realRadius;
    var lr = this.legRadius;
    var hr = this.happyRadius;
    if (this.node) {
        qt.remove(this.node);
        this.node = null;
    }
    if (this.node_legs) {
        qt.remove(this.node_legs);
        this.node_legs = null;
    }
    if (this.happyNode) {
        qt.remove(this.happyNode);
        this.happyNode = null;
    }
    this.happyNode = {
        bound: {
            minx: hPos[0] - hr,
            miny: hPos[1] - hr,
            maxx: hPos[0] + hr,
            maxy: hPos[1] + hr
        },
        id: this.pid,
        type: Conf.ITEM_TYPES.BALL
    }
    this.node = {
        bound: {
            minx: pos[0] - r,
            miny: pos[1] - r,
            maxx: pos[0] - r,
            maxy: pos[1] + r
        },
        id: this.pid,
        type: Conf.ITEM_TYPES.PLAYER
    };
    this.node_legs = {
        bound: {
            minx: pos[0] - r / 2,
            miny: pos[1] + r / 10,
            maxx: pos[0] + r / 2,
            maxy: pos[1] + r
        },
        id: this.pid,
        type: Conf.ITEM_TYPES.PLAYER_LEGS
    }

    qt.insert(this.happyNode);
    qt.insert(this.node);
    qt.insert(this.node_legs);
};

PlayerServ.prototype.reducMassAuto = function () {

    this.mass -= 1;
};

PlayerServ.prototype.getlastPackTime = function () {
    return this.packetSentTime;
}

PlayerServ.prototype.attack = function(){
    if(this.currSpeedPower>POWER_REQ_TO_ATTACK){
       this.incPowerBar(-POWER_REQ_TO_ATTACK);
        var x = fMath.getRandom(-110,-155);
        var xx = fMath.getRandom(110,155);
        var xxx = Math.random()>0.5?x:xx;
        this.vel[1] -=200;
        this.vel[0] -= xxx;    
        return true;
    }
    return false;
};

PlayerServ.prototype.slowLoop = function (_now,counter) {
    var ni = 0;
    var inc = 100;
    this.packetSentTime = _now;

    this.powerLevelChangeFlag = false;
    this.outPackNumber++;

    if (!this.fanCollOn) {
        this.fanCollOn = true;
        this.maxSpeed_N = this.resetSpeed;
    }
  
    var delKillTime = this.lifeTime - this.killTime;
    if (!this.botScript) {
        if(delKillTime>KILL_RESET_TIME && this.comboStartKills>0){
            if(this.combokills>0){
                this.incPowerBar(this.combokills*COMBO_AWARD);
            }
            this.comboStartKills = 0;
            this.combokills = 0;
        }
    }
};

PlayerServ.prototype.happyBound = function () {

    var pos = this.happyPos;
    var r = this.happyRadius * 2;
    var bound = {
        minx: pos[0] - r,
        miny: pos[1] - r,
        maxx: pos[0] + r,
        maxy: pos[1] + r
    };
    return bound;
};

PlayerServ.prototype.longBound = function () {
    var pos = this.position;
    var r = this.realRadius * 4;
    var bound = {
        minx: pos[0] - r,
        miny: pos[1] - r,
        maxx: pos[0] + r,
        maxy: pos[1] + r
    };
    return bound;
};

PlayerServ.prototype.getPlSize = function () {
    var r = (this.realRadius + this.happyRadius);
    return r;
};

PlayerServ.prototype.getColl = function () {
    return this.foodCollider;
};

PlayerServ.prototype.leftArrow = function () {
    this.leftArrowRec = true;
    this.lDown = true;
};

PlayerServ.prototype.leftArrowUp = function () {
    this.lDown = false;
};
PlayerServ.prototype.addSpeed2X = function(){

};
PlayerServ.prototype.removeSpeed2X = function(){

};

PlayerServ.prototype.space = function () {
  
    this.spaceDown = true;
    if(this.currSpeedPower>0){
        this.currAccX = Conf.PLA_ACC_FAST_X;
        this.currAccY = Conf.PLA_ACC_FAST_Y;
        this.powerMultiplier = SPACE_MULT;    

        
    }
};

PlayerServ.prototype.spaceUp = function () {
    this.spaceDown = false;
        this.currAccX = Conf.PLA_ACC_BASIC_X;
        this.currAccY = Conf.PLA_ACC_BASIC_Y;    
    
        this.powerMultiplier = 1;
};

PlayerServ.prototype.rightArrow = function () {
    this.rightArrowRec = true;
    this.rDown = true;
};

PlayerServ.prototype.rightArrowUp = function () {
    this.rDown = false;
};

PlayerServ.prototype.leftClick = function () {
    this.rClick = true;
    this.balloonPowerOnFlag = true;
};

PlayerServ.prototype.leftClickUp = function () {
    this.rClick = false;
    this.balloonPowerOffFlag = true;
    this.maxSpeed_N = this.resetSpeed;
};

PlayerServ.prototype.mouseUp = function () {
    this.mouseDown = false;
};

PlayerServ.prototype.processInputP = function (delta) {
    if (!this.popped) {
        var inc = this.currAccX;
        if (this.spaceDown) {
            this.powerUse();
        }
     
        if (this.lDown) {
            this.vel[0] -= inc;
        } else if (this.rDown) {
            this.vel[0] += inc;
        }
        if (this.rClick) {
            this.vel[1] -= this.currAccY;

        } else {
            this.vel[1] += 16;
        }
    } else {
        this.vel[1] += 32;
        this.maxSpeed_N = Conf.PLA_SP_PUNC;
    }
    this.vel[0] = Math.max(-this.maxSpeed_N * this.powerMultiplier*this.speed2x, Math.min(this.maxSpeed_N * this.powerMultiplier*this.speed2x, this.vel[0])) || 0; //cap
    this.vel[1] = Math.max(-this.maxSpeed_N * this.powerMultiplier*this.speed2x, Math.min(this.maxSpeed_N * this.powerMultiplier*this.speed2x, this.vel[1])) || 0; //cap
    this.position = [
        this.position[0] + this.vel[0] * delta,
        this.position[1] + this.vel[1] * delta
    ];
    this.happyPos = [this.position[0],
        this.position[1] - (this.realRadius + this.happyRadius)
    ];
    this.legsPos = [this.position[0],
        this.position[1] + this.realRadius / 2
    ];
    this.realCollider.pos.x = this.foodCollider.pos.x = this.position[0];
    this.realCollider.pos.y = this.foodCollider.pos.y = this.position[1];

    this.happyCollider.pos.x = this.happyPos[0];
    this.happyCollider.pos.y = this.happyPos[1];

    this.legCollider.pos.x = this.legsPos[0];
    this.legCollider.pos.y = this.legsPos[1];
};


PlayerServ.prototype.processInputB = function (delta) {
    if (!this.popped) {
        var inc = this.currAccX;
        if (this.lDown) {
            this.vel[0] -= inc;
        } else if (this.rDown) {
            this.vel[0] += inc;
        }
        if (this.rClick) {
            this.vel[1] -= this.currAccY;

        } else {
            this.vel[1] += 13;
        }
    } else {
        this.vel[1] += 25;
        this.maxSpeed_N = Conf.PLA_SP_PUNC;
    }
    this.vel[0] = Math.max(-this.maxSpeed_N * this.powerMultiplier, Math.min(this.maxSpeed_N * this.powerMultiplier, this.vel[0])) || 0; //cap
    this.vel[1] = Math.max(-this.maxSpeed_N * this.powerMultiplier, Math.min(this.maxSpeed_N * this.powerMultiplier, this.vel[1])) || 0; //cap
    if (this.vel[0] > 0) {
        this.rightArrowRec = true;

    } else {
        this.leftArrowRec = true;
    }

    this.position = [
        this.position[0] + this.vel[0] * delta,
        this.position[1] + this.vel[1] * delta
    ];

    this.happyPos = [this.position[0],
        this.position[1] - (this.realRadius + this.happyRadius)
    ];

    this.legsPos = [this.position[0],
        this.position[1] + this.realRadius / 2
    ];
    this.realCollider.pos.x = this.foodCollider.pos.x = this.position[0];
    this.realCollider.pos.y = this.foodCollider.pos.y = this.position[1];
    this.happyCollider.pos.x = this.happyPos[0];
    this.happyCollider.pos.y = this.happyPos[1];
    this.legCollider.pos.x = this.legsPos[0];
    this.legCollider.pos.y = this.legsPos[1];
};

PlayerServ.prototype.incKills = function (sock) {
    var bw = null;

    this.lastKillTime = this.killTime;
    this.killTime = this.lifeTime;
    var delKillTime = this.killTime - this.lastKillTime;
    if (delKillTime < KILL_RESET_TIME &&  this.comboStartKills>0) {
        this.combokills++;
        this.totalComboKills++;
        if (sock) {
            bw = new BW(3);
            bw.writeUInt16(this.pid);
            bw.writeUInt8(this.combokills);
            sock.send('c', bw.toBuffer());
        }
    }
    this.comboStartKills++;
    this.kills++;
 
};

PlayerServ.prototype.imDead = function () {
    if (!this.deadOn) {
        return;
    }
    this.deathCount++;
    this.belly.foodInBelly -= this.dotsEaten;
    this.dotsEaten = 0;
    this.dead = true;
    this.position = this.poppedPos;
    return true;
};


PlayerServ.prototype.collectData = function(by){
    this.poppedPos = this.position;
    this.endData['deaths'] = this.deathCount;
    // this.endData['kills'] = this.kills;
    // this.endData['ckills'] = this.totalComboKills;
    // this.endData['score'] = this.score;
    // this.endData['topposition'] = this.topPosition;
    this.endData['killedby'] = by || 'Unknown ';
};

PlayerServ.prototype.clearPl = function(qt){
    if (this.node && qt.contains(this.node)) {
        qt.remove(this.node);
        this.node = null;
    }
    if (this.node_legs && qt.contains(this.node_legs)) {
        qt.remove(this.node_legs);
        this.node_legs = null;
    }
    if (this.happyNode && qt.contains(this.happyNode)) {
        qt.remove(this.happyNode);
        this.happyNode = null;
    }
};

PlayerServ.prototype.setPopped = function (qt, by) {
    this.collectData(by);
    this.popped = true;
    this.ballonPoppedFlag = true;
    this.rClick = false;
    this.maxSpeed_N = Conf.PLA_SP_FAST;
    this.vel[0] = 0;
    this.clearPl(qt);
};

PlayerServ.prototype.updateWindowSize = function (w, h) {
    this.ww = w;
    this.wh = h;
};

PlayerServ.prototype.getWindowSize = function () {
    return [this.ww, this.wh];
};

PlayerServ.prototype.limitInBoundary = function () {
    var ret = false;
    if (this.popped) {
        this.deadCounter++;
        if (this.deadCounter > 40) {
            this.imDead();
        }
    }
    var q = (this.realRadius);
    var oppVel = 300;
    if (this.position[0] <= q) {
        this.vel[0] = oppVel;
    } else if (this.position[0] > (this.MAX_COORD - q)) {
        this.vel[0] = -oppVel;
    }
    if (this.position[1] < q) {
        this.vel[1] = oppVel * 2;
    } else if (this.position[1] > (this.MAX_COORD - waterDepth)) {
        this.poppedPos = this.position;
        this.vel[0] = 0;
        this.vel[1] = 0;
        this.collectData('Water GOD');
        ret = this.imDead();
    }

    this.position[0] = Math.max(0 + q, Math.min(this.MAX_COORD - q, this.position[0]));
    this.position[1] = Math.max(0 + q, Math.min(this.MAX_COORD - q, this.position[1]));
    return ret;
};

PlayerServ.prototype.servUpdateDead = function (delta) {
    return true;
}

PlayerServ.prototype.mouseEmpty = function () {

};

PlayerServ.prototype.mouseFn = function () {
    this.happyFacesManager.mouseDown(this.position);
};
