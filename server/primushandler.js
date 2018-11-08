// first package features code bytes:
// byte1: league
// byte2: profile
// byte3: bonus coins
// byte 4: shop
// byte5: play
// byte6: tag
//byte 7: quests
// byte 8 : debugmode
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var Conf = require('./gameConf.js');

var myRegionCode = process.env.REGION;
var FMath = require('./fastmath.js');
var RedisHandler = require('./redishandler.js');
var redisHandler = null;
var fMath = new FMath();
var baseSClock = fMath.clockMilli();
FMath.prototype.baseClock = baseSClock;

var BW = require("./lib/BinaryWriter.js");
var BR = require("./lib/BinaryReader.js");
var dumbData = new BW(1);
dumbData.writeUInt8(3);
dumbData = dumbData.toBuffer();

var CHANNELS_LIST = [];
var serverBlocks = null;
var itemManager = null;
var CURR_GAME_MODE = process.env.GAME_MODE;
if (CURR_GAME_MODE === null || CURR_GAME_MODE === 'undefined' || CURR_GAME_MODE === undefined) {
    console.error("GAME MODE NOT DEFINED");
    return;
}
var LIVEROOM_NAME = '' + Conf.SERVER_CODE_TO_REGION_NO_UNDER[myRegionCode] + '_' + CURR_GAME_MODE.toLowerCase() + '_' + Conf.SERVER_CODE;
var CURR_GAME_MODE_small = ('' + CURR_GAME_MODE).toLowerCase();


var pingTimeVal = Conf.PINGTIME;
var lobbyTimer = Conf.LobbyTimer;
var AD_DATA = require('./gameConf.js').AdData;
var CODES = require('./../primuscodes.js');
var lobby = require('./lobby.js');
var clientDisc = require('./clientTimeout.js');
var storeConnect = require('./storeconnect.js');
var btoa = require('btoa');
var GAME_VERSION = require('./../debugmode.js').version;
Conf.GAME_VER = ('' + GAME_VERSION).split('.')[2];
var maxRoomCountPerArea = Conf.MAX_ROOM_COUNT_CAPTURE_MODE;
var confSet = false;
Conf.MODE_NAMES = {};
Conf.MODES_TO_STR = {};
Conf.E_MODES = {};
Conf.MODE_CUP = {};
var files = Conf.FILES;

var AdData = [];
var i = 0;
if (AD_DATA.length && AD_DATA.length > 0) {
    for (i = 0; i < AD_DATA.length; i++) {
        AdData.push(AD_DATA[i].url);
    }
    for (i = 0; i < AD_DATA.length; i++) {
        AdData.push(AD_DATA[i].link);
    }
}

var wd = {
    ws: Conf.WORLD_SIZE,
    ge_sc: Conf.GRID_ELE_SCALE,
    ge_si: Conf.GRID_ELE_SIZE,
    wsp: Conf.NO_OF_GRID_BLOCKS,
    nb: Conf.NO_OF_GRID_BLOCKS,
    qq: Conf.GRID_RECT_SPRITE_P_BLOCK
};

function createNewLiveRoom(serverBlocks, primus) {
    lobby.createNewLiveRoom_lobby(redisHandler, primus, LIVEROOM_NAME, serverBlocks);
}

function setModesConf(modes) {
    if (confSet === false) {
        var m_names = Conf.MODE_NAMES;
        var m_t_str = Conf.MODES_TO_STR;
        var m_to_num = Conf.E_MODES;
        var m_cup = Conf.MODE_CUP;
        var const_mode = Conf.MODE_CUP_CONST;
        var const_modes_packet = Conf.MODE_CUP_PACKET;
        for (var i = 0; i < modes.length; i++) {
            m_names['' + modes[i]] = '' + modes[i];
            m_t_str['' + (i + 1)] = '' + modes[i];
            m_to_num['' + modes[i]] = Number(i + 1);
            m_cup['' + modes[i]] = '' + const_mode + '.' + const_modes_packet[i];
        }
        confSet = true;
    }

}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4();
}



var gmodes = [];
var modes = Conf.MODES;
var citiesCount = {};
for (var i = 0; i < modes.length; i++) {
    var __mtemp = ('' + modes[i]).toLowerCase();
    gmodes.push(__mtemp);
}
setModesConf(modes);

function sendBaseData(spark, id) {
    var adMsg = new BW(2);
    var data = Conf.RATE.INPUT_LOOP_RATE;
    var MAX_WING_DEPTH = Math.pow(2, Conf.MAX_WING_DEPTH) / 2;
    var WING_LEN_FOR_COOL_WINGS = Conf.MIN_LEN_FOR_COOL_WINGS;
    adMsg.writeInt8(Conf.COMBO_TIME);
    adMsg.writeUInt8(Conf.TIME_GAP_BETWEEN_COMP);
    adMsg.writeInt8(Conf.SERVER_BLOCKS_COUNT);
    adMsg.writeUInt16(Conf.BALL_TIME_PENETRATION);
    adMsg.writeUInt16(Conf.MIN_MASS_FOR_HELPER);
    adMsg.writeFloat(Conf.MASS_TO_WEIGHT);
    adMsg.writeFloat(Conf.CAM_DEFAULT_ZOOM);
    adMsg.writeFloat(Conf.CAM_MAX_ZOOM);
    adMsg.writeUInt8(MAX_WING_DEPTH);
    adMsg.writeUInt8(Conf.BABY_WING_LEN_COUNT);
    adMsg.writeUInt8(WING_LEN_FOR_COOL_WINGS);

    adMsg.writeUInt16(data);

    adMsg.writeUInt8(Conf.LEADERBOARD_MAX);
    spark.send('z11', adMsg.toBuffer());
};

function sendskinData(spark, id) {
    var adMsg = new BW(2);
    var data = Conf.SKIN_NAMES;
    var name = '';
    var len = 0;
    var keys = Object.keys(data);
    var catData = [];
    var catName = '';
    adMsg.writeUInt16(Conf.SKIN_LOW);
    adMsg.writeUInt16(Conf.SKIN_HIGH);
    adMsg.writeUInt8(keys.length); // no of cat

    for (var j = 0; j < keys.length; j++) {
        catData = data[keys[j]];
        catName = keys[j];
        adMsg.writeUInt8(catName.length);
        adMsg.writeStringUtf8(catName);
        adMsg.writeUInt16(catData.length);
        for (var i = 0; i < catData.length; i++) {
            len = catData[i].length;
            adMsg.writeUInt8(len);
            adMsg.writeStringUtf8(catData[i]);
        }
    }
    spark.send('b1', adMsg.toBuffer());
};

function sendGameMode(spark, id) {
    var adMsg = new BW(40);
    var mode = Conf.MODES;
    var defaultMode = 1;
    adMsg.writeUInt8(mode.length);
    adMsg.writeUInt8(1);
    for (var i = 0; i < mode.length; i++) {
        adMsg.writeUInt8(mode[i].length);
        adMsg.writeStringUtf8(mode[i]);
    }
    spark.send('z0', adMsg.toBuffer());
}

function sendRegions(spark, id) {
    var adMsg = new BW(10);
    var reg = Conf.SERVER_REGIONS;
    var reg2 = Conf.SERVER_REGIONS_2;
    adMsg.writeUInt8(reg.length);
    for (var i = 0; i < reg.length; i++) {
        adMsg.writeUInt8(reg[i].length);
        adMsg.writeStringUtf8(reg[i]);
    }
    for (var i = 0; i < reg2.length; i++) {
        adMsg.writeUInt8(reg2[i].length);
        adMsg.writeStringUtf8(reg2[i]);
    }
    spark.send('z2', adMsg.toBuffer());
}

function sendGraphics(spark, id) {
    var adMsg = new BW(100);
    var mode = Conf.GRAPHIC_TYPES;
    adMsg.writeUInt8(mode.length);
    for (var i = 0; i < mode.length; i++) {
        adMsg.writeUInt8(mode[i].length);
        adMsg.writeStringUtf8(mode[i]);
    }
    spark.send('z3', adMsg.toBuffer());
}

function sendLBData(spark, id) {
    var adMsg = new BW(40);
    var mode = Conf.LB_CHART;
    adMsg.writeUInt8(mode.length);
    for (var i = 0; i < mode.length; i++) {
        adMsg.writeUInt8(mode[i].length);
        adMsg.writeStringUtf8(mode[i]);
    }
    spark.send('z1', adMsg.toBuffer());
}


function sendAdMsg(spark, id) {
    var adMsgSize = [];
    var adMsg = new BW(100);
    var ADS_COUNT = AdData.length / 2;
    var i = 0;
    adMsg.writeUInt8(AdData.length); // ist bit no of ads
    for (i = 0; i < AdData.length; i++) {
        adMsg.writeUInt8(AdData[i].length);
    }

    for (i = 0; i < ADS_COUNT; i++) {
        adMsg.writeStringUtf8(AdData[i]);
    }
    for (i = ADS_COUNT; i < 2 * ADS_COUNT; i++) {
        adMsg.writeStringUtf8(AdData[i]);
    }
    spark.send('a0', adMsg.toBuffer());
}

//a1
function send2BytesMsg(spark, id) {
    var msg = new BW(4);
    var idleTout = Conf.IDLE_TIMEOUT;
    var maxTag = Conf.Tags_Max;
    var arr = [Conf.MATCH_TIME_POP, idleTout, maxTag, Conf.POWER_BAR_MAX.length];
    for (var i = 0; i < Conf.POWER_BAR_MAX.length; i++) {
        arr.push(Conf.POWER_BAR_MAX[i]);
    }
    for (var i = 0; i < arr.length; i++) {
        msg.writeUInt16(arr[i]);
    }
    msg.writeUInt16(56565);
    msg.writeUInt16(Conf.DOUBLE_MODE_TIME);

    spark.send('a1', msg.toBuffer());
}
//a2
function sendGameVerMsg(spark, id) {
    var adMsg = new BW(9);
    var plName = Conf.DEFAULT_PLAYER_NAME;
    var __len = Buffer.byteLength(plName, 'ucs2');
    adMsg.writeUInt8(__len);
    adMsg.writeStringUnicode(plName);
    adMsg.writeUInt8(Conf.GAME_VER.length);
    adMsg.writeUInt8(Conf.GAME_STAGE.length);
    adMsg.writeStringUtf8(Conf.GAME_VER);
    adMsg.writeStringUtf8(Conf.GAME_STAGE);
    spark.send('a2', adMsg.toBuffer());

}

//a4
function sendScalarMsg(spark, id) {
    var msg = new BW(8);
    var arr = [Conf.DEL_SCALE_EAT, Conf.DEL_SCALE_PARK];
    for (var i = 0; i < arr.length; i++) {
        msg.writeFloat(arr[i]);
    }
    spark.send('a4', msg.toBuffer());
}
//a5
function sendFileBaseData(spark, id) {
    var msg = new BW(30);
    msg.writeUInt8(Conf.FILES_PARENT.length);
    msg.writeUInt8(Conf.FILES_SPARENT.length);
    msg.writeUInt8(Conf.FILES_EXT.length);
    var arr = [Conf.FILES_PARENT, Conf.FILES_SPARENT, Conf.FILES_EXT];
    for (var i = 0; i < arr.length; i++) {
        msg.writeStringUtf8(arr[i]);
    }
    spark.send('a5', msg.toBuffer());
}
//a6
function sendRingsData(spark, id) {

}

function sendDotData(spark, id) {
    var msg = new BW(100);
    var dots = Conf.DOT_CHART;
    var dot_scales = Conf.DOT_SCALES;
    var dot_count = dots.length;
    var i = 0;
    msg.writeUInt8(dot_count);
    for (i = 0; i < dot_count; i++) {
        msg.writeStringUtf8(dots[i]);
    }
    for (i = 0; i < dot_count; i++) {
        msg.writeUInt8(dot_scales[i]);
    }
    spark.send('a7', msg.toBuffer());
}

function mainFn(primus, spark, restart) {
    var i = 0;

    var gameMode = CURR_GAME_MODE_small;
    if (!restart) {
        sendBaseData(spark, spark.id);
        sendskinData(spark, spark.id);
        sendGameMode(spark, spark.id);
        sendLBData(spark, spark.id);
        sendRegions(spark, spark.id);
        sendGraphics(spark, spark.id);
        sendAdMsg(spark, spark.id);
        send2BytesMsg(spark, spark.id);
        sendGameVerMsg(spark, spark.id);
        sendScalarMsg(spark, spark.id);
        sendFileBaseData(spark, spark.id);
        sendDotData(spark, spark.id);
    }
}

function addEvents(primus, spark) {
    spark.on(Conf.SERVER_SHUTDOWN_CODE, function () {
        primus.forEach(function (spark, id, connections) {
            var vw = new BW(2);
            var time = Math.floor(Conf.SERVER_SHUTDOWN_TIME / 1000);
            vw.writeUInt16(time);
            spark.send('zzz', vw.toBuffer());
        });
        primus.destroy({
            timeout: Conf.SERVER_SHUTDOWN_TIME
        });
    });

    spark.on('g', function (data) {
        var shopOpen = true;
        var br = new BR(data);
        var nameLen = 0;
        var name = '';
        var index = 0;
        var avtarColor = 0;
        var avtarName = '';
        var avtarNameLen = 0;
        var colorLen = 0;
        var faceLen = 0;
        var faceSkin = '';
        var chatOn = 0;
        var chatLen = 0;
        var chatData = [];
        for (var i = 1; i < 9; i++) {
            chatData['' + i] = null;
        }
        var chatKey = 0;
        var ctime = br.readUInt32();
        var istByte = br.readUInt8();
        var ww = br.readUInt16();
        var wh = br.readUInt16();
        if (istByte === 254) {
            shopOpen = false;
            nameLen = br.readUInt8();
            name = br.readStringUnicode(nameLen);
            colorLen = br.readUInt8();
            avtarColor = br.readStringUtf8(colorLen);
            faceLen = br.readUInt8();
            faceSkin = br.readStringUtf8(faceLen);
            chatOn = br.readUInt8();
            if (chatOn === 2) {
                chatLen = br.readUInt8();
                for (var i = 0; i < chatLen; i++) {
                    chatKey = br.readUInt8();
                    chatMsgLen = br.readUInt8();
                    chatData['' + chatKey] = br.readStringUnicode(chatMsgLen);
                }
            }
        }
        name = name.replace(/[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g, '');

        lobby.transferPlayerToLiveRoom(redisHandler, primus, LIVEROOM_NAME, spark, null, name, avtarColor, faceSkin, serverBlocks, itemManager, ctime, ww, wh, chatData);
    });
    // IDLE PACKET
    // spark.on('id', function () {
    //     disconnectFucker(spark);
    // });
}

function addStoreEvents(spark, spark) {}

function sendJpgFilesPacket(spark, id) {
    var fgj = new BW(50);
    var jpgFiles = Conf.GUEST_FILES_JPG;
    fgj.writeUInt8(jpgFiles.length);
    for (i = 0; i < jpgFiles.length; i++) {
        fgj.writeUInt8(jpgFiles[i].length);
    }
    for (i = 0; i < jpgFiles.length; i++) {
        fgj.writeStringUtf8(jpgFiles[i]);
    }
    spark.send('fgj', fgj.toBuffer());
}

function sendObjFilesPacket(spark, id) {
    var fgj = new BW(50);
    var perElementSize = Conf.GUEST_FILES_OBJ[0].length;
    var elements = Conf.GUEST_FILES_OBJ;
    var len = elements.length;
    fgj.writeUInt8(len);
    fgj.writeUInt8(perElementSize);
    for (i = 0; i < len; i++) {
        fgj.writeStringUtf8(elements[i]);
    }
    spark.send('fgpo', fgj.toBuffer());

}

function sendSpawnFilesPacked(spark, id) {}

function sendAniFilesPacked(spark, id) {
    var fgj = new BW(5);
    if (Conf.GUEST_FILES_ANI.length > 0) {
        var perElementSize = Conf.GUEST_FILES_ANI[0].length;
        var elements = Conf.GUEST_FILES_ANI;
        var len = elements.length;
        fgj.writeUInt8(len);
        fgj.writeUInt8(perElementSize);
        for (i = 0; i < len; i++) {
            fgj.writeStringUtf8(elements[i]);
        }
    }
    spark.send('fgpa', fgj.toBuffer());
}

function sendGemFilesPacked(spark, id) {

}

function sendStylesFilesPacked(spark, id) {

}

function sendPowerFilesPacked(spark, id) {

}

function sendSocialFilesPacked(spark, id) {
    var fgj = new BW(50);
    if (Conf.GUEST_FILES_SOCAIL.length > 0) {
        var perElementSize = Conf.GUEST_FILES_SOCAIL[0].length;
        var elements = Conf.GUEST_FILES_SOCAIL;
        var len = elements.length;
        fgj.writeUInt8(len);
        fgj.writeUInt8(perElementSize);
        for (i = 0; i < len; i++) {
            fgj.writeStringUtf8(elements[i]);
        }
    }

    spark.send('fgpso', fgj.toBuffer());
}

function sendWeaponFilesPacked(spark, id) {

}

function sendTagFilesPacked(spark, id) {}

function sendShopFilesPacked(spark, id) {
    var fgj = new BW(50);
    if (Conf.GUEST_FILES_SHOP.length > 0) {
        var perElementSize = Conf.GUEST_FILES_SHOP[0].length;
        var elements = Conf.GUEST_FILES_SHOP;
        var len = elements.length;
        fgj.writeUInt8(len);
        fgj.writeUInt8(perElementSize);
        for (i = 0; i < len; i++) {
            fgj.writeStringUtf8(elements[i]);
        }
    }
    spark.send('fgpsh', fgj.toBuffer());
}

function sendSkinNamesPacked(spark, id) {
    var buf = new BW(150);
    buf.writeUInt8(22);
    spark.send('fgpsk', buf.toBuffer());
}

function sendFilesPacket(spark) {
    var id = spark.id;
    sendSkinNamesPacked(spark, id);
    sendJpgFilesPacket(spark, id);
    sendObjFilesPacket(spark, id);
    sendSpawnFilesPacked(spark, id);
    sendAniFilesPacked(spark, id);
    sendGemFilesPacked(spark, id);
    sendStylesFilesPacked(spark, id);
    sendPowerFilesPacked(spark, id);
    sendWeaponFilesPacked(spark, id);
    sendSocialFilesPacked(spark, id);
    sendTagFilesPacked(spark, id);
    sendShopFilesPacked(spark, id);
}

function getSuffix() {
    var suff = fMath.firstPackSuffix();
    Conf.PACKET_A = suff;

    var zp = new BW(2);
    zp.writeUInt16(suff);
    return zp;
}

function everyFiveSec() {

};

module.exports = function (app, primus, GAME_STATUS, sblocks, items) {



    if (GAME_STATUS === Conf.GAME_STATUS_N.live) {
        redisHandler = new RedisHandler(primus);
    } else if (GAME_STATUS === Conf.GAME_STATUS_N.local) {
        redisHandler = new RedisHandler(primus);
    }
    require('./statsrequest.js')(app, redisHandler, GAME_STATUS);
    serverBlocks = sblocks;

    createNewLiveRoom(serverBlocks, primus);
    primus.on('connection', function (spark) {
        if (GAME_STATUS === Conf.GAME_STATUS_N.live || GAME_STATUS === Conf.GAME_STATUS_N.local) {
            var uuid = myRegionCode + '' + uuidv4();
            redisHandler && redisHandler.newPlayer(spark.id, uuid);
            lobby.createVSocket(spark.id, uuid);
            var zp = getSuffix();
            if (process.env.MAIN_T) {
                spark.send('44', zp.toBuffer());
            }
            spark.send('11', zp.toBuffer());
            spark.on('12', function (data) {
                var _ver = new BW(1);
                _ver.writeUInt8(63);
                spark.send('' + Conf.PACKET_A, _ver.toBuffer());
            });
            spark.on(Conf.PACKET_A, function (data) {
                var br = new BR(data);
                var bb = br.readUInt8();
                var restart = false;
                // ist start
                if (bb === 21) {
                    restart = false;
                }
                //already started
                else if (bb === 23) {
                    restart = true;
                }
                spark.removeAllListeners(Conf.PACKET_A);
                mainFn(primus, spark, restart);
                addEvents(primus, spark);
                addStoreEvents(primus, spark);

                if (restart) {
                    var restart_blank = new BW(1);
                    restart_blank.writeUInt8(55);
                    spark.send('rg', restart_blank.toBuffer());
                }
                // send files packet data
                spark.on('a9', function () {
                    spark.removeAllListeners('a9');
                    sendFilesPacket(primus, spark);
                });
            });
            // on restart
            spark.on('rfr', function () {
                spark.removeAllListeners('rfr');
                var bw = new BW(20);
                var data = [Conf.WORLD_SIZE, Conf.NO_OF_GRID_BLOCKS, Conf.GRID_RECT_SPRITE_P_BLOCK, Conf.GRID_ELE_SIZE, Conf.GRID_ELE_SCALE];
                bw.writeUInt32(data[0]);
                bw.writeUInt32(data[1]);
                bw.writeUInt16(data[2]);
                bw.writeUInt16(data[3]);
                bw.writeFloat(data[4]);
                spark.send('fset', bw.toBuffer());
            });

            // normal
            spark.on('fr', function () {
                spark.removeAllListeners('fr');
                var bw = new BW(20);
                var data = [Conf.WORLD_SIZE, Conf.NO_OF_GRID_BLOCKS, Conf.GRID_RECT_SPRITE_P_BLOCK, Conf.GRID_ELE_SIZE, Conf.GRID_ELE_SCALE];
                bw.writeUInt32(data[0]);
                bw.writeUInt32(data[1]);
                bw.writeUInt16(data[2]);
                bw.writeUInt16(data[3]);
                bw.writeFloat(data[4]);
                spark.send('fset', bw.toBuffer());
            });

            // deals with player tags in the menu
            spark.on('ts', function (data) {

                var br = new BR(data);
                var count = br.readUInt8() || '';

                if (count !== '') {
                    count = count - 1;
                    var bw = new BW(2);
                    if (count <= (Conf.Tags_Max - 1)) {

                        bw.writeUInt8(55);
                        spark.send('t1', bw.toBuffer());
                    } else {

                        bw.writeUInt8(66);
                        spark.send('t0', bw.toBuffer());
                    }
                }
            });

        } else if (GAME_STATUS === Conf.GAME_STATUS_N.blocked) {
            //blocked
            spark.send('x0');
        } else if (GAME_STATUS === Conf.GAME_STATUS_N.maintenance) {
            spark.send('x1');
        } else {
            spark.send('x2');
        }

    });

    primus.on('disconnection', function (spark) {
        var __id = spark.id;
        var ret = null;
        var uuid = lobby.getUUIDforId(__id);
        spark.send('disconnected');
        ret = lobby.removePlayerFromLiveRoom(spark);
        spark.end();
        if (ret) {
            if (redisHandler) {
                //     redisHandler.quit();
            }
        }
    });

};