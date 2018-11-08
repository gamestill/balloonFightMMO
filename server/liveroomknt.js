'use strict';
var CONF = require('./gameConf.js');

var RESTART_EVERY_X_HOUR = CONF.RESTART_EVERY_X_HOUR;
var FIRE_DAMAGE = CONF.FIRE_DAMAGE;
var MIN_SCORE_FOR_BACKFIRE = 10; 
var MAX_CAPACITY = CONF.MAX_CAPACITY;
var _MAX_ZOOM = 1 - CONF.MAX_ZOOM;
var MAX_BOT = CONF.MAX_BOT_CAPACITY;
var MAX_BOT_PER_CYCLE = CONF.MAX_BOT_PER_CYCLE;
var BOTS_TRIGGER_COUNT = CONF.BOTS_TRIGGER_COUNT;
var rowLen = CONF.SERVER_BLOCKS_COUNT;
var minBlockNo = rowLen * 2;
var maxBlockNo = rowLen * rowLen - 1 - rowLen * 2;
var TTimer = require('./../share/common/TinyTimer.js');
var BW = require("./lib/BinaryWriter.js");
var BR = require("./lib/BinaryReader.js");
var Game = require('./../share/game.js');
var QT = require('./lib/qt.js');
var fs = require('fs');
var stats = [];

var BulletManager = require('./bulletmanager.js');
var BotScript = require('./bot.js');
var clientDisc = require('./clientTimeout.js');
var LEADER_BOARD_RECORDS = CONF.LEADERBOARD_MAX;
var LEADER_BOARD_FAV_RECORDS = CONF.LEADERBOARD_FAV_MAX;
var SAT = require('./sat.js');
var CIC = SAT.testCircleCircle;
var PIC = SAT.pointInCircle;
var PO_IN_C = SAT.testPolygonCircle;
var SV = SAT.Vector;
var SC = SAT.Circle;
var SB = SAT.Box;
var SP = SAT.Polygon;
var S_R = SAT.Response;
var gameloop = require('./gameloop.js');
var worldSize = require('./playerServ.js').worldSize;
var waterDepth = CONF.waterDepth;
var worldSizeBy2 = Math.floor(worldSize / 2);
var BlockSize = worldSize / 20;
var FMath = require('./fastmath.js');
var fMath = new FMath();
var WorldBlocks = require('./serverBlocks.js');
var VerifyPlayer = require('./verifyplayer.js');
var Player = require('./playerServ.js').player;
var BotConf = require('./botConf.js');
var Bot = require('./bot.js');
var leaderboard = require('./leaderboards.js');
var ABS = Math.abs;
var WINNING_KILLS = 30;
var REASON_MAP = {
    'dc': 1,
    'dead': 2,
    'direct': 3
};

var WorldBoundary = function (x, y, width, height) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
};

var WatchPl = function (pos, id) {
    this.position = [pos[0], pos[1]];
    this.id = id;
};
WatchPl.prototype.deadFlagFn = function () {
    return 0;
}
WatchPl.prototype.deadFlagFn2 = function () {
    return 0;
}
var DumbPl = function (x, y, bl) {
    this.range = [];
    this.toSendEnColl = [];
    this.toSendBlock = 64000;
    this.toSendExColl = [];
    this.position = [x, y];
    this.lastInput = 0;
};

var TeamType = {
    'RED': 1,
    'BLUE': 2
}

// Team data
//[type,count];

var LiveRoomknt = function (rclient, primus, roomId, serverBlocks) {
    // new

    console.log('starting first match');
    var self = this;
    var dumpPosX = 1000 + Math.floor(Math.random() * (worldSize - 5000));
    var dumpPosY = 1000 + Math.floor(Math.random() * (worldSize - 5000));
    // this.dumbPl = new DumbPl(dumpPosX, dumpPosY, serverBlocks.getBlockNo(dumpPosX, dumpPosY));
    this.realPlCount = 0;
    this.botCount = 0;
    this.primus = primus;
    this.rclient = rclient;
    this.seconds = 0;
    this.totaltime = 0;
    this.watchPlList = {};
    this.teamData = [0, 0];
    this.rNos = [];
    this.bulletsToRem = [];
    this.sortedListByBlock = [];
    var game = null;
    this.toRemoveFromQt = [];
    this.fanColliders = {};
    this.pidToSocketId = {};
    this.bulletM = null;
    this.bulletManagerSet = false;
    this.fpt = fMath.clockMilli();
    this.players = {};
    this.redisUpdateTime = 0;
    this.roomColliders = {};
    this.lastRedisUpdateTime = 0;
    this.eatPackets = [];
    this.eatPacketBlocks = [];
    this.leaderboard;
    //   this.pendingFood = [];
    this.playersFood = [];
    this.running = false;
    this._now = 0;
    this.sockets = {};
    this.waterDead_food = CONF.WATER_DEAD_FOOD_VAL;
    this.BELLY = {
        foodInBelly: 0
    };
  
    this.lastRank = {};
    this.bulletsToRem = [];
    this.toRemFromLb = [];
    this.qt = null;
    this.lastSendFFA_leaders = []; // leaderboard related
    this.topFFA = {}; // leaderboard related
    this.serverBlocks = serverBlocks;
    this.ttimer = new TTimer();
    this.leaderboardTime = 0;
    this.toRemoveFood = [];
    this.debugTime = 0;
    this.name = roomId;
    this.oneSecOn = true;
    this.sortedFFA = [];
    this.facesToPush = [];
    this.facesToRem = [];
    this.allRemove = {};
    this.playerIndex = 0;
    this.addedToQt = false;
    this.updateCounter = 0;
    this.sl_up_counter = 0;
    this.playersSocks = [];
    this.battlePls = {}; // active in game players
    this.spectatingSockIds = [];
    this.discObj = {};
    this.worldBoundary = new WorldBoundary(0, 0, worldSize, worldSize);
    this.oneSecTimer = this.ttimer.addTimer(CONF.ONE_SEC_TIME, this.oneSec.bind(this), true, []);
    // new
    this.full = false;
    this.botIds = [];
    this.clearRoom = function () {
        var ffaInd = -1;
        var sid = 0;
        var bid = 0;

        while (this.botIds.length > 0) {
            var bid = this.botIds[0];
            this.botIds.splice(0, 1);
            var item = this.players[bid];
            if (item) {
                this.removePlayer(item.botScript.botSocket, true);
            }
        }

        while (this.playersSocks.length > 0) {
            sid = this.playersSocks[0];
            if (this.players[sid]) {
                if (!this.discObj['' + sid]) {
                    this.discObj['' + sid] = [this.players[sid].pid, 'direct'];
                }
                delete this.pidToSocketId['' + this.players[sid].pid];
                delete this.topFFA['' + sid];
                delete this.battlePls['' + sid];
                this.players[sid] = undefined;
                delete this.players[sid];
            }
            this.playersSocks.splice(0, 1);
            delete this.sockets[sid];
        }
        this.botIds = [];
        this.players = {};
    };
    this.getPlayer = function (id) {
        return this.players["" + id];
    };

    this.getGame = function () {
        return game;
    };


    this.setRoomBlock = function (x, y, width, height, rid) {
        var pos = null;
        if (width < 0) {
            x = x + width;
            width = -width;
        }
        if (height < 0) {
            y = y + height;
            height = -height;
        }
        if (width < 100) {
            pos = new SV(x, 0);
        } else if (height < 100) {
            pos = new SV(0, y);
        }

        var bc = new SB(new SV(x, y), width, height);
        var pc = bc.toPolygon();
        this.roomColliders['' + rid] = pc;
        var node = {
            bound: {
                minx: x,
                miny: y,
                maxx: x + width,
                maxy: y + height
            },
            id: rid,
            p: pos,
            type: CONF.ITEM_TYPES.ROOM_WALL
        };

        this.qt.insert(node);
    };
    this.addFansToQt = function (added) {
        if (added) {
            return;
        }
        var rotators = [
            [4750, 1500, 500, 30],
            [4750, 3000, 500, 30],
            [4750, 4500, 500, 30],
            [4750, 6000, 500, 30],
        ]
        var idd = 0;
        var bc = null;
        for (var i = 0; i < rotators.length; i++) {
            var node = {
                bound: {
                    minx: rotators[i][0] - rotators[i][2] / 2,
                    miny: rotators[i][1] - rotators[i][2] / 2,
                    maxx: rotators[i][0] + rotators[i][2] / 2,
                    maxy: rotators[i][1] + rotators[i][2] / 2
                },
                id: ++idd,
                type: CONF.ITEM_TYPES.FAN
            };
            bc = new SC(new SV(rotators[i][0], rotators[i][1]), rotators[i][2] / 2);
            this.fanColliders['' + idd] = bc;
            this.qt.insert(node);
        }
    }
    this.addRoomsToQt = function (added) {
        if (added) {
            return;
        }
        var count = 0;
        var size = 1500;
        var offsetX = 1000;
        var offsetY = 1200;
        var gapSize = 600;
        var holeSize = 300;
        var redSize = 10;
        var offsets = [
            [offsetX, offsetY],
            [6000, offsetY],
            [offsetX, 4000],
            [6000, 4000]
        ];
        var rooms = [];
        for (var i = 0; i < 4; i++) {
            offsetX = offsets[i][0];
            offsetY = offsets[i][1];
            rooms.push({
                '0': [offsetX, offsetY, size, redSize],
                '1': [offsetX + size, offsetY, redSize, gapSize],
                '2': [offsetX + size, offsetY + gapSize + holeSize, redSize, gapSize],
                '3': [offsetX + size, offsetY + size, -size, redSize],
                '4': [offsetX, offsetY + size, redSize, -size]
            });
        }

        var croom = null;
        var item = null;
        for (var i = 0; i < rooms.length; i++) {
            croom = rooms[i];
            var x = 0;
            var y = 0;
            var along = 0;
            for (var j = 0; j < 5; j++) {

                item = croom['' + j];
                this.setRoomBlock(item[0], item[1], item[2], item[3], count);
                count++;
            }
        }
    };

    this.setupBM = function () {
        if (this.bulletManagerSet) {
            return;
        }
        this.bulletManagerSet = true;
        this.bulletM = new BulletManager();
    };
    this.clearBM = function () {
        this.bulletManagerSet = false;
        this.bulletM.reset();
    };
    this.clearQT = function () {
        this.serverBlocks.reset();
        this.addedToQt = false;
    };
    this.setupQT = function () {
        this.rNos = [];
        for (var i = 0; i < 10000; i++) {
            this.rNos.push([-100 + Math.random() * 200, -100 + Math.random() * 200]);
        }
        this.qt = new QT({
            minx: 0,
            miny: 0,
            maxx: worldSize + 500,
            maxy: worldSize + 500
        }, 4, 4);

        this.qt.clear();
        this.roomColliders = {};
        this.fanColliders = {};
        this.addRoomsToQt(this.addedToQt);
        this.addFansToQt(this.addedToQt);
        this.serverBlocks.addToQt(this.qt, this.addedToQt);
        this.addedToQt = true;
    };



    this.sendLeaderboardData = function (sortedFFA, dead, socki) {
        var toSend_lead = null;
        if (sortedFFA.length > 0) {
            toSend_lead = new BW(20);
            var lastRecIndex = Math.min(LEADER_BOARD_RECORDS, sortedFFA.length);
            var meInTopN = false;
            toSend_lead.writeUInt8(lastRecIndex + 1);
            dead && toSend_lead.editByte1(lastRecIndex);
            for (var k = 0; k < lastRecIndex; k++) {
                if (sortedFFA[k] === socki.id) {
                    meInTopN = true;
                    toSend_lead.editByte1(lastRecIndex);
                }
                this.players['' + sortedFFA[k]] && toSend_lead.writeUInt16(this.players['' + sortedFFA[k]].pid);
            }
            if (!meInTopN) {
                var wr = sortedFFA.indexOf(socki.id) + 1;
                toSend_lead.writeUInt8(wr);
            }
            socki.send('l', toSend_lead.toBuffer());
        }
    };
    this.setNewPlayerFood = function (myPl, data) {
        if (data['' + myPl.pid]) {
            return;
        }
        var pfood = {};
        var my_bl_data = [];
        for (var l = 0; l < this.playersFood.length; l++) {
            pfood = this.playersFood[l];
            var keys_pfood = Object.keys(pfood);
            var p_bl = -1;
            var p_bl_data = [];
            for (var m = 0; m < keys_pfood.length; m++) {
                p_bl = keys_pfood[m];
                p_bl_data = pfood[p_bl];
                if (myPl.range.indexOf(+p_bl) >= 0) {
                    my_bl_data.push(+p_bl);
                    my_bl_data = my_bl_data.concat([p_bl_data]);
                }
            }
        }
        data['' + myPl.pid] = my_bl_data;
    };



    this.removePlFromQt = function (node) {
        if (this.qt.contains(node)) {
            this.qt.remove(node);
        }
    };

    this.getFollowPl = function () {
        // var obj = Object.keys(this.battlePls);
        // var rand = 0;
        // var id = '';
        // if (obj.length > 0) {
        //     rand = fMath.getRandom(0, obj.length);
        //     id = obj[rand];            
        //     return this.players['' + id];
        // }
        //  var aa = this.dumbPl;
        return aa;

    }

    this.start = function () {
        if (!this.running) {
            this.startGame();
        }
    };
    game = new Game(CONF.FPS, roomId, this);
    game.onUpdate = function (delta) {

        var socks = this.playersSocks,
            deathBySinking = false,
            ret,
            $this = this,
            pl = null,
            botInput = false,
            canColl = false,
            param = [this.serverBlocks, this.players, this.pidToSocketId];
        var now = fMath.clockMilli(this.fpt);
        this.updateCounter++;
        (this.updateCounter % 53 === 0) && (botInput = true);
        this.ttimer.update(delta * 1000);
       
        this.bulletM.update(delta);
        for (var i = 0; i < socks.length; i++) {
            pl = this.players[socks[i]] || '';
            if (pl.botScript) {
                if (botInput) {
                    pl.botScript.input(param, now);
                }
                pl.botScript.update();
                pl.resetFrameData();
            }
            if (pl.dead) continue;
            !pl.popped && this.checkColl(pl, this.updateCounter);
            deathBySinking = pl.servUpdate(now, delta);
            if (deathBySinking) {
                this.toRemoveFromQt.push(pl);
            }
        }
        for (var i = 0; i < this.toRemoveFromQt.length; i++) {
            this.toRemoveFromQt[i].clearPl(this.qt);
        }
        this.bulletM.clearBullets(this.qt, this.bulletsToRem);
        this.bulletsToRem = [];
        this.toRemoveFromQt = [];
    };

    // runs at 20* fps ~100ms rate  - this may vary depending on the configuration  
    game.onUpdateSlow = function (delta) {
        var self = this;
        var socks = this.sockets;
        var sockKeys = Object.keys(socks);
        var myPl = null;
        var opl = null;
        var _abs = Math.abs;
        var _now = fMath.clockMilli(this.fpt); // current relative server time
        this._now = _now;
        var repeat_packet = null;
        var count = 0;
        var socki = null;
        var eatInRange = false;
        var discObj = this.discObj;
        var __dc_keys = [];
        var dc_toSend = null;
        var __dc_obj = [];
        var SERVER_NO_PACKET_TIMEOUT = CONF.SERVER_NO_PACKET_TIMEOUT;
        var _zoom = null;
        var red = 0;
        var newFoodDataJson = {};
        this.sl_up_counter++;
        this.canSendFFA = 0;
        this.leaderboardTime += delta;
        while (this.toRemoveFood.length > 0) {
            if (this.qt.contains(this.toRemoveFood[0])) {
                this.qt.remove(this.toRemoveFood[0]);
                this.toRemoveFood.splice(0, 1);
            }
        }

        if (this.leaderboardTime >= 1) {
            if (this.toRemFromLb.length > 0) {
                for (var i = 0; i < this.toRemFromLb.length; i++) {
                    delete this.topFFA['' + this.toRemFromLb[i]];
                }
            }
            this.toRemFromLb = [];
            this.sortedFFA = fMath.sort(this.topFFA);
            if (!fMath.arraysIdentical(this.sortedFFA, this.lastSendFFA_leaders)) {
                this.canSendFFA = 1;
            }
            this.lastSendFFA_leaders = this.sortedFFA;
            this.leaderboardTime = 0;
        }
        for (var i = 0; i < sockKeys.length; i++) {
            socki = socks[sockKeys[i]];
            myPl = this.players[socki.id];
            if (myPl.dead) continue;
            myPl.setTopPos(this.sortedFFA.indexOf(myPl.id));
        }
        for (var i = 0; i < sockKeys.length; i++) {
            socki = socks[sockKeys[i]];
            if (socki.iamabot321) {
                myPl = this.players[socki.id];
                this.topFFA['' + socki.id] = [myPl.score,myPl.deathCount];
                if (myPl.dead && !myPl.alreadyDead) {
                    myPl.alreadyDead = true;
                }
                continue;
            }
           
            newFoodDataJson = {};
            count = 1;
            myPl = this.players[socki.id];
            if (!discObj['' + myPl.id] && ((_now - myPl.lastInputTime) > SERVER_NO_PACKET_TIMEOUT)) {
                discObj['' + myPl.id] = [myPl.pid, 'dc'];
            }
            this.canSendFFA && this.sendLeaderboardData(this.sortedFFA, myPl.dead, socki);
            repeat_packet = new BW(30);
            if (myPl.dead && !myPl.alreadyDead) {
                myPl.alreadyDead = true;
                myPl.deadSpec = true;
                //   myPl.deadFlagFn = this.setPlayerFlags_dead.bind(this);
                //   myPl.deadFlagFn2 = this.setPlayerFlags_dead2.bind(this);
                // myPl.deadBFunc = this.writeBaseRepeatData_dead.bind(this);
                delete this.battlePls['' + socki.id];
                myPl.clientTime_spec = myPl.clientTime1;
                //     myPl.followPl = this.getFollowPl();
                myPl.servUpdate = myPl.servUpdateDead;
                if (!discObj['' + myPl.id]) {
                    discObj['' + myPl.id] = [myPl.pid, 'dead'];

                }
            }
            myPl.deadBFunc(myPl, _now, repeat_packet, Math.min(255, sockKeys.length));
            this.setNewPlayerFood(myPl, newFoodDataJson);
            this.setPlayerRepeatData(myPl, myPl.followPl, newFoodDataJson, repeat_packet, false);

            this.topFFA['' + socki.id] = [myPl.score,myPl.deathCount];
            // add other players data
            for (var j = 0; j < sockKeys.length; j++) {
                opl = this.players[socks[sockKeys[j]].id];
                if (this.withInWindowOrSpecOrMainPl(myPl, opl, _abs)) {
                    this.setPlayerRepeatData(opl, opl, newFoodDataJson, repeat_packet, true);
                    count++;
                }
            }
            // edit the ist byte because some players may be culled so not rendered
            repeat_packet.editByte1(count);
            socki.send('o', repeat_packet.toBuffer());
            myPl.slowLoop(_now, this.sl_up_counter);
            // this data is the food created by the server for the eaten food by the players in the last 1 sec!!!
            //   this.sendNewPendingData(myPl, socki); // this is send only to the player per loop
            myPl.resetMyDataSoItsNotSentToOthers();
           
        }
        for (var i = 0; i < sockKeys.length; i++) {
            socki = socks[sockKeys[i]];
            myPl = this.players[socki.id];
            myPl.leftArrowRec = false;
            myPl.rightArrowRec = false;
            myPl.killFlag = null;
            myPl.toSendMsg = null;
            myPl.networkBull = [];
            myPl.networkBullR = [];
            myPl.balloonPowerOnFlag = false;
            myPl.balloonPowerOffFlag = false;
            myPl.ballonPoppedFlag = false;
            if (socki.iamabot321 && myPl.dead) {
                self.removeBot(socki.id);                
            }
        }

        __dc_keys = Object.keys(discObj);
        if (__dc_keys.length > 0) {
            dc_toSend = new BW(6);
            dc_toSend.writeUInt8(__dc_keys.length);
            for (var b = 0; b < __dc_keys.length; b++) {
                __dc_obj = discObj[__dc_keys[b]];
                dc_toSend.writeUInt16(__dc_obj[0]);
                dc_toSend.writeUInt8(REASON_MAP['' + __dc_obj[1]]);
                if (REASON_MAP['' + __dc_obj[1]] === REASON_MAP.dead) {
                    this.writeDeadData(__dc_keys[b], dc_toSend);
                }
            }
            this.primus.forEach(function (spark, id, connections) {
                spark.send('dc', dc_toSend.toBuffer());
                // if (discObj['' + id]) {
                //     spark.removeAllListeners('i');
                //     if (discObj['' + id][1] === 'dc') {
                //         spark.end();
                //     }
                // }
            });
            dc_toSend = null;
        }

        this.discObj = {};
        this.playersFood = [];
        this.eatPackets = [];
    };
    ////////////////////////////////////////////////////////////////////////////////
    this.verification = new VerifyPlayer();
    this.verification.init();
    this.getGame().allSet();
    this.setupQT();
    this.setupBM();
};

module.exports = LiveRoomknt;
LiveRoomknt.prototype.writeDeadData = function (sid, buff) {
    var kills = 10;
    var leaked = 5;
    var xpgain = 2;
    var topPos = 6;
    var hpe = 2;
    var time = 22;
    var pl = this.players[sid];
    var data = pl.endData;
    var __by = data['killedby'] || 'god';
    var _len = Buffer.byteLength(__by, 'ucs2');

    if (pl) {
        buff.writeUInt16(data['kills']);
        buff.writeUInt16(_len);
        buff.writeStringUnicode(__by);
        buff.writeUInt16(data['ckills']);
        buff.writeUInt16(data['score']);
        buff.writeUInt16(data['topposition']);
        buff.writeUInt16(data['deaths']);

    }
}

LiveRoomknt.prototype.getTopPlayers = function () {

};
LiveRoomknt.prototype.writeBaseRepeatData_dead = function (myPl, _now, repeat_packet, maxPlayersCurrent) {
    repeat_packet.writeUInt8(maxPlayersCurrent);
    repeat_packet.writeUInt32(0);
    repeat_packet.writeUInt32(_now - myPl.plTime - 25);
    repeat_packet.writeUInt32(_now - myPl.plStartTime);


}
// only to the player
LiveRoomknt.prototype.writeBaseRepeatData = function (myPl, _now, repeat_packet, maxPlayersCurrent) {
    repeat_packet.writeUInt8(maxPlayersCurrent);
    repeat_packet.writeUInt32(myPl.clientTime1);
    repeat_packet.writeUInt32(myPl.servLogTime1);
    repeat_packet.writeUInt32(_now - myPl.plStartTime);
}

//repeat data 
// common for all the players
LiveRoomknt.prototype.setPlayerRepeatData = function (pl, myPl, pfoodData, repeat_packet, other) {
    var eatPush = [],
        canEat = false,
        decZoomBy = 0,
        pid = pl.pid,
        haveFaces = false,
        playerFlags = 0,
        killFlag = false,
        _len = 0,
        playerFlags2 = 0,
        canZoom = false,
        havePlFood = false,
        haveMsg = false,
        bulletFlag = false,
        bulletFlagR = false,
        plFood_ = pfoodData['' + pl.pid];

    havePlFood = plFood_ && plFood_.length > 0; // check if the player have some food
    haveMsg = pl.toSendMsg;
    for (var i = 0; i < this.eatPackets.length; i++) {
        if (myPl.range.indexOf(this.eatPackets[i][5]) >= 0) {
            eatPush.push(this.eatPackets[i]);
        }
    }

    killFlag = pl.killFlag;
    canEat = eatPush.length > 0;
    bulletFlag = pl.networkBull.length > 0;
    bulletFlagR = pl.networkBullR.length > 0;
    playerFlags = pl.deadFlagFn(pl, haveFaces, other, killFlag, canEat, bulletFlag); // 1 byte flags 1
    playerFlags2 = pl.deadFlagFn2(pl, havePlFood, haveMsg, canZoom, bulletFlagR, other); // 1 byte flags 2
    // sts the eat flag
    repeat_packet.writeUInt8(playerFlags);
    repeat_packet.writeUInt8(playerFlags2);
    if (pl.powerLevelChangeFlag) {
        repeat_packet.writeUInt8(pl.powerLevel - 1);
    }
    if (bulletFlag) {
        repeat_packet.writeUInt16(pl.networkBull.length);
        for (var i = 0; i < pl.networkBull.length; i++) {
            repeat_packet.writeUInt16(pl.networkBull[i]);
        }
    }
    if (bulletFlagR) {
        repeat_packet.writeUInt16(pl.networkBullR.length);
        for (var i = 0; i < pl.networkBullR.length; i++) {
            repeat_packet.writeUInt16(pl.networkBullR[i]);
        }
    }
    if (!other) {
        repeat_packet.writeUInt16(Math.floor(myPl.currSpeedPower)); // speed power
    }
    if (killFlag) {
        _len = Buffer.byteLength(killFlag, 'ucs2');
        repeat_packet.writeUInt16(_len);
        repeat_packet.writeStringUnicode(killFlag);

    }

    if (haveMsg) {
        var __len = Buffer.byteLength(pl.toSendMsg, 'ucs2');
        repeat_packet.writeUInt8(__len);
        repeat_packet.writeStringUnicode(pl.toSendMsg);
    }
    if (havePlFood) {

        var cindex = 0;
        var innerArr = [];
        var outerCounter = 0;
        var innerCounter = 0;
        var index = 0;
        var innerArrSize = 0;
        repeat_packet.writeUInt16(plFood_.length / 2); // no of blocks data items
        while (outerCounter < plFood_.length) {
            repeat_packet.writeUInt16(plFood_[outerCounter]); // block no
            innerArr = plFood_[outerCounter + 1];
            innerArrSize = innerArr.length / 4;
            repeat_packet.writeUInt16(innerArrSize);
            for (var z = 0; z < innerArrSize; z++) {
                index = z * innerArrSize;
                repeat_packet.writeUInt16(innerArr[index]); //x
                repeat_packet.writeUInt16(innerArr[index + 1]); // y 
                repeat_packet.writeUInt8(innerArr[index + 2]); //value
                repeat_packet.writeUInt8(innerArr[index + 3]); //state    
            }
            outerCounter += 2;
        }
    }
    if (canEat) {
        repeat_packet.writeUInt16(eatPush.length);
        for (var i = 0; i < eatPush.length; i++) {
            repeat_packet.writeUInt16(eatPush[i][0]);
            repeat_packet.writeUInt16(eatPush[i][1]);
            repeat_packet.writeUInt16(eatPush[i][2]);
            repeat_packet.writeUInt8(eatPush[i][3]);
            repeat_packet.writeUInt8(eatPush[i][4]);
            repeat_packet.writeUInt16(eatPush[i][5]);
        }
    }

    // current player data
    repeat_packet.writeUInt16(myPl.pid); // player id of the player -- MAX - 65536
    repeat_packet.writeUInt16(myPl.position[0]); // x
    repeat_packet.writeUInt16(myPl.position[1]); // y
    repeat_packet.writeUInt16(myPl.score); // size
    // convert the player flags to 8 bits for comparision etc
    playerFlags = fMath.convertByteTo8BitBinary(playerFlags);
    this.addBlockDataToPlayer(myPl, playerFlags, repeat_packet);
};


LiveRoomknt.prototype.createMurderFood = function (pos, count) {
    var yPos = pos[1];
    var foodSize = 20;
    if (pos[1] > (worldSize - waterDepth)) {
        ypos = worldSize - waterDepth * 3;
    }
    var created = 0;
    var c20 = Math.floor(count / foodSize);
    var c20Rem = count % foodSize;
    var rand = Math.floor(fMath.getRandom(0, this.rNos.length - 1 - c20 - 3));
    var ret = null;
    for (var i = rand; i < (rand + c20); i++) {
      
        ret = this.serverBlocks.newFoodAtPos(pos[0] + this.rNos[i][0], yPos + this.rNos[i][1], this.qt, foodSize, 1, -1);
        if (ret) {
            this.playersFood.push(ret);
        }
    }

    rand = Math.floor(fMath.getRandom(0, this.rNos.length - 1 - c20Rem - 3));
    for (var i = rand; i < (rand + c20Rem); i++) {
      
        ret = this.serverBlocks.newFoodAtPos(pos[0] + this.rNos[i][0], yPos + this.rNos[i][1], this.qt, 1, 1, -1);
        if (ret) {
            this.playersFood.push(ret);
        }
    }
};


LiveRoomknt.prototype.gameFinishedPre = function(){
    var $this = this;
    this.timeRemaining = 0;
    this.oneSecOn = false;
    var pls = this.players;
    var keys = Object.keys(pls);
    var pl = null;
    var bw = new BW(30);
    var top10Data = [];
    var data = [];
    var _name = '';
    var max = 0;
    for(var i=0;i<keys.length;i++){
        pl = pls[keys[i]];
        _name = pl.name || 'unknown';
        data.push([pl.kills,_name,pl.deathCount]);
    }
    data.sort(function(a,b){
      var n =  b[0] - a[0];
        if(n!==0){
            return n;
        }
        return  a[2] - b[2];
    });
    bw.writeUInt8(0);
    max = Math.min(10,data.length);
    bw.writeUInt8(max);
    
    for(var i=0;i<max;i++){
        bw.writeUInt16(Buffer.byteLength(data[i][1], 'ucs2'));
        bw.writeStringUnicode(data[i][1]);
        bw.writeUInt16(data[i][0]);
        bw.writeUInt16(data[i][2]);
    }
};

LiveRoomknt.prototype.oneSec = function () {
    var $this = this;
    this.totaltime++;
    if(this.totaltime>(60*60*RESTART_EVERY_X_HOUR)){
        process.exit(0);
    }
    if (!$this.oneSecOn || !this.players) {
        return;
    }
    var max_poss_bot = 0;
    var currentCreatingBots = 0;
    var playerCount = Object.keys(this.players).length;
    var qqqq = this.serverBlocks.blocksByPlayer;
    this.realPlCount = Object.keys(this.battlePls).length;
    this.botCount = playerCount - this.realPlCount;
    this.sortedListByBlock = Object.keys(qqqq[0]).sort((a, b) => qqqq[0][a] - qqqq[0][b]);
    if ( this.realPlCount  < BOTS_TRIGGER_COUNT) {
        max_poss_bot = Math.min(MAX_BOT, Math.floor(Math.floor(MAX_CAPACITY) -  this.realPlCount ));
        if (this.botCount < max_poss_bot)
            currentCreatingBots = Math.min(MAX_BOT_PER_CYCLE, max_poss_bot - this.botCount);
        for (var i = 0; i < currentCreatingBots; i++) {
            this.createBot();
        }
    }
    var totalFood = this.serverBlocks.foodInSpace + this.BELLY.foodInBelly;
    var delta = this.serverBlocks.totalFood - totalFood;
    if (delta > 0) {
        this.createMurderFood(this.serverBlocks.getRandomPos(), delta);
    }
};

LiveRoomknt.prototype.addFoodDataForPlBlock = function (toSend, blocks) {
    var data = this.serverBlocks.getFoodForBlocks(blocks);
    var toSendFood = [];
    var blocks = data[0];
    var food = data[1];
    var sadData = data[2];

    var write = [];
    if (blocks.length > 0) {
        for (var i = 0; i < blocks.length; i++) {
            toSend.writeUInt16(food[i].length); // write no of food in the block
            for (var j = 0; j < food[i].length; j++) {
                toSend.writeUInt16(food[i][j][1]);
                toSend.writeUInt16(food[i][j][2]);
                toSend.writeUInt8(food[i][j][3]);
                toSend.writeUInt8(food[i][j][4]);
            }
        }
    }

};
LiveRoomknt.prototype.setPlayerFlags_dead2 = function (pl, plFood, msg, canZoom, bulRemFlag, other) {
    var blockCode = 0;
    if (other) {
        if (plFood) {
            blockCode = fMath.setBit(blockCode, 1);
        }
        if (msg) {
            blockCode = fMath.setBit(blockCode, 2);
        }
        if (pl.leftArrowRec) {
            blockCode = fMath.setBit(blockCode, 4);
        }
        if (pl.rightArrowRec) {
            blockCode = fMath.setBit(blockCode, 5);
        }
        // if (pl.ballonPoppedFlag) {
        //     blockCode = fMath.setBit(blockCode, 6);
        // }
        if (pl.balloonPowerOnFlag) {
            blockCode = fMath.setBit(blockCode, 3);
        }
        if (pl.balloonPowerOffFlag) {
            blockCode = fMath.setBit(blockCode, 7);
        }
        if (bulRemFlag) {
            blockCode = fMath.setBit(blockCode, 0);
        }

    } else {
        blockCode = 0;
        if (plFood) {
            blockCode = fMath.setBit(blockCode, 1);
        }
        if (pl.leftArrowRec) {
            blockCode = fMath.setBit(blockCode, 4);
        }
        if (pl.rightArrowRec) {
            blockCode = fMath.setBit(blockCode, 5);
        }
        // if (pl.ballonPoppedFlag) {
        //     blockCode = fMath.setBit(blockCode, 6);
        // }
        if (pl.balloonPowerOnFlag) {
            blockCode = fMath.setBit(blockCode, 3);
        }
        if (pl.balloonPowerOffFlag) {
            blockCode = fMath.setBit(blockCode, 7);
        }
        if (bulRemFlag) {
            blockCode = fMath.setBit(blockCode, 0);
        }


    }
    return blockCode;
}
LiveRoomknt.prototype.setPlayerFlags_dead = function (pl, haveFaces, other, killFlag, eatpush, bulletFlag) {

    var blockCode = 0;
    if (other) {
        blockCode = parseInt('00000000', 2);
        if (eatpush) {
            blockCode = fMath.setBit(blockCode, 2);
        }
        if (killFlag) {
            blockCode = fMath.setBit(blockCode, 3);
        }
        if (bulletFlag) {
            blockCode = fMath.setBit(blockCode, 5);
        }

    } else {
        blockCode = 0;
        if (eatpush) {
            blockCode = fMath.setBit(blockCode, 2);
        }
        if (killFlag) {
            blockCode = fMath.setBit(blockCode, 3);
        }
        blockCode = fMath.setBit(blockCode, 4);
        if (bulletFlag) {
            blockCode = fMath.setBit(blockCode, 5);
        }

    }
    return blockCode;
}
LiveRoomknt.prototype.setPlayerFlags2 = function (pl, plFood, msg, canZoom, bulRemFlag, other) {
    var ret = 0;
    // client - server
    //7-0
    //6-1
    //5-2
    //4-3
    //3-4
    //2-5
    //1-6
    //0-7
    var blockCode = 0;
    if (other) {
        if (bulRemFlag) {
            blockCode = fMath.setBit(blockCode, 0);
        }
        if (plFood) {
            blockCode = fMath.setBit(blockCode, 1);
        }
        if (msg) {
            blockCode = fMath.setBit(blockCode, 2);
        }
        if (pl.leftArrowRec) {
            blockCode = fMath.setBit(blockCode, 4);
        }
        if (pl.rightArrowRec) {
            blockCode = fMath.setBit(blockCode, 5);
        }
        if (pl.ballonPoppedFlag) {
            blockCode = fMath.setBit(blockCode, 6);

        }
        if (pl.balloonPowerOnFlag) {
            blockCode = fMath.setBit(blockCode, 3);
        }
        if (pl.balloonPowerOffFlag) {
            blockCode = fMath.setBit(blockCode, 7);
        }
    } else {
        blockCode = 0;
        if (bulRemFlag) {
            blockCode = fMath.setBit(blockCode, 0);
        }
        if (plFood) {
            blockCode = fMath.setBit(blockCode, 1);
        }
        if (msg) {
            blockCode = fMath.setBit(blockCode, 2);
        }
        if (pl.balloonPowerOnFlag) {
            blockCode = fMath.setBit(blockCode, 3);
        }
        if (pl.leftArrowRec) {
            blockCode = fMath.setBit(blockCode, 4);
        }
        if (pl.rightArrowRec) {
            blockCode = fMath.setBit(blockCode, 5);
        }
        if (pl.ballonPoppedFlag) {
            blockCode = fMath.setBit(blockCode, 6);
        }

        if (pl.balloonPowerOffFlag) {
            blockCode = fMath.setBit(blockCode, 7);
        }

    }
    return blockCode;
};

LiveRoomknt.prototype.setPlayerFlags = function (pl, haveFaces, other, killFlag, eatpush, bulletFlag) {

    // client - server
    //7-0
    //6-1
    //5-2
    //4-3
    //3-4
    //2-5
    //1-6
    //0-7
    //7th bit if player block change
    var blockCode = 0;
    if (other) {
        blockCode = parseInt('00000000', 2);
        if (eatpush) {
            blockCode = fMath.setBit(blockCode, 2);
        }
        if (killFlag) {
            blockCode = fMath.setBit(blockCode, 3);
        }
        if (bulletFlag) {
            blockCode = fMath.setBit(blockCode, 5);
        }
    }

    // its the main loop player
    else {
        blockCode = (pl.toSendEnColl.length > 0) ? parseInt('00000001', 2) : 0;
        if (pl.toSendExColl.length > 0) {
            blockCode = (blockCode === 1) ? parseInt('00000011', 2) : parseInt('00000010', 2);
        }
        // new player block
        if (pl.toSendBlock !== 64000) {
            blockCode = fMath.setBit(blockCode, 7);
        }

        if (eatpush) {
            blockCode = fMath.setBit(blockCode, 2);
        }
        if (killFlag) {
            blockCode = fMath.setBit(blockCode, 3);
        }
        blockCode = fMath.setBit(blockCode, 4);
        if (bulletFlag) {
            blockCode = fMath.setBit(blockCode, 5);
        }
        if (pl.powerLevelChangeFlag) {
            blockCode = fMath.setBit(blockCode, 6);
        }
    }
    return blockCode;
};


LiveRoomknt.prototype.hasPlayer = function (id) {
    var pl = this.players[id];
    if (pl) {
        return true;
    }
    return false;
}

LiveRoomknt.prototype.addBlockDataToPlayer = function (pl, flags, toSend) {
    //player enters a new block
    if (+flags[0]) {
        // to send block is the block of the player position on the grid
        toSend.writeUInt16(pl.toSendBlock);
    }
    // enter new region
    if (+flags[7]) {
        // en coll are blocks that are intersecting with the player screen
        toSend.writeUInt8(pl.toSendEnColl.length);
        for (var i = 0; i < pl.toSendEnColl.length; i++) {
            toSend.writeUInt16(pl.toSendEnColl[i]);
            //   console.log('new region:' + pl.toSendEnColl[i]);
        }

        this.addFoodDataForPlBlock(toSend, pl.toSendEnColl);
    }
    // exiting region
    else if (+flags[6]) {
        toSend.writeUInt8(pl.toSendExColl.length);
        for (var i = 0; i < pl.toSendExColl.length; i++) {
            toSend.writeUInt16(pl.toSendExColl[i]);
        }
    }
    //both exit and enter
    else if (+flags[6] && +flags[7]) {
        toSend.writeUInt8(pl.toSendEnColl.length);
        toSend.writeUInt8(pl.toSendExColl.length);
        for (var i = 0; i < pl.toSendEnColl.length; i++) {
            toSend.writeUInt16(pl.toSendEnColl[i]);
        }
        for (var i = 0; i < pl.toSendExColl.length; i++) {
            toSend.writeUInt16(pl.toSendExColl[i]);
        }
    }
}
LiveRoomknt.prototype.withInWindowOrSpecOrMainPl = function (my, other, abs) {
    if (my.id === other.id) {
        return false;
    }
    var dx = abs(my.followPl.position[0] - other.happyPos[0]);
    var dy = abs(my.followPl.position[1] - other.happyPos[1]);
    var r = other.getPlSize();
    var calc = dx < (my.ww / 2 + r) && dy < (my.wh / 2 + r);

    if (!calc || other.dead) {
        return false;
    }
    return true;
}

LiveRoomknt.prototype.foodCollAction = function (pl, food, collFood) {
    var ret = this.serverBlocks.removeFood(collFood.block, collFood.id);
    this.toRemoveFood.push(ret);
    this.foodConsumedSinceLastSec++;
    this.foodConsumedForAFace++;
    pl.fuelTaken(food.value);
    this.eatPackets.push([pl.pid, food.x, food.y, food.value, food.type, collFood.block]);
};
// run on per player basis
LiveRoomknt.prototype.midColl = function (player) {
    var self = this;
    var ret = null;
    var bound = player.longBound();
    var happyBoundPl = null;
    var _sid = null;
    var __pl = null;
    var res = null;
    var v1 = 0;
    var v2 = 0;
    var v1f = 0;
    var _otherOne = null;
    var _sid = null;
    var v2f = 0;
    var sqv1 = 0;
    var sqv2 = 0;
    var vec = null;
    this.qt.find(bound, function (item) {
        // collision of player main collider with food
        if (item.type === CONF.ITEM_TYPES.FOOD) {
            ret = self.serverBlocks.collision_dot(item.id, item.block);
            if (ret && !ret.collD && PIC(ret.coll, player.foodCollider)) {
                self.foodCollAction(player, ret, item);
            }
        }
        /// its ny balloon
        else if (item.type === CONF.ITEM_TYPES.BULLET) {
            ret = self.bulletM.collision_bullet(item.id);
            _sid = self.pidToSocketId['' + item.pid];
            __pl = self.players['' + _sid];
            if (ret && item.pid !== player.pid && !player.popped && CIC(ret.coll, player.realCollider)) {

                self.bulletsToRem.push(ret.id);
                self.playerPopped(player.id, __pl);
            }
        } else if (item.type === CONF.ITEM_TYPES.ROOM_WALL) {
            if (item.p.x > 0) {
                v1 = player.vel[0] * (player.position[0] - item.p.x);
                v2 = true;
            } else {
                v1 = player.vel[1] * (player.position[1] - item.p.y);
                v2f = true;
            }

            if (v1 < 0 && PO_IN_C(self.roomColliders['' + item.id], player.realCollider)) {
                v2 && (player.vel[0] = -player.vel[0] * 1.5);
                v2f && (player.vel[1] = -player.vel[1] * 1.5);
            }

        } else if (item.type === CONF.ITEM_TYPES.FAN) {
            if (player.fanCollOn && CIC(self.fanColliders['' + item.id], player.realCollider)) {
                player.vel[0] = player.vel[0] * 4;
                player.vel[1] = player.vel[1] * 4;
                player.maxSpeed_N = CONF.PLA_SP_FAN;
            }

        } else if (item.type === CONF.ITEM_TYPES.PLAYER && item.id !== player.pid) {
            _sid = self.pidToSocketId['' + item.id];
            __pl = self.players['' + _sid];

            res = new S_R();
            if (__pl && __pl.deadOn && player.deadOn && CIC(player.happyCollider, __pl.legCollider)) {
                self.playerPopped(player.id, __pl);
            } else if (__pl && __pl.deadOn && player.deadOn && CIC(__pl.realCollider, player.realCollider, res)) {
                vec = res['overlapN'];
                if (res['aInB'] && res['bInA'] && __pl.botScript && player.botScript) {
                    vec.y = 1;
                    vec.x = 1;
                    v1 = 1000;
                    v2 = -1000;
                } else {
                    v1 = Math.min(1000, Math.max(-1000, __pl.vel[0] * vec.x + __pl.vel[1] * vec.y)); // vel of __pl along collision
                    v2 = Math.min(1000, Math.max(-1000, player.vel[0] * vec.x + player.vel[1] * vec.y)); // vel of player along collision    
                }
                v1f = v2;
                v2f = v1;
                __pl.vel[0] += (v1f - v1) * vec.x * 0.99;
                __pl.vel[1] += (v1f - v1) * vec.y * 0.99;
                player.vel[0] += (v2f - v2) * vec.x * 0.99;
                player.vel[1] += (v2f - v2) * vec.y * 0.99;
                player.cwp(0);
                __pl.cwp(0);


            }
        }
    });
};

LiveRoomknt.prototype.checkColl = function (pl, counter) {
    var blNo = -1;
    pl.updateNode(this.qt);
    this.bulletM.updateNode(this.qt);
    var ret = this.serverBlocks.getScreenBlocks(pl);
    if (pl.currBlock !== pl.lastBlock) {
        pl.toSendBlock = pl.currBlock;
    }
    if (pl.enterColl.length > 0) {
        pl.toSendEnColl = pl.enterColl;
    }
    if (pl.exitColl.length > 0) {
        pl.toSendExColl = pl.exitColl;
    }

    pl.exitColl = [];
    pl.enterColl = [];
    this.midColl(pl);

};
// LiveRoomknt.prototype.collision_Player2 = function (player, otherpl) {
//     if (!otherpl || !player) {
//         return;
//     }
//     var collPl = false;
//     var ppos = player.rPos;
//     if (otherpl.id !== player.id && (ABS(otherpl.rPos.x - ppos.x) - 15) < player.cx / 2 && ABS((otherpl.rPos.y - ppos.y) - 15) < player.cy / 2) {
//         collPl = otherpl.plCollOn && player.plCollOn && CIC(player.collider, otherpl.collider);
//         if (collPl && player.speed > CONF.PLA_SP_NOR) {
//             otherpl.applyCollForce(player.angle);
//         }
//         if (collPl && otherpl.speed > CONF.PLA_SP_NOR) {
//             player.applyCollForce(otherpl.angle);
//         }
//     }
// }

LiveRoomknt.prototype.startGame = function () {
    if (this.running) {
        return;
    }
    this.getGame().startGame(gameloop);
    this.running = true;
};

LiveRoomknt.prototype.playersCount = function () {
    if (!this.playersSocks) {
        return 0;
    }
    return this.playersSocks.length;
};


LiveRoomknt.prototype.removePlayer = function (socket, bot) {
    var ind = this.playersSocks.indexOf(socket.id);
    if (bot) {
        this.playersSocks.splice(ind, 1);
        delete this.pidToSocketId['' + this.players[socket.id].pid];
        delete this.topFFA['' + socket.id];
        this.players[socket.id] = undefined;
        delete this.players[socket.id];
        delete this.sockets[socket.id];
        return;
    }
    if (ind >= 0) {
        if (this.players[socket.id]) {
            if (!this.discObj['' + socket.id]) {
                this.discObj['' + socket.id] = [this.players[socket.id].pid, 'direct'];
            }
            delete this.pidToSocketId['' + this.players[socket.id].pid];
            delete this.topFFA['' + socket.id];
            delete this.battlePls['' + socket.id];
            this.players[socket.id] = undefined;
            delete this.players[socket.id];
        }
        this.playersSocks.splice(ind, 1);
        if (this.playersSocks.length === 0) {
            console.log('ALL players removed... from live room');
            this.players = {};
        }
        delete this.sockets[socket.id];
        this.removeSocketEvents(socket);
        return true;
    }
};
LiveRoomknt.prototype.validBlock = function (a) {
    if (a > minBlockNo && a < maxBlockNo) {
        return true;
    }
    return false;
};
LiveRoomknt.prototype.calcPlayerPos = function (bot) {
    var pos = [0, 0];
    var min = 40;
    var sb = this.serverBlocks;
    var lc = sb.blockCount();
    var bno = 0;
    var count = 0;
    if (bot) {
        bno = fMath.getRandom(minBlockNo, maxBlockNo);
        if (bno && bno >= 1) {
            pos = sb.getPositionInBlock(bno - 1);
        }
        return pos;
    }

    bno = fMath.getRandom(minBlockNo, maxBlockNo);
    
    if (bno && bno >= 1) {
        pos = sb.getPositionInBlock(bno - 1);
    }
    else {
        pos = sb.getPositionInBlock(33);
    }
    return pos;
};

LiveRoomknt.prototype.getP0Packet = function (sockid) {
    var pl = this.players[sockid] || '';
    var keys = Object.keys(this.players);
    var oPids = [];
    var otherPlCount = keys.length - 1;
    if (pl !== '') {
        var bw = new BW(50);
        var cl = pl.getColor();
        var face = pl.face;
        var weaponColor = pl.wColor;
        var skin = pl.skin;
        var pid = null;
        var name = null;
        var rotData = [];
        bw.writeUInt16(pl.pid);
        pl.name = fMath.replaceUni(pl.name);
        var name_len = Buffer.byteLength(pl.name, 'ucs2')
        bw.writeUInt8(name_len);
        bw.writeUInt8(cl.length);
        bw.writeUInt8(face.length);
        bw.writeUInt8(weaponColor.length);
        bw.writeStringUnicode(pl.name);
        bw.writeStringUtf8(cl);
        bw.writeStringUtf8(face);
        bw.writeStringUtf8(weaponColor);

        //  this.serverBlocks.writeSadData(bw);

        keys.length && bw.writeUInt16(otherPlCount);
        for (var i = 0; i < keys.length; i++) {
            pid = this.players[keys[i]].pid;
            if (pid !== pl.pid) {
                rotData = [];
                name = this.players[keys[i]].name;
                face = this.players[keys[i]].face;
                weaponColor = this.players[keys[i]].wColor;
                skin = this.players[keys[i]].skin;
                name = fMath.replaceUni(name);

                bw.writeUInt16(pid);
                name_len = Buffer.byteLength(name, 'ucs2');
                bw.writeUInt8(name_len);
                bw.writeStringUnicode(name);
                bw.writeUInt8(skin.length);
                bw.writeStringUtf8(skin);
                bw.writeUInt8(face.length);
                bw.writeStringUtf8(face);
                bw.writeUInt8(weaponColor.length);
                bw.writeStringUtf8(weaponColor);

            }
        }
        return [bw, this.players[sockid].pid, this.players[sockid].name, this.players[sockid].face, this.players[sockid].skin, this.players[sockid].wColor];
    }
};
LiveRoomknt.prototype.addBullet = function (pid, pos) {
    var ret = this.bulletM.addBullet(pid, pos);
    var pl = this.players[this.pidToSocketId[pid]];
    if (pl) {
        pl.addBullet(ret);
    }
};

LiveRoomknt.prototype.removeSocketEvents = function (socket) {
    socket.removeAllListeners('bk');
    socket.removeAllListeners('31');
    socket.removeAllListeners('56');
    socket.removeAllListeners('76');

    socket.removeAllListeners('66');
    socket.removeAllListeners('p1');
    socket.removeAllListeners('p2');
    socket.removeAllListeners('wr');
    socket.removeAllListeners('i');
};

LiveRoomknt.prototype.addPlayerEvents = function (socket, bot) {
    var $this = this;
    if (!bot) {
        socket.on('bk', function () {
            var pl = $this.players['' + socket.id];
            if (pl) {
                $this.battlePls[''+socket.id] = 1;
                pl.dead = false;
                pl.alreadyDead = false;
                pl.deadOn = true;
                pl.deadCounter = 0;
                pl.deadSpec = false;
                pl.popped = false;
                pl.lifeTime = 0;
                pl.servUpdate = pl.plUpdate;
                pl.position = $this.calcPlayerPos();
                 pl.respawn();
                var vw = new BW(10);
                vw.writeUInt16(pl.pid);
                vw.writeUInt8(Buffer.byteLength(pl.name, 'ucs2'));
                vw.writeStringUnicode(pl.name);
                vw.writeUInt8(pl.skin.length);
                vw.writeStringUtf8(pl.skin);
             
                vw.writeUInt8(pl.face.length);
                vw.writeStringUtf8(pl.face);
                vw.writeUInt8(pl.wColor.length);
                vw.writeStringUtf8(pl.wColor);
                $this.primus.forEach(function (spark, id, connections) {
                    if (id !== pl.id) {
                        spark.send('pn', vw.toBuffer());
                    }
                });


            }
        });
        socket.on('31', function (data) {
            var br = new BR(data);
            var key = br.readUInt8();
            var pl = $this.players['' + socket.id];
            if (pl) {
                pl.toSendMsg = pl.chat['' + key];
            }
        });
        socket.on('96', function (data) {
            var _br = new BR(data);
            var dt = _br.readUInt8();
            socket.send('66')
            socket.end();
        });
        socket.on('86', function (data) {
            var _br = new BR(data);
            var dt = _br.readUInt8();
            socket.send('85')
            socket.end();
        });
        //what to do with the spectating socket
        socket.on('56', function (data) {
            var _br = new BR(data);
            var dt = _br.readUInt8();
            if (dt == 1) {
                socket.send('76')
            } else {
                socket.send('66')
                socket.end();
            }

        });


        socket.on('p1', function (data) {

            var br = new BR(data);
            var ctime = br.readUInt32();


            var bw = new BW(20);
            var pl = $this.players[socket.id];
            pl.clientTime1 = ctime;
            var pos = pl.position;
            bw.writeInt16(pos[0]);
            bw.writeInt16(pos[1]);
            socket.send('p2', bw.toBuffer());
        });
        // window resize packet frm the client
        socket.on('wr', function (data) {
            var packet = new BR(data);
            var ww = packet.readUInt16();
            var wh = packet.readUInt16();
            var pl = $this.players[socket.id];
            pl && pl.updateWindowSize(ww, wh);

        });

        // input packet from client
        socket.on('i', function (data) {
            var br = new BR(data),
                pl = $this.players[socket.id],
                leftClick = 0,
                leftArrow = 0,
                space = 0,
                rightArrow = 0,
                ctrl = 0,
                _nowTime = 0;

            if (!pl) {
                return;
            }
            pl.inputPackNumber++;
            pl.clientTime1 = br.readUInt32();
            ctrl = br.readUInt8();
            space = br.readUInt8();
            leftArrow = br.readUInt8();
            rightArrow = br.readUInt8();
            leftClick = br.readUInt8();

            _nowTime = fMath.clockMilli($this.fpt);
            pl.servLogTime1 = _nowTime - pl.plStartTime;
            pl.lastInputTime = _nowTime;


            if (+ctrl === 1) {
                if (pl.attack() && !pl.dead)
                    $this.addBullet(pl.pid, [pl.position[0], pl.happyPos[1] - pl.happyRadius]);
            }
            if (+space === 1) {
                pl.space();
            } else if (+space === 6) {
                pl.spaceUp();
            }
            if (+leftArrow === 1) {
                pl.leftArrow();
            } else if (+leftArrow === 6) {
                pl.leftArrowUp();
            }
            if (+rightArrow === 1) {
                pl.rightArrow();
            } else if (+rightArrow === 6) {
                pl.rightArrowUp();
            }
            if ((+leftClick === 1)) {
                pl.leftClick();
            } else if ((+leftClick === 6)) {
                pl.leftClickUp();
            }

        });
    }
};

LiveRoomknt.prototype.processBotInput = function (id, data) {
    var pl = this.players[id];
}

LiveRoomknt.prototype.removeBot = function (botId) {
    var found = this.botIds.indexOf(botId);
    if (found) {
        this.botIds.splice(found, 1);
    }else{
        console.log('bot not found');
    }
    var item = this.players[botId];
    if (item) {

        this.removePlayer(item.botScript.botSocket, true);
    }
};

LiveRoomknt.prototype.switchCamToPlayer = function (pl) {
    var bw = new BW();
    bw.writeUInt16(pl.pid);
    var sock = this.sockets[pl.id];
    if (sock) {
        sock.send('8', bw.toBuffer());
    }
};



LiveRoomknt.prototype.playerPopped = function (sid, byPl) {
    var ret = 0;
    var by = 'unknown';
    if (byPl) {
        by = byPl.name;
    }
    var pl = this.players[sid];
    if (!pl.deadOn) {
        return;
    }
    pl.position[0] = pl.position[0] || 0;
    pl.position[1] = pl.position[1] || 0;
    
    this.createMurderFood(pl.position, pl.dotsEaten);

    this.toRemFromLb.push(sid);

    pl.setPopped(this.qt, by);
    if (byPl) {
        byPl.vel[1] = -250;
        ret = byPl.incKills(this.sockets[byPl.id]);
        byPl.killFlag = '' + pl.name;
       
    }
};

LiveRoomknt.prototype.createBot = function () {
    var $this = this;
    var bot = new BotScript();
    var name = bot.init();
    name = fMath.replaceUni(name);
    var skin = "#ffe0bd";
    var faceName = 'cow';
    this.botIds.push(bot.botSocket.id);
    this.addPlayer(null, 1920, 1080, 0, bot.botSocket, name, 'ff', skin, faceName, bot);
    var weaponClr = this.players[bot.botSocket.id].wColor;
    var vw = new BW(10);
    var len = 0;
    vw.writeUInt16(this.playerIndex);
    len = Buffer.byteLength(name, 'ucs2');
    vw.writeUInt8(len);
    vw.writeStringUnicode(name);

    vw.writeUInt8(skin.length);
    vw.writeStringUtf8(skin);
    vw.writeUInt8(faceName.length);
    vw.writeStringUtf8(faceName);
    vw.writeUInt8(weaponClr.length);
    vw.writeStringUtf8(weaponClr);

    this.primus.forEach(function (spark, id, connections) {
        if ($this.players['' + id]) {
            spark.send('pn', vw.toBuffer());
        }

    });
};

LiveRoomknt.prototype.getRandomWeaponColor = function () {
    var clrs = CONF.WEAPON_COLORS;
    var len = clrs.length;
    var rand = fMath.getRandom(0, len);
    return CONF.WEAPON_COLORS[rand];
};
LiveRoomknt.prototype.addWatchPlToGame = function (id, ww, wh) {
    if (this.playersSocks.indexOf(sock.id) >= 0) {
        return;
    }
    var pos = [500, 500];
    this.watchPlList[id] = new WatchPl(id, pos);
    this.players[id] = this.watchPlList[id];

};
LiveRoomknt.prototype.addPlayerToGame = function (cdata, ww, wh, ctime, id, pname, skin, face, bot) {
    var pos = this.calcPlayerPos(bot);
    var team = 0;
    var weaponColor = this.getRandomWeaponColor();
    if (this.playerIndex > 65000) {
        this.playerIndex = 0;
    }
    this.playerIndex++;
    if (!bot) {
        this.battlePls['' + id] = 1;
    }
    if (this.teamData[0] >= this.teamData[1]) {
        team = TeamType.BLUE;
    } else {
        team = TeamType.RED;
    }
    this.players[id] = new Player(this.BELLY, cdata, ww, wh, ctime, bot, this.playerIndex, this.fpt, id, pos, pname, skin, face, weaponColor, team);
    this.players[id].deadFlagFn = this.setPlayerFlags.bind(this);
    this.players[id].deadFlagFn2 = this.setPlayerFlags2.bind(this);
    this.players[id].deadBFunc = this.writeBaseRepeatData.bind(this);
    this.topFFA['' + id] = [0,0];
    this.pidToSocketId['' + this.playerIndex] = id;
    this.playersSocks.push(id);
};

LiveRoomknt.prototype.getPeopleCount = function(){
    return [this.realPlCount,this.botCount];
};

LiveRoomknt.prototype.initPlayer = function (id) {

};
LiveRoomknt.prototype.addPlayer = function (cdata, ww, wh, ctime, sock, pname, fname, skin, face, bot) {
    if (this.playersSocks.indexOf(sock.id) >= 0) {
        return;
    }
    var ret = null;
    var name = pname;
    this.addPlayerToGame(cdata, ww, wh, ctime, sock.id, name, skin, face, bot)
    this.sockets[sock.id] = sock;
    this.addPlayerEvents(sock, bot);
};

LiveRoomknt.prototype.getPlayers = function () {
    return this.playersSocks;
};