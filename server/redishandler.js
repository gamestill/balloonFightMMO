var Conf = require('./../server/gameConf.js');
var redis = require('redis');
var BW = require("./lib/BinaryWriter.js");
var BR = require("./lib/BinaryReader.js");
var HASH_NAME_FOR_SERVERS = 'sdata';
var IS_REDIS_SERVER = process.env.REDIS;
var myRegion = (process.env.REGION) || '5000';
var lobby = require('./lobby.js');
var myRegionCode = process.env.REGION;
var CURR_GAME_MODE = process.env.GAME_MODE;
myRegion = Conf.SERVER_CODE_TO_REGION['' + myRegion] || 'unknown';
var LIVEROOM_NAME = '' + Conf.SERVER_CODE_TO_REGION_NO_UNDER[myRegionCode] + '_' + CURR_GAME_MODE.toLowerCase() + '_' + Conf.SERVER_CODE;
var subKey = '__keyevent@0__:expired';
var REDIS_INTERVAL = 1000;
var REDIS_INTERVAL_CHECK = 500;

var RedisHandler = function (primus, region) {
    //data
    this.primus = primus;
    this.clientData = null;
    this.lastTimeRedis = Date.now();
    this.nowRedis = this.lastTimeRedis;
    this.redisClient = redis.createClient({
        host: Conf.REDIS_IP,
        port: Conf.REDIS_PORT,
        password: Conf.REDIS_PASS
    });

    if (IS_REDIS_SERVER) {

        this.redisSub = redis.createClient({
            host: Conf.REDIS_IP,
            port: Conf.REDIS_PORT,
            password: Conf.REDIS_PASS
        });
    }

    this.onConnect = function () {
        if (myRegion === 'unknown') {
            console.log('unknown region');
            return;
        }
        this.startRedisInterval();
        console.log('connected to redis: server region : ' + myRegion);
    };

    this.sendDataToClients = (function(err,reply){
        var self = this;
        var LOC_C = Conf.LOC_CODE;
        var MODE_C = Conf.MODE_CODE;
        self.redisClient.hgetall(HASH_NAME_FOR_SERVERS, function (err, reply) {
            var bw = new BW(10);
            if (reply) {
                var keys = Object.keys(reply);
                var total = 0;
                var val = 0;
                var myVal = '';
                var modeCode = 0;
                var locCode = 0;
                var peopleCount = 0;
                var roomNo = 0;
                bw.writeUInt16(keys.length);
                var splitStr = [];
                for (var i = 0; i < keys.length; i++) {
                    val = reply[keys[i]];
                     splitStr =  keys[i].split(/_/);
                     locCode =  LOC_C['' +splitStr[0]];
                    bw.writeUInt8(locCode);
                    bw.writeUInt8(+val);  
                }
            } else {
                bw.writeUInt8(0);
            }
            self.primus.send('4', bw.toBuffer());
        });
    }).bind(this);
    this.startRedisInterval = function () {
        clearInterval(this.clientData);
        var self = this;
        var counter = 0;
        this.clientData = setInterval(function () {
            self.nowRedis = Date.now();
            if ((self.nowRedis - self.lastTimeRedis) < REDIS_INTERVAL_CHECK) {
                if (self.clientData) {
                    clearInterval(self.clientData);
                    self.startRedisInterval();
                }
            }
            counter++;
            if (!self.redisClient || counter % 5 !== 0) {
                if (counter >= 10000) {
                    counter = 0;
                }
                return;
            }

            var _count = lobby.getPeopleCount() || [0,0];
            self.redisClient.hset(HASH_NAME_FOR_SERVERS,  LIVEROOM_NAME, _count[0],self.sendDataToClients);
            self.lastTimeRedis = self.nowRedis;
        }, REDIS_INTERVAL);
    }

    this.quit = function () {
        if (this.redisClient) {
            this.redisClient.quit();
        }
        if (this.redisSub) {
            this.redisSub.quit();
        }
    }
    this.getAllStatus = function (cb) {
        var self = this;
        self.redisClient.hgetall(HASH_NAME_FOR_SERVERS, function (err, reply) {
            if (reply) {
                cb(reply);
                return;
            }
            cb(null);
            return;
        });
    };

    this.init = function () {
        this.redisClient.on('connect', this.onConnect.bind(this));
    };
    this.init();
};
RedisHandler.prototype.newPlayer = function (id, uuid) {
    if (!this.redisClient || myRegion === 'unknown') {
        return;
    }
    var self = this;
    this.redisClient.incr('vistors');
}

module.exports = RedisHandler;