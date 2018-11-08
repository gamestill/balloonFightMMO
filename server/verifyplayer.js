  var Conf = require('./gameConf.js');
  var DB_CONN = require('./dbconnect.js');
  var _head_origin = {
      "Content-type": "application/json",
      'Access-Control-Allow-Origin': '*'
  };

  var Verification = function () {
      this.playersCache = [];
      this.timeInterval = 15000;
      this.lastTime = 0;
      this.currTime = 0;
      this.intervalFnHandle = null;
      this.gameOver = function () {
          this.playersCache = [];
          this.lastTime = 0;
          this.currTime = 0;
          if (this.intervalFnHandle) {
              clearInterval(this.intervalFnHandle);
          }
      };
      this.mongoDbCheck = function () {
            var data = req['query'] || '';
        var datt = "";
        if (data === '' || data.userid.length <= 1 || data.sid.length <= 1) {
            datt = {
                "success": false,
                'message': '0'
            };
            res.writeHead(406, {
                "Content-type": "application/json",
            });

            res.end(JSON.stringify(datt));
            return;
        }
        var uid = data.sid;
        var tags = {};
        var username = ('' + data.userid).substr(0, Math.min(35, data.userid.length));
        username = username.replace(/\s/g, '_');
        var playerid = '' + username.toLowerCase() + uid.substr(Math.max(0, uid.length - 4), Math.min(uid.length, 4));
       
        DB_CONN.DB_Connect(function (err, db) {
            if (err) {
                console.log('Unable to connect to MongoDB SERVER', err);
                res.sendStatus(400);
                return;
            } else {
                console.log('connected to database');
                var playerdataColl = db.collection('players');
                tags = JSON.parse(data.tags);
                var tagname = tags;

                if (tagname !== '') {
                    playerdataColl.findOne({
                        pid: {
                            $exists: true,
                            $eq: playerid
                        }
                    }, function (err, result) {
                        if (err) {
                            res.sendStatus(400);
                            return;
                        } else {
                            var res_ = result || '';
                            var player_data = {};
                            var pdata_tags_serv = [];
                            var foundOnServ = '';
                            var maxlen = 0;
                            var recordsUpdated = 0;
                            var errors = 0;
                            var msg = "";
                            var succStatus = 'true';
                            var status = 200;
                            if (res_ !== '' && res_.playerdata) {
                                pdata_tags_serv = res_.playerdata.tags;
                                var changeStatus = [],
                                    ret = isOnServer(tagname, pdata_tags_serv);
                                //foundOnServ
                                if (ret === 0) {
                                    foundOnServ = tagname;
                                }

                                if (foundOnServ !== '') {
                                    playerdataColl.update({
                                        pid: playerid
                                    }, {
                                        "$pull": {
                                            "playerdata.tags": {
                                                name: foundOnServ
                                            }
                                        }
                                    }, function (err, result) {
                                        if (err) {
                                            errors++;
                                        } else {
                                            recordsUpdated++;
                                        }
                                    });

                                    if (errors > 0) {
                                        succStatus = false;
                                        msg = 0;
                                    } else if (recordsUpdated > 0) {
                                        succStatus = true;
                                        msg = 1;
                                    }

                                    datt = {
                                        "success": succStatus,
                                        'message': msg
                                    };
                                    res.writeHead(status, {
                                        "Content-type": "application/json",
                                    });

                                    res.end(JSON.stringify(datt));
                                    return;
                                }
                                //not found on server
                                else {
                                    res.writeHead(400, {
                                        "Content-type": "application/json",
                                    });

                                    res.send();
                                    return;
                                }
                            } else {
                                datt = {
                                    "success": false,
                                    'message': '0'
                                };
                                res.writeHead(400, {
                                    "Content-type": "application/json",
                                });

                                res.end(JSON.stringify(datt));
                                return;
                            }
                        }
                    });
                } else {
                    //no tags to sync
                    datt = {
                        "success": false,
                        'message': "0"
                    };
                    res.writeHead(400, {
                        "Content-type": "application/json",
                    });

                    res.end(JSON.stringify(datt));
                    return;
                }
            }
        });
      };
      this.init = function () {
          this.setIntervalFn();
      };
      this.addToCache = function (name) {
          if (indexOf(this.playersCache, name) < 0) {
              pushArr(this.playersCache, name);
          }
      };
      this.intervalFn = function () {
          if(this.playersCache.length<=0){
              return;
          }
          this.currTime = Date.now();
          if ((this.currTime - this.lastTime) <= (this.timeInterval - 1000)) {
              clearInterval(this.intervalFnHandle);
              this.intervalFnHandle = null;
              this.setIntervalFn();
              return;
          }
          
          /// code
          console.log('verify player');
          this.lastTime = this.currTime;
      };

      this.setIntervalFn = function () {
          if (this.intervalFnHandle !== null) {
              console.log('interval already set');
              return;
          }
          this.intervalFnHandle = setInterval(this.intervalFn.bind(this), this.timeInterval);
      };
  };


  module.exports = Verification;