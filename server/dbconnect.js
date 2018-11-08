
var Conf = require('./gameConf.js');
//var mongodb = require('mongodb');
//var localGame = require('./../debugmode.js');

var DBConnect = {
//     DB_Connect: function (cb) {
//         if(Conf.MAIN_DB){
//             console.log('db connect form cache');
//             cb(null,Conf.MAIN_DB);
//             return;
//         }
//         var local = false;
//         var mongourl = Conf.MongoConf.mongourl_online;
//         if (localGame.mode === Conf.GAME_STATUS_N.LOCAL) {
//             local = true;
//             mongourl = Conf.MongoConf.mongourl;
//         }
//         var MongoClient = mongodb.MongoClient;
//         var url = mongourl;
//         if (!Conf.MAIN_DB) {
//             MongoClient.connect(url,{
//                 uri_decode_auth: true 
//             } ,function (err, db) {
//                 if (err) {
//                     cb(err,null);
//                     console.log('Unable to connect to MongoDB SERVER 1', err);
//                     return;
//                 } else {
//                     Conf.MAIN_DB = db;
//                     console.log('db connect fresh');
//                     cb(null,db);
//                 }
//             });

//         } else {
//             cb(1);
//         }
//     }
}

module.exports = DBConnect;