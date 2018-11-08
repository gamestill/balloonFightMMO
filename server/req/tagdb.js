  var Conf = require('./../gameConf.js');
  var _head_origin = Conf.MongoConf.res_header;
  var debugData = require('./../../debugmode.js');
  var DB_CONN = require('./../dbconnect.js');

  function notOnClient(servelement, clientArr) {
      for (var j = 0; j < clientArr.length; j++) {
          if (servelement.name === clientArr[j].name) {
              return 1;
          }
      }
      return 0;
  }

  function isOnServer(toCheck, serverArr) {
      for (var j = 0; j < serverArr.length; j++) {
          if (toCheck === serverArr[j].name) {
              return 0;
          }
      }
      return 1;
  }

  function innerLoop(element, a) {
      for (var j = 0; j < a.length; j++) {
          if (element.name === a[j].name) {
              //found element with diff status
              if (element.status !== a[j].status) {
                  return 2;
              }
              //found element 
              return 1;
          }
      }
      return 0;
  }

  module.exports = function (app) {
      app.get('/addtag_d', function (req, res) {});

      app.get('/deltag_d', function (req, res) {
          var data = req['query'] || '';
          var datt = "";
          var tags = {};
          var playerid = req.body.pid;
         

         DB_CONN.DB_Connect(function (err, db) {
              if (err) {
                  console.log('Unable to connect to MongoDB SERVER', err);
                  res.sendStatus(400);
                  return;
              } else {
                  console.log('connected to database');
                  var playerdataColl = db.collection('playerdata');

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
      });

      app.post('/tagsync_d', function (req, res) {
          var data = req['body'] || '';
          var datt = "";
          var uid = data.sid;
          var username = ('' + data.userid).substr(0, Math.min(35, data.userid.length));
          username = username.replace(/\s/g, '_');
          var playerid = '' + username.toLowerCase() + uid.substr(Math.max(0, uid.length - 4), Math.min(uid.length, 4));
          var tags = {};

          DB_CONN.DB_Connect(function (err, db) {
              if (err) {
                  console.log('Unable to connect to MongoDB SERVER', err);
                  res.sendStatus(400);
                  return;
              } else {
                  console.log('connected to database');
                  var playerdataColl = db.collection('playerdata');

                  tags = JSON.parse(data.tags);
                  var tagkeys = Object.keys(tags);
                  var clientTags = [];
                  for (var i = 0; i < tagkeys.length; i++) {
                      clientTags.push({
                          'name': tags[tagkeys[i]].tag,
                          'status': tags[tagkeys[i]].status
                      });
                  }

                  if (tagkeys.length >= 0) {
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
                              var newPush = [];
                              var servData = [];
                              var toAll = {};
                              var maxlen = 0;
                              var recordsUpdated = 0;
                              var errors = 0;
                              var msg = "";
                              var succStatus = 'true';
                              var status = 200;
                              if (res_ !== '' && res_.playerdata) {
                                  pdata_tags_serv = res_.playerdata.tags;
                                  var changeStatus = [];
                                  for (var i = 0; i < pdata_tags_serv.length; i++) {
                                      var ret = notOnClient(pdata_tags_serv[i], clientTags);
                                      //only on server
                                      if (ret === 0) {
                                          servData.push(pdata_tags_serv[i]);
                                      }

                                  }


                                  for (var i = 0; i < clientTags.length; i++) {
                                      var ret = innerLoop(clientTags[i], pdata_tags_serv);
                                      //newpush
                                      if (ret === 0) {
                                          newPush.push(clientTags[i]);
                                      }
                                      //    diff status
                                      else if (ret === 2) {
                                          changeStatus.push(clientTags[i]);
                                      }
                                  }
                                  toAll = {
                                      n: newPush,
                                      c: changeStatus
                                  };
                                  maxLen = pdata_tags_serv.length + toAll.n.length;
                                  if (maxLen > 10) {
                                      // too many tags
                                      datt = {
                                          "success": false
                                      };
                                      res.writeHead(400, {
                                          "Content-type": "application/json",
                                      });

                                      res.end(JSON.stringify(datt));
                                      return;
                                  }
                                  if (toAll.n.length) {
                                      playerdataColl.update({
                                          pid: playerid
                                      }, {
                                          $addToSet: {
                                              "playerdata.tags": {
                                                  $each: toAll.n
                                              }
                                          }
                                      }, function (err, result) {
                                          // pushing new tags to player document
                                          if (err) {
                                              errors++;
                                          }
                                          // change the status to current status of the tags
                                          else {
                                              recordsUpdated++;
                                              for (var i = 0; i < toAll.c.length; i++) {
                                                  var tT = toAll.c[i].name;
                                                  var sT = toAll.c[i].status;
                                                  playerdataColl.update({
                                                      pid: playerid,
                                                      "playerdata.tags.name": tT
                                                  }, {
                                                      "$set": {
                                                          "playerdata.tags.$.status": sT
                                                      }
                                                  }, function (err, result) {
                                                      if (err) {
                                                          errors++;
                                                      } else {
                                                          recordsUpdated++;
                                                      }
                                                  });
                                              }
                                          }
                                      });
                                  }
                                  //cleint side new
                                  else {
                                      for (var i = 0; i < toAll.c.length; i++) {
                                          var tT = toAll.c[i].name;
                                          var sT = toAll.c[i].status;
                                          playerdataColl.update({
                                              pid: playerid,
                                              "playerdata.tags.name": tT
                                          }, {
                                              "$set": {
                                                  "playerdata.tags.$.status": sT
                                              }
                                          }, function (err, result) {
                                              if (err) {
                                                  errors++;
                                              } else {
                                                  recordsUpdated++;
                                              }
                                          });
                                      }
                                  }
                                  if (errors > 0 && recordsUpdated > 0) {
                                      msg = "1";
                                      status = 200;
                                      succStatus = true;
                                  } else if (errors == 0 && recordsUpdated > 0) {
                                      msg = "2";
                                      status = 200;
                                      succStatus = true;
                                  } else if (errors > 0 && recordsUpdated == 0) {
                                      msg = "0";
                                      status = 400;
                                      succStatus = false;
                                  } else if (errors == 0 && recordsUpdated == 0) {
                                      msg = "1";
                                      status = 200;
                                      succStatus = false;
                                  } else {
                                      msg = "2";
                                      status = 200;
                                      succStatus = true;
                                  }
                                  if (succStatus === true) {
                                      datt = {
                                          "success": succStatus,
                                          'message': msg,
                                          data: servData.toString()
                                      };
                                      res.writeHead(status, {
                                          "Content-type": "application/json",
                                      });

                                      res.end(JSON.stringify(datt));
                                      return;
                                  } else {
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
                          'message': "1"
                      };
                      res.writeHead(400, {
                          "Content-type": "application/json",
                      });

                      res.end(JSON.stringify(datt));
                      return;
                  }
              }
          });
      });
  };