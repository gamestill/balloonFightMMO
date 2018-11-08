var VSOCKETS = {};
var Conf = require('./gameConf.js');
var Logger = require('./lib/Logger.js');
var BadWordManager = require('./managers/badWordManager.js');
var CODES = require('./../primuscodes.js');
var Game = require('./../share/game.js');
var keys = require('./../share/keyboard.js');
var LiveRoomknt = require('./liveroomknt.js');
var BW = require("./lib/BinaryWriter.js");
var BR = require("./lib/BinaryReader.js");
var http = require('http');
var liveRooms = {}; // liverooms
var rClient = null;

var myRegionCode = process.env.REGION;
var CURR_GAME_MODE = process.env.GAME_MODE;
var LIVEROOM_NAME = '' + Conf.SERVER_CODE_TO_REGION_NO_UNDER[myRegionCode] + '_' + CURR_GAME_MODE.toLowerCase() + '_' + Conf.SERVER_CODE;


function removePlayer_live(socket, name) {
    if (!liveRooms["" + name]) {
        return [false, false];
    }
    var liveRoom = liveRooms["" + name].liveroom;
    var liveid = null;
    if (liveRoom) {
        liveid = liveRoom.ownerId;
        var flag = liveRoom.removePlayer(socket);
        if (flag) {
            if (liveRoom.playersCount() === 0) {
                liveRoom.clearRoom();
                console.log('room empty');
                return [true, true];
            } else {
                return [true, false]
            }
        }
    }
    return [false, false];
}

function removeFromLiveRoom(name, socket) {
    var sockid = socket.id;
    if (!VSOCKETS[sockid]) {
        console.error('cannot remove from live room');
        return;
    }
    var live_index = VSOCKETS[socket.id];
    if (!live_index || !liveRooms["" + name]) {
        return null;
    }
    var ret = liveRooms["" + name][live_index].liveroom.removePlayer(sockid);
    if (ret) {
        return ret;
    }
    return null;
}

function createNewLiveRoom(rclient, primus, roomId,serverBlocks) {
    if (Object.hasOwnProperty('' + roomId)) {
        delete liveRooms["" + roomId];
    }
    liveRooms["" + roomId] = {};
    myLiveRoom = liveRooms['' + roomId];
    myLiveRoom.liveroom = new LiveRoomknt(rclient, primus, roomId, serverBlocks);
}

function addToLiveRoom(rclient, primus, roomId, socket, pname, skin, face, serverBlocks, itemManager, ctime, ww, wh, cdata, cb) {
    var myLiveRoom = liveRooms["" + roomId];
    if (myLiveRoom) {
        myLiveRoom.liveroom.addPlayer(cdata, ww, wh, ctime, socket, pname, 'fname', skin, face, null);
        cb();
    }     
}

module.exports = {
    setRedisClient: function (cl) {
        rClient = cl;
    },
    setCurrMode: function (mode) {
        console.log('mode is:' + mode);
    },
    createVSocket: function (id,uuid) {
        if (VSOCKETS['' + id]) {
            return;
        }
        VSOCKETS['' + id] = {
            'uuid':uuid,
            'liveroom':null
        };
    },
    createNewLiveRoom_lobby : function(rClient,primus,roomId,serverBlocks){
        createNewLiveRoom(rClient,primus,roomId,serverBlocks);
    },
    getPeopleCount: function(){
        var join = liveRooms["" + LIVEROOM_NAME];
        if (join) {
           return join.liveroom.getPeopleCount();
        }
        return [0,0];
    },
    transferPlayerToLiveRoom: function (rclient, primus, livename, socket, prevroom, pname, skin, face, serverBlocks, itemManager, ctime, ww, wh, cdata) {
        if (!VSOCKETS['' + socket.id]) {
            console.log('cannot add player as the virtual socket is not found:' + socket.id);
            return;
        }
        VSOCKETS[socket.id]['liveroom'] = livename;
        addToLiveRoom(rclient, primus, livename, socket, pname, skin, face, serverBlocks, itemManager, ctime, ww, wh, cdata, function (error) {
            var join = liveRooms["" + livename];
            if ( join) {
                join.liveroom.startGame();
                var errorCode = new BW(1);
                var playerStartData = join.liveroom.getP0Packet(socket.id);
                var myself_pid = playerStartData[1];
                var myself_name = playerStartData[2];
                var myself_face = playerStartData[3];
                var myself_skin = playerStartData[4];
                var myself_weapon_color = playerStartData[5];
                var mySocketId = socket.id;
                var qq = 0;
                primus.forEach(function (spark, id, connections) {
                    if (id !== mySocketId && join.liveroom.hasPlayer(id)) {
                        var vw = new BW(10);
                        vw.writeUInt16(myself_pid);
                        var __len = Buffer.byteLength(myself_name, 'ucs2');
                        vw.writeUInt8(__len);
                        vw.writeStringUnicode(myself_name);
                        vw.writeUInt8(myself_skin.length);
                        vw.writeStringUtf8(myself_skin);
                        vw.writeUInt8(myself_face.length);
                        vw.writeStringUtf8(myself_face);
                        vw.writeUInt8(myself_weapon_color.length);
                        vw.writeStringUtf8(myself_weapon_color);
                        spark.send('pn', vw.toBuffer());
                    }
                });
                if (error) {
                    if (error === 'full') {
                        errorCode.writeUInt8(Conf.ERROR_CODE.ROOM_FULL);
                    } else {
                        errorCode.writeUInt8(Conf.ERROR_CODE.UNKNOWN_ERROR);
                    }
                    socket.send('e0', errorCode.toBuffer());
                }
                socket.send('p0', playerStartData[0].toBuffer());
            }
        });

    },
    getUUIDforId:function(id){
        if(VSOCKETS[''+ id]){
            return VSOCKETS[''+id].uuid;
        }
    },
    removePlayerFromLiveRoom: function (socket) {
       var ret = null;
        if (!VSOCKETS['' + socket.id]) {
            console.error('player not found in room:' + socket.id);
            return null;
        }
        var name = VSOCKETS[socket.id]['liveroom'];
        if (name && liveRooms[name] && socket.id) {
            var flag = removePlayer_live(socket, name);
            if (flag[0] == true && flag[1] == false) {
                liveRooms[name].total = Math.max(0, --liveRooms[name].total);
               ret = false;
            } else if (flag[0] == true && flag[1] == true) {
                ret = true;
            }
        }
        delete VSOCKETS['' + socket.id];
        return ret;        
    }
};