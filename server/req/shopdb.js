// var Conf = require('./../gameConf.js');
// var CommonDB = require('./commondb.js');
// var ShopData = require('./../data/shopdata.js');
// var debugData = require('./../../debugmode.js');
// var DB_CONN = require('./../dbconnect.js');
// var ItemId = ShopData.itemid;
// var ShopItemType = ShopData.shopitemtype;
// //var rewardTime = RewardData.l1RewardTime;
// var ITEMNAME_MAX_LENGTH = Conf.ITEMNAME_MAX_LENGTH;


function checkItemType(name) {
    return;
   // var data = ShopData.shopdata;
    // var keys = Object.keys(data) || '';
    // if (keys === '') {
    //     return '';
    // }

    // for (var i = 0; i < keys.length; i++) {
    //     var items = data[keys[i]].items || '';
    //     if (items !== '') {
    //         var toCmp = '';
    //         var names = items.names;
    //         for (var j = 0; j < names.length; j++) {
    //             toCmp = names[j].toLowerCase().trim();
    //             if (name === toCmp) {
    //                 return {
    //                     cat: keys[i],
    //                     cost: items.cost[j],
    //                     type: data[keys[i]].purchasetype,
    //                     id: ItemId['' + name]
    //                 };
    //             }
    //         }
    //     }

    // }
    // return '';

}

// function mongoReq(type,playerdataColl,playerid,newVal,newSpent,cb){
//     var errors = 0;
//     var recordsUpdated = 0;
//     if (type === ShopItemType.gems) {
//         playerdataColl.update({
//             pid: {
//                 $exists: true,
//                 $eq: playerid
//             }
//         }, {
//             "$set": {
//                 "playerdata.currency.gems_total": newVal

//             }
//         },
//         function (err, result) {
//             var out = false;
//             if (err) {
//                 errors++;
//                 datt = {
//                     "success": out
//                 };
//             } else {
//                 out = true;
//                 recordsUpdated++;
//                 datt = {
//                     "success": out,
//                 };
//             }
//             cb(datt,out);
//             return;
//         });
//     }
//     else if(type===ShopItemType.gold){
//         playerdataColl.update({
//             pid: {
//                 $exists: true,
//                 $eq: playerid
//             }
//         }, {
//             "$set": {
//                 "playerdata.currency.coins_total": newVal,
//                 "playerdata.currency.coin_spent": newSpent,

//             }
//         },
//         function (err, result) {
//             var out = false;
//             if (err) {
//                 errors++;
//                 datt = {
//                     "success": out
//                 };
//             } else {
//                  out = true;
//                 recordsUpdated++;
//                 datt = {
//                     "success": out,
//                 };
//             }
//             cb(datt,out);
//             return;
//         });
//     }
// }
// function findLevel(id,arr){
//     for(var i=0;i<arr.length;i++){
//         if(arr[i].id===id){
//             return arr[i].level;
//         }
//     }
//     return 1;
// }
// module.exports = function (app) {
//     app.post('/upgradeitem_d',function(req,res){
//         var data = req['body'] || '';
//         var datt = "";
//         var uid = data.sid;
//         var itemName = data.item || '';
//         if (itemName === '') {
//             var rr = {};
//             res.sendStatus(400);
//             res.end(JSON.stringify(rr));
//             return;
//         }
//     });

//     app.post('/buyingame_d', function (req, res) {
//         var data = req['body'] || '';
//         var datt = "";
//         var uid = data.sid;
//         var itemName = data.item || '';
//         if (itemName === '') {
//             var rr = {};
//             res.sendStatus(400);
//             res.end(JSON.stringify(rr));
//             return;
//         }
//         itemName = ('' + itemName).substr(0, ITEMNAME_MAX_LENGTH);
//         itemName = ('' + itemName).trim().toLowerCase();
//         var itemDetail = checkItemType(itemName);
//         if (itemDetail === '') {
//             var rr = {};
//             res.sendStatus(400);
//             res.end(JSON.stringify(rr));
//             return;
//         }
//         var itemCat = itemDetail.cat.toLowerCase().trim();
//         var cost = itemDetail.cost;
//         var type = itemDetail.type;
//         var itemid = itemDetail.id;
//         var username = ('' + data.userid).substr(0, Math.min(35, data.userid.length));
//         username = username.replace(/\s/g, '_');
//         var playerid = '' + username.toLowerCase() + uid.substr(Math.max(0, uid.length - 4), Math.min(uid.length, 4));
      
//         DB_CONN.DB_Connect(function (err, db) {
//             if (err) {
//                 console.log('Unable to connect to MongoDB SERVER', err);
//                 res.sendStatus(400);
//                 return;
//             } else {
//                 console.log('connected to database');
//                 var playerdataColl = db.collection('playerdata');

//                 playerdataColl.findOne({
//                     pid: {
//                         $exists: true,
//                         $eq: playerid
//                     }
//                 }, function (err, result) {
//                     if (err) {
//                         res.sendStatus(400);
//                         return;
//                     } else {
//                         var res_ = result || '',
//                             recordsUpdated = 0;
//                         errors = 0, timeSinceNow = 0;
//                         if (res_ !== '' && res_.playerdata) {
//                             var toPush = {};
//                             if(itemCat ==='weapons'){
//                                 var lvl = findLevel(itemid,res_.playerdata.weapons);
                               
//                                 toPush['playerdata.' + itemCat] = {
//                                     id:itemid,
//                                     level:lvl
//                                 };
                                
//                             }else if(itemCat==='boosters'){
//                                 var lvl = findLevel(itemid,res_.playerdata.boosters);  
//                                 toPush['playerdata.' + itemCat] = {
//                                     id:itemid,
//                                     level:lvl
//                                 };
//                             }else{
//                                 toPush['playerdata.' + itemCat] = itemid;
                                
//                             }
//                             var newVal = 0;
//                             var newSpent = 0;
//                             if (type === ShopItemType.gems) {
//                                 newVal = Math.floor(res_.playerdata.currency.gems_total - cost);

//                             } else {
//                                 newVal = Math.floor(res_.playerdata.currency.coins_total - cost);
//                                 newSpent = Math.floor(res_.playerdata.currency.coin_spent + cost);
//                             }
//                             if (newVal < 0) {
//                                 res.writeHead(200, {
//                                     "Content-type": "application/json",
//                                 });
//                                 datt = {
//                                     "success": false,
//                                     'message':'not enough resources'
//                                 };
//                                 res.end(JSON.stringify(datt));
//                                 return;
//                             }
                            
//                             playerdataColl.update({
//                                 pid: {
//                                     $exists: true,
//                                     $eq: playerid
//                                 }
//                             }, {
//                                 "$addToSet": toPush

//                             }, function (err, result) {
//                                 if (err) {
//                                     errors++;
//                                     datt = {
//                                         "success": false,
//                                         'message':'error buying this item'
//                                     };
//                                 } else {
//                                     if (result.result.hasOwnProperty('nModified') && result.result.nModified<=0 ) {
//                                         datt = {
//                                             "success": false,
//                                             'message':'cannot buy this item'
//                                         };
//                                         res.writeHead(200, {
//                                             "Content-type": "application/json",
//                                         });
//                                         res.end(JSON.stringify(datt));
//                                         return;
//                                     }
//                                     var newVal = 0, newSpent = 0;
//                                     if (type === ShopItemType.gems) {
//                                         newVal = Math.floor(res_.playerdata.currency.gems_total - cost);

//                                     } else {
//                                         newVal = Math.floor(res_.playerdata.currency.coins_total - cost);
//                                         newSpent = Math.floor(res_.playerdata.currency.coin_spent + cost);
//                                     }
//                                   mongoReq(type,playerdataColl,playerid,newVal,newSpent,function(datt,succ){
//                                     res.writeHead(200, {
//                                         "Content-type": "application/json",
//                                     });
//                                     if(succ){
//                                         datt['curr'] = newVal;
//                                         datt['name'] = itemName;
                                                                                 
//                                     }
//                                     res.end(JSON.stringify(datt));
//                                 });               
//                                 }

                             

//                             });
//                             //not found on server
//                         } else {
//                             res.sendStatus(400);
//                         }
//                     }
//                 });

//             }
//         });

//     });
//     app.post('/buyingame_d', function (req, res) {
//         var data = req['body'] || '';
//         var datt = "";
//         var uid = data.sid;
//         var itemName = data.item || '';
//         if (itemName === '') {
//             var rr = {};
//             res.sendStatus(400);
//             res.end(JSON.stringify(rr));
//             return;
//         }
//         itemName = ('' + itemName).substr(0, ITEMNAME_MAX_LENGTH);
//         itemName = ('' + itemName).trim().toLowerCase();
//         var itemDetail = checkItemType(itemName);
//         if (itemDetail === '') {
//             var rr = {};
//             res.sendStatus(400);
//             res.end(JSON.stringify(rr));
//             return;
//         }
//         var itemCat = itemDetail.cat.toLowerCase().trim();
//         var cost = itemDetail.cost;
//         var type = itemDetail.type;
//         var itemid = itemDetail.id;
//         var username = ('' + data.userid).substr(0, Math.min(35, data.userid.length));
//         username = username.replace(/\s/g, '_');
//         var playerid = '' + username.toLowerCase() + uid.substr(Math.max(0, uid.length - 4), Math.min(uid.length, 4));
       
//         DB_CONN.DB_Connect( function (err, db) {
//             if (err) {
//                 console.log('Unable to connect to MongoDB SERVER', err);
//                 res.sendStatus(400);
//                 return;
//             } else {
//                 console.log('connected to database');
//                 var playerdataColl = db.collection('playerdata');

//                 playerdataColl.findOne({
//                     pid: {
//                         $exists: true,
//                         $eq: playerid
//                     }
//                 }, function (err, result) {
//                     if (err) {
//                         res.sendStatus(400);
//                         return;
//                     } else {
//                         var res_ = result || '',
//                             recordsUpdated = 0;
//                         errors = 0, timeSinceNow = 0;
//                         if (res_ !== '' && res_.playerdata) {
//                             var toPush = {};
//                             if(itemCat ==='weapons'){
//                                 var lvl = findLevel(itemid,res_.playerdata.weapons);
                               
//                                 toPush['playerdata.' + itemCat] = {
//                                     id:itemid,
//                                     level:lvl
//                                 };
                                
//                             }else if(itemCat==='boosters'){
//                                 var lvl = findLevel(itemid,res_.playerdata.boosters);  
//                                 toPush['playerdata.' + itemCat] = {
//                                     id:itemid,
//                                     level:lvl
//                                 };
//                             }else{
//                                 toPush['playerdata.' + itemCat] = itemid;
                                
//                             }
//                             var newVal = 0;
//                             var newSpent = 0;
//                             if (type === ShopItemType.gems) {
//                                 newVal = Math.floor(res_.playerdata.currency.gems_total - cost);

//                             } else {
//                                 newVal = Math.floor(res_.playerdata.currency.coins_total - cost);
//                                 newSpent = Math.floor(res_.playerdata.currency.coin_spent + cost);
//                             }
//                             if (newVal < 0) {
//                                 res.writeHead(200, {
//                                     "Content-type": "application/json",
//                                 });
//                                 datt = {
//                                     "success": false,
//                                     'message':'not enough resources'
//                                 };
//                                 res.end(JSON.stringify(datt));
//                                 return;
//                             }
                            
//                             playerdataColl.update({
//                                 pid: {
//                                     $exists: true,
//                                     $eq: playerid
//                                 }
//                             }, {
//                                 "$addToSet": toPush

//                             }, function (err, result) {
//                                 if (err) {
//                                     errors++;
//                                     datt = {
//                                         "success": false,
//                                         'message':'error buying this item'
//                                     };
//                                 } else {
//                                     if (result.result.hasOwnProperty('nModified') && result.result.nModified<=0 ) {
//                                         datt = {
//                                             "success": false,
//                                             'message':'cannot buy this item'
//                                         };
//                                         res.writeHead(200, {
//                                             "Content-type": "application/json",
//                                         });
//                                         res.end(JSON.stringify(datt));
//                                         return;
//                                     }
//                                     var newVal = 0, newSpent = 0;
//                                     if (type === ShopItemType.gems) {
//                                         newVal = Math.floor(res_.playerdata.currency.gems_total - cost);

//                                     } else {
//                                         newVal = Math.floor(res_.playerdata.currency.coins_total - cost);
//                                         newSpent = Math.floor(res_.playerdata.currency.coin_spent + cost);
//                                     }
//                                   mongoReq(type,playerdataColl,playerid,newVal,newSpent,function(datt,succ){
//                                     res.writeHead(200, {
//                                         "Content-type": "application/json",
//                                     });
//                                     if(succ){
//                                         datt['curr'] = newVal;
//                                         datt['name'] = itemName;
                                                                                 
//                                     }
//                                     res.end(JSON.stringify(datt));
//                                 });               
//                                 }

                             

//                             });
//                             //not found on server
//                         } else {
//                             res.sendStatus(400);
//                         }
//                     }
//                 });

//             }
//         });
//     });

// };