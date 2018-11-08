
  var XPData = require('./../data/playerxpdata.js');
  var DB_CONN = require('./../dbconnect.js');

  var maxGain = XPData.MAX_PER_TRANSACTION;
  module.exports = function(app) {

      app.post('/xp_d', function(req, res) {
          var data = req['query'] || '';
          var datt = "";
          var playerid = req.body.pid;
          var gain = req.body.gain || 0;
          DB_CONN.DB_Connect(function(err, db) {
              if (err) {
                  console.log('Unable to connect to MongoDB SERVER', err);
                  res.sendStatus(400);
                  return;
              } else {
                  console.log('connected to database');
                  if (gain > maxGain || gain === 0) {
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
                                  var curr_souls = 0;
                                  var leaguelevel = 1;
                                  var recordsUpdated = 0;
                                  var errors = 0;
                                  var status = 200;
                                  var timeSinceNow = 0;
                                  var nextLevelSouls = 0;
                                  if (res_ !== '' && res_.playerdata) {
                                    curr_souls = res_.playerdata.currency.souls_total || 0;
                                      leaguelevel = res_.playerdata.leaguelevel;
                                      nextLevelSouls = XPData[('league' + (leaguelevel + 1))];
                                      if (curr_souls !== 0) {
                                        curr_souls += gain;
                                      }
                                      if (curr_souls >= nextLevelSouls) {
                                        leaguelevel++;
                                      }
                                      playerdataColl.update({
                                          pid: {
                                              $exists: true,
                                              $eq: playerid
                                          }
                                      }, {
                                          "$set": {
                                              "playerdata.currency.souls_total": curr_souls,
                                              "playerdata.leaguelevel": leaguelevel,
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
                                                  "souls": curr_souls,
                                                  'll': leaguelevel
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