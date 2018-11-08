
var XPData = require('./../data/playerxpdata.js');
var debugData = require('./../../debugmode.js');
var Conf = require('./../gameConf.js');
var DB_CONN = require('./../dbconnect.js');
var MAX_TAGS_POSSIBLE = Conf.MAX_TAGS_POSSIBLE;
module.exports = function(app) {

    app.post('/maxtags_d', function(req, res) {
        var data = req['query'] || '';
        var datt = "";
        var playerid = req.body.pid;
        var newcount = req.body.count || 0;
        newcount = Math.floor(newcount);
        DB_CONN.DB_Connect(function(err, db) {
            if (err) {
                console.log('Unable to connect to MongoDB SERVER', err);
                res.sendStatus(400);
                return;
            } else {
                console.log('connected to database');
                if (newcount > MAX_TAGS_POSSIBLE || newcount === 0 || typeof(newcount)==='undefined') {
                    res.sendStatus(400);
                    return;
                }
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
                                var res_ = result || '';
                                var player_data = {};
                                var curr_tags = 0;
                                var new_tags = 0;
                                var recordsUpdated = 0;
                                var errors = 0;
                                var status = 200;
                                var timeSinceNow = 0;
                                if (res_ !== '' && res_.playerdata) {
                                    curr_tags = res_.playerdata.max_tags || 0;
                                    new_tags =newcount ;
                                     playerdataColl.update({
                                        pid: {
                                            $exists: true,
                                            $eq: playerid
                                        }
                                    }, {
                                        "$set": {
                                            "playerdata.max_tags": new_tags
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
                                                "max_tags": new_tags
                                            };
                                        }
                                        res.writeHead(status, {
                                            "Content-type": "application/json",
                                        });
                                        res.end(JSON.stringify(datt));
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });
    });
};