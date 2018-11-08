var Conf = require('./../gameConf.js');
var CommonDB = require('./commondb.js');
var RewardData = require('./../data/rewarddata.js');
var debugData = require('./../../debugmode.js');

var rewardTime = RewardData.l1RewardTime;

module.exports = function(app) {
    app.post('/reward_d', function(req, res) {
        var data = req['body'] || '';
        var datt = "";
        var uid = data.sid;
        var username = ('' + data.userid).substr(0, Math.min(35, data.userid.length));
        username = username.replace(/\s/g, '_');
        var playerid = '' + username.toLowerCase() + uid.substr(Math.max(0, uid.length - 4), Math.min(uid.length, 4));
        DB_CONN.DB_Connect(function(err, db) {
            if (err) {
                console.log('Unable to connect to MongoDB SERVER', err);
                res.sendStatus(400);
                return;
            } else {
                console.log('connected to database');
                var playerdataColl = db.collection('playerdata');

                playerdataColl.findOne({
                    pid: {
                        $exists: true,
                        $eq: playerid
                    }
                }, function(err, result) {
                    if (err) {
                        res.sendStatus(400);
                        return;
                    } else {
                        var res_ = result || '',
                            lastTime_rewarded = "",
                            recordsUpdated = 0;
                        errors = 0, timeSinceNow = 0;
                        if (res_ !== '' && res_.playerdata) {
                            lastTime_rewarded = res_.playerdata.daily_reward.last_daily_reward_time || '';
                            if (lastTime_rewarded !== '') {
                                timeSinceNow = Date.now() - lastTime_rewarded;
                                var toUpdate = Date.now();
                                if (timeSinceNow >= rewardTime) {
                                    var currRewardCount = res_.playerdata.daily_reward.total_rewards_taken;
                                    var rewardValue = 20;
                                    var totalRewardValue = res_.playerdata.daily_reward.total_rewards_value + rewardValue;
                                    playerdataColl.update({
                                        pid: {
                                            $exists: true,
                                            $eq: playerid
                                        }
                                    }, {
                                        "$set": {
                                            "playerdata.daily_reward.last_daily_reward_time": toUpdate,
                                            "playerdata.daily_reward.total_rewards_taken": ++currRewardCount,
                                            "playerdata.daily_reward.total_rewards_value": totalRewardValue
                                        }
                                    }, function(err, result) {
                                        if (err) {
                                            errors++;
                                            datt = {
                                                "success": false
                                            };
                                        } else {
                                            recordsUpdated++;
                                            datt = {
                                                "success": true,
                                                "time": rewardTime,
                                                'value': rewardValue
                                            };
                                        }

                                        res.writeHead(200, {
                                            "Content-type": "application/json",
                                        });

                                        res.end(JSON.stringify(datt));

                                    });
                                } else {
                                    res.sendStatus(400);
                                }
                            } else {
                                res.sendStatus(400);
                            }
                            //not found on server
                        } else {
                            res.sendStatus(400);
                        }
                    }
                });

            }
        });
    });

};