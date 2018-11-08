
  var XPData = require('./playerxpdata.js');
  var MAX_COINS_PER_TRANS = XPData.MAX_PER_TRANSACTION;;
  var DB_CONN = require('./../dbconnect.js');

  module.exports = function (app) {
      app.post('/coin_b', function (req, res) {
          var data = req['query'] || '';
          var datt = "";
          if (data === '' || data.userid.length <= 1 || data.sid.length <= 1 || data.count < 1 || data.count > 100000) {
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
          var buycount = data.count;
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
                  var playerdataColl = db.collection('playerdata');

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

                          console.log('connected to database');
                          var playerdataColl = db.collection('playerdata');

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
                                  var curr_coins = 0;
                                  var curr_lvl = 1;
                                  var recordsUpdated = 0;
                                  var errors = 0;
                                  var status = 200;
                                  if (res_ !== '' && res_.playerdata) {
                                      curr_coins = res_.playerdata.currency.coins_total || 0;
                                      if (curr_coins !== 0) {
                                          curr_coins += Math.min(MAX_COINS_PER_TRANS, buycount);
                                      }

                                      playerdataColl.update({
                                          pid: {
                                              $exists: true,
                                              $eq: playerid
                                          }
                                      }, {
                                          "$set": {
                                              "playerdata.currency.coins_total": curr_coins,
                                          }
                                      }, function (err, result) {
                                          if (err) {
                                              errors++;
                                              datt = {
                                                  "success": false
                                              };
                                          } else {
                                              recordsUpdated++;
                                              datt = {
                                                  "success": true,
                                                  "coins": curr_coins
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

      app.post('/coin_s', function (req, res) {
          var data = req['query'] || '';
          var datt = "";
          if (data === '' || data.userid.length <= 1 || data.sid.length <= 1 || data.count < 1) {
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
          var spentcount = data.count;
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
                  var playerdataColl = db.collection('playerdata');

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

                          console.log('connected to database');
                          var playerdataColl = db.collection('playerdata');

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
                                  var curr_coins = 0;
                                  var curr_lvl = 1;
                                  var recordsUpdated = 0;
                                  var errors = 0;
                                  var status = 200;
                                  if (res_ !== '' && res_.playerdata) {
                                      curr_coins = res_.playerdata.currency.coins_total || 0;
                                      if (curr_coins !== 0) {
                                          curr_coins -= Math.max(0, Math.min(MAX_COINS_PER_TRANS, spentcount));
                                      }

                                      playerdataColl.update({
                                          pid: {
                                              $exists: true,
                                              $eq: playerid
                                          }
                                      }, {
                                          "$set": {
                                              "playerdata.currency.coins_total": curr_coins,
                                          }
                                      }, function (err, result) {
                                          if (err) {
                                              errors++;
                                              datt = {
                                                  "success": false
                                              };
                                          } else {
                                              recordsUpdated++;
                                              datt = {
                                                  "success": true,
                                                  "coins": curr_coins
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