// var Conf = require('./../gameConf.js');
// var RewardData = require('./../data/rewarddata.js');
// var _head_origin = Conf.MongoConf.res_header;
// var _ShopData = require('./../data/shopdata.js');
// var ItemCat = _ShopData.itemCat;
// var ShopData = _ShopData.shopdata;
// var ShopItemType = _ShopData.shopitemtype;
// var ItemID = _ShopData.itemid;
// var WeaponData = _ShopData.weapondata;
// var WeaponUG = _ShopData.weaponUG;
// var BoosterUG = _ShopData.boosterUG;
// var DB_CONN = require('./../dbconnect.js');
// var TabOrder = _ShopData.TabOrder;
// var WEAPON_MAX_LVL = 7;
// var BOOSTER_MAX_LEVEL = 5;
// var newtags = [{
//         name: 'We are friends',
//         status: 'on'
//     }, {
//         name: 'You are dead',
//         status: 'on'
//     },
//     {
//         name: 'Try killing me',
//         status: 'on'
//     },
// ];

// // SKINS ON/OFF
// // WEAPONS ON/OFF/LVL
// //UPGRADES LVL

// var newplayerdata = {
//     pid: '',
//     lastonline: Date.UTC(2000, 1, 1, 10, 0, 0, 0),

//     playerdata: {
//         kills: 0,
//         totaltime: 0,
//         skins: [],
//         weapons: [],
//         boosters: [],
//         styles: [],
//         leaguelevel: 1,
//         quests: 0,
//         deco: [],
//         ads: {
//             'on': true,
//             'time': 0
//         },
//         upgrades: {
//             'magnets': 0,
//             'spooky': 0,
//             'spookycd': 0,
//             'statue': 0,
//             'statuecd': 0,
//             'soulx': 0,
//             'rage': 0,
//             'digger': 0,
//             'diggercd': 0,
//             'rotator': 0
//         },
//         max_tags: Conf.DEFAULT_MAX_TAGS,
//         tags: newtags,
//         daily_reward: {
//             last_daily_reward_time: Date.now(),
//             total_rewards_taken: 0,
//             total_rewards_value: 0,
//         },
//         level: 1,
//         currency: {
//             gems_total: 0,
//             coins_total: 0,
//             coin_spent: 0,
//             souls_total: 0,
//         }
//     }
// };


// function innerLoop(element, a) {
//     for (var j = 0; j < a.length; j++) {
//         if (element.name === a[j].name) {
//             //found element with diff status
//             if (element.status !== a[j].status) {
//                 return 2;
//             }
//             //found element 
//             return 1;
//         }
//     }
//     return 0;
// }

// function notOnClient(servelement, clientArr) {
//     for (var j = 0; j < clientArr.length; j++) {
//         if (servelement.name === clientArr[j].name) {
//             return 1;
//         }
//     }
//     return 0;
// }

// function getCatFromID(id) {
//     var PREMIUM = 'premium';
//     var YOUTUBE = 'youtube';
    
//     if (id <= 0) {
//         return '';
//     }
//     if(id>40000 || (id>30000 && id<35000) || (id>25000 &&id<30000)){
//         return PREMIUM;
//     }
//     else if(id>1500 && id<25000){
//         return YOUTUBE;
//     }
//     else if(id<1500){
//         return PREMIUM;
//     }





// }
// function checkItemNonUpgradable(data,id){
//     return data.indexOf(id);
// }

// function checkItemUpgradable(data,id){
//     console.log('data:' + data);
//     for(var i=0;i<data.length;i++){
//         if(data[i].id===id){
//             return i;
//         }
//     }
//     return -1;
// }
// function addSpecialFieldsToWeapons(tabs, data, attr,owned,ret) {
//     attr['uparam'] = data['uparam'];
//     var tabkeys = Object.keys(tabs);
//     var shopdata = data['items'].names;
//     for (var i = 0; i < tabkeys.length; i++) {
//         attr['cat']['' + tabkeys[i]]['udata'] = [];
//         ret['' + tabkeys[i]]['cost'] = [];
   
//         var names = ret['' + tabkeys[i]].names;
//         for(var j=0;j<names.length;j++){
//            var foundIndex =shopdata.indexOf(names[j]);
//            //dont own this item
//             if(foundIndex>=0){
//               var cost =  data['items'].cost[foundIndex];
//               ret['' + tabkeys[i]]['cost'].push(cost);
//             }
//             var wu_data =WeaponData['' + names[j]]['1'];
//             for(var k=0;k<wu_data.length;k++){
//                 attr['cat']['' + tabkeys[i]]['udata'].push(wu_data[k]);
//             }
//         }
//     }


//     // set data for owned weapons
//     attr['cat']['owned']['ugcost'] = [];
//     attr['cat']['owned']['levels'] = [];
    
//     attr['cat']['owned']['ucdata'] = [];
//     var curItem = {};
//     var id = 0;
//     var toLvl = attr['cat']['owned']['levels'];
//     var toLvlCost = attr['cat']['owned']['ugcost'];
//     for(var i=0;i<owned.length;i++){
//         curItem  = owned[i];
//         id = curItem.id;
//       var index =  checkItemUpgradable(owned, id);
//         if(index>=0){
//             toLvl.push(owned[index].level);
//             var ugcostLvl = Math.min(WEAPON_MAX_LVL -2,owned[index].level -1);
//             toLvlCost.push(WeaponUG[ugcostLvl]);
//         }
//     }
//     var ownedNames =   attr['cat']['owned']['names'];
//     var levels =  attr['cat']['owned']['levels'];
//     for(var i=0;i<ownedNames.length;i++){
//        var ownedName  = ownedNames[i];
//        var ownedLvl = levels[i];
//         var wu_data =WeaponData['' + ownedName]['' + ownedLvl];
//         for(var k=0;k<wu_data.length;k++){
//             attr['cat']['owned']['ucdata'].push(wu_data[k]);
//         }
//     }

// };

// function addSpecialFieldsToBoosters(tabs, data, attr,owned,ret) {
//     attr['uparam'] = data['uparam'];
//     var tabkeys = Object.keys(tabs);
//     var shopdata = data['items'].names;
//     for (var i = 0; i < tabkeys.length; i++) {
//         attr['cat']['' + tabkeys[i]]['udata'] = [];
//         ret['' + tabkeys[i]]['cost'] = [];
   
//         var names = ret['' + tabkeys[i]].names;
//         for(var j=0;j<names.length;j++){
//            var foundIndex =shopdata.indexOf(names[j]);
//            //dont own this item
//             if(foundIndex>=0){
//               var cost =  data['items'].cost[foundIndex];
//               ret['' + tabkeys[i]]['cost'].push(cost);
//             }
//             attr['cat']['' + tabkeys[i]]['udata'].push(1); 
//         }
//     }


//     // set data for owned weapons
//     attr['cat']['owned']['ugcost'] = [];
//     attr['cat']['owned']['levels'] = [];
//     attr['cat']['owned']['ucdata'] = [];
//     var curItem = {};
//     var id = 0;
//     var toLvl = attr['cat']['owned']['levels'];
//     var toLvlCost = attr['cat']['owned']['ugcost'];
//     for(var i=0;i<owned.length;i++){
//         curItem  = owned[i];
//         id = curItem.id;
//       var index =  checkItemUpgradable(owned, id);
//         if(index>=0){
//             toLvl.push(owned[index].level);
//             var ugcostLvl = Math.min(BOOSTER_MAX_LEVEL -2,owned[index].level -1);
//             toLvlCost.push(BoosterUG[ugcostLvl]);
//         }
//     }
//     var ownedNames =   attr['cat']['owned']['names'];
//     var levels =  attr['cat']['owned']['levels'];
//     for(var i=0;i<ownedNames.length;i++){
//        var ownedName  = ownedNames[i];
//        var ownedLvl = levels[i];
//        attr['cat']['owned']['ucdata'].push(ownedLvl+1);
        
//     }

// };


// function getShopDataForPlayer(data) {
//     var pid = data.pid;

//     var pdata = data.playerdata;
//     var owned = {
//         'skins': pdata.skins,
//         'weapons': pdata.weapons,
//         'boosters': pdata.boosters,
//         'styles': pdata.styles
//     };
    

//     var retData = {};
//     var shopKeys = Object.keys(ShopData);
//     for (var i = 0; i < shopKeys.length; i++) {
//         var cat = shopKeys[i].toLowerCase().trim();
//         if (!cat) {
//             console.log('Shop Data Failure');
//             return;
//         }

//         var __items = ShopData[cat].items || '';
//         if(cat==='gems' || cat==='ads'){
//             retData[cat] = ShopData[cat];
//         }

//         if (__items !== '') {
//             var catData = ShopData[cat].items;
//             var ptype = ShopData[cat].purchasetype;
//             var type = ShopData[cat].type;
//             var names = catData.names;
//             var cost = catData.cost;
//             var scroll = ShopData[cat].scroll;
//             var __cat = '' + cat;
//             var clrs = undefined;
//             var hasClr = false;
//             if(catData.clrs){
//                 hasClr = true;
//                 clrs = catData.clrs;
                
//             }
//             retData[__cat] = {};
//             retData['extra']={};
//             retData['extra']['cuw'] = Conf.cUpgrade_w;
//             retData['extra']['cub'] = Conf.cUpgrade_b;
//             var odNo = ShopData[cat].od;
//             retData[__cat]['purchasetype'] = ptype;
//             retData[__cat]['type'] = type;
//             retData[__cat]['scroll'] = scroll;
//             retData[__cat]['od'] = odNo;
//             retData[__cat]['cat'] = {};
//             var cat_subCat = Object.keys(ItemCat['' + cat]);
         
//             var itemArr = retData[__cat]['cat'];

           

//             for (var k = 0; k < cat_subCat.length; k++) {
//                 itemArr[cat_subCat[k]] = {};
//                 itemArr[cat_subCat[k]]['names'] = [];
//                 itemArr[cat_subCat[k]]['clr'] = [];
                
//                 itemArr[cat_subCat[k]]['cost'] = [];
//                 itemArr[cat_subCat[k]]['od'] = TabOrder[__cat][cat_subCat[k]];
//             }
//             retData[__cat]['cat']['owned'] = {};
//             if(TabOrder[__cat]){
//                 retData[__cat]['cat']['owned']['od'] =  TabOrder[__cat]['owned'];                
//             }
//             itemArr['owned']['names'] = [];
//             itemArr['owned']['clr'] = [];
//             var currItemName = "";
//             var id = 0;
//             var currCat = '';
//             for (var j = 0; j < names.length; j++) {
//                 currItemName = names[j];
//                 //owned item
//                 id = ItemID[currItemName];
//                 var toCheck =0 ;
//                 if(type===ShopItemType.upgradable){
//                     console.log('calling for cat:' + cat);
//                     toCheck=   checkItemUpgradable(owned['' + cat],id);
//                 }else if(type===ShopItemType.nonupgradable){
//                     toCheck=  checkItemNonUpgradable(owned['' + cat],id);
//                 }
//                 if (toCheck >= 0) {
//                     // itemArr['owned'] = 
//                     itemArr['owned']['names'].push(currItemName);
//                     if(hasClr){
//                         itemArr['owned']['clr'].push(clrs[j]);
//                     }
//                 }
//                 //other item
//                 else {
//                      console.log(currItemName);   
                   
//                     currCat = getCatFromID(id);
//                     console.log(__cat + "," + currCat + "," + id);
//                     itemArr[currCat]['names'].push(currItemName);
//                     itemArr[currCat]['cost'].push(cost[j]);
//                     if(hasClr){
//                         itemArr[currCat]['clr'].push(clrs[j]);
//                     }

//                 }
//             }
//             if (__cat === 'weapons') {
//                 addSpecialFieldsToWeapons(ItemCat['' + __cat], ShopData[cat], retData[__cat],owned.weapons,itemArr);
//             }
//             else if(__cat === 'boosters'){
//                 addSpecialFieldsToBoosters(ItemCat['' + __cat], ShopData[cat], retData[__cat],owned.boosters,itemArr);  
//             }
//         }

//     }

//     return retData;
// }

// module.exports = function (app) {
//     app.post('/login_d', function (req, res) {
//         var data = req['body'] || '';
//         var headSucc = {
//             "Content-type": "application/json",
//             'Access-Control-Allow-Origin': '*'
//         };
//         var headFail = {
//             "Content-type": "application/json"
//         };
//         var datt = "";
//         data.tags = data.tags || null;
//         if (data === '' || data.userid.length <= 1 || data.sid.length <= 1 || data.tags === null) {
//             datt = {
//                 "success": false,
//                 'message': '0'
//             };
//             res.writeHead(400, headFail);

//             res.end(JSON.stringify(datt));
//             return;
//         }
//         var uid = data.sid;
//         var tags = {};
//         var username = ('' + data.userid).substr(0, Math.min(35, data.userid.length));
//         username = username.replace(/\s/g, '_');
//         var playerid = '' + username.toLowerCase() + uid.substr(Math.max(0, uid.length - 4), Math.min(uid.length, 4));
//        DB_CONN.DB_Connect(function (err, db) {
//             if (err) {
//                 datt = {
//                     "success": false,
//                     'message': '99'
//                 };
//                 res.writeHead(200, headFail);

//                 res.end(JSON.stringify(datt));
//                 console.log('Unable to connect to MongoDB SERVER 1', err);
//                 return;
//             } else {
//                 console.log('connected to database');
//                 var collection = db.collection('players');
//                 var playerdataColl = db.collection('playerdata');
//                 var pp = {
//                     pid: playerid,
//                     displayname: username,
//                     lastonline: Date.now(),
//                     ingame: false,
//                     sid: uid
//                 };
//                 collection.update({
//                     pid: {
//                         $exists: true,
//                         $eq: playerid
//                     }
//                 }, pp, {
//                     upsert: true
//                 }, function (err, result, raw) {
//                     if (err) {
//                         datt = {
//                             "success": false,
//                             'message': '0'
//                         };
//                         res.writeHead(400, headFail);

//                         res.end(JSON.stringify(datt));
//                         return;
//                     }
//                     //no error updating player in player collection
//                     else {
//                         var rr = result || '';
//                         // player not foudn in db so added the player to player collection
//                         if (rr !== '' && rr.result && rr.result.upserted) {
//                             newplayerdata['pid'] = playerid;
//                             playerdataColl.update({
//                                 pid: {
//                                     $exists: true,
//                                     $eq: playerid
//                                 }
//                             }, newplayerdata, {
//                                 upsert: true
//                             }, function (err, result, raw) {
//                                 if (err) {
//                                     datt = {
//                                         "success": false,
//                                         'message': '0'
//                                     };
//                                     res.writeHead(400, headFail);

//                                     res.end(JSON.stringify(datt));
//                                     return;
//                                 }
//                                 //no error find player with a id in playerdata collection 
//                                 else {
//                                     var rr = result || '';
//                                     var newData = JSON.stringify({
//                                         tags: newtags,
//                                         'edata': {
//                                             'level': 1,
//                                             'reward': 0
//                                         }
//                                     });
//                                     // need to add new records to playerdata collection
//                                     if (rr !== '' && rr.result && rr.result.upserted) {
//                                         datt = {
//                                             "success": true,
//                                             'data': newData,
//                                             'message': '2'
//                                         };
//                                         res.writeHead(200, headSucc);

//                                         res.end(JSON.stringify(datt));
//                                         return;
//                                     }
//                                     // no need for upsert in the playersdata collection
//                                     else {
//                                         datt = {
//                                             "success": false,
//                                             'message': '1'
//                                         };
//                                         res.writeHead(400, headFail);
//                                         res.end(JSON.stringify(datt));
//                                         return;
//                                     }
//                                 }
//                             });
//                         }
//                         // no need for upsert in the players collection
//                         else {
//                             tags = JSON.parse(data.tags);
//                             var tagkeys = Object.keys(tags);
//                             var clientTags = [];
//                             for (var i = 0; i < tagkeys.length; i++) {
//                                 clientTags.push({
//                                     'name': tags[tagkeys[i]].tag,
//                                     'status': tags[tagkeys[i]].status
//                                 });
//                             }


//                             if (tagkeys.length >= 0) {
//                                 playerdataColl.findOne({
//                                     pid: {
//                                         $exists: true,
//                                         $eq: playerid
//                                     }
//                                 }, function (err, result) {
//                                     // player not found with player id
//                                     if (err) {
//                                         datt = {
//                                             "success": false,
//                                             'message': '0'
//                                         };
//                                         res.writeHead(400, headFail);

//                                         res.end(JSON.stringify(datt));
//                                         return;
//                                     }
//                                     // player found with id
//                                     else {
//                                         var res_ = result || '';
//                                         var player_data = {};
//                                         var pdata_tags_serv = [];
//                                         var newPush = [];
//                                         var servData = {
//                                             'maxtags': 2,
//                                             'tags': [],
//                                             'edata': {},
//                                             'upg': {}
//                                         };
//                                         var toAll = {};
//                                         var maxlen = 0;
//                                         var errors = 0;
//                                         var recordsUpdated = 0;
//                                         var msg = "";
//                                         var status = 0;
//                                         var succStatus = true;
//                                         var last_reward_time = "";
//                                         var pl_league = 1;
//                                         var pl_coins, pl_souls, pl_gems, pl_kills,
//                                             pl_ads_time, pl_quests, pl_weapons, pl_skins, pl_deco;
//                                         // player is there in db
//                                         if (res_ !== '' && res_.playerdata) {

//                                             pdata_tags_serv = res_.playerdata.tags;
//                                             servData.maxtags = res_.playerdata.max_tags;
//                                             var Dates = Date.now();
//                                             last_reward_time = (RewardData.l1RewardTime - (Date.now() - res_.playerdata.daily_reward.last_daily_reward_time));
//                                             pl_league = res_.playerdata.leaguelevel;
//                                             pl_gems = res_.playerdata.currency.gems_total;
//                                             pl_souls = res_.playerdata.currency.souls_total;
//                                             pl_kills = res_.playerdata.kills;
//                                             pl_ads_time = res_.playerdata.ads.time;
//                                             pl_quests = res_.playerdata.quests;
//                                             pl_weapons = res_.playerdata.weapons;
//                                             pl_skins = res_.playerdata.skin;
//                                             pl_deco = res_.playerdata.deco;
//                                             pl_coins = res_.playerdata.currency.coins_total;

//                                             pl_taglimit = res_.playerdata.upgrades.taglimit;
//                                             pl_magnet = res_.playerdata.upgrades.magnet;

//                                             pl_statue = res_.playerdata.upgrades.statue;
//                                             pl_statue_c = res_.playerdata.upgrades.statue_c;

//                                             pl_ghost = res_.playerdata.upgrades.ghost;
//                                             pl_ghost_c = res_.playerdata.upgrades.ghost_c;

//                                             pl_rage = res_.playerdata.rage;

//                                             pl_digger = res_.playerdata.upgrades.digger;
//                                             pl_digger_c = res_.playerdata.upgrades.digger_c;
//                                             var changeStatus = [];

//                                             for (var i = 0; i < pdata_tags_serv.length; i++) {
//                                                 var ret = notOnClient(pdata_tags_serv[i], clientTags);
//                                                 //only on server
//                                                 if (ret === 0) {
//                                                     servData.tags.push(pdata_tags_serv[i]);
//                                                 }
//                                             }
//                                             servData['edata']['shop'] = getShopDataForPlayer(res_);
//                                             servData['edata']['reward'] = last_reward_time;
//                                             servData['edata']['league'] = pl_league;
//                                             servData['edata']['souls'] = pl_souls;
//                                             servData['edata']['coins'] = pl_coins;
//                                             servData['edata']['gems'] = pl_gems;
//                                             servData['edata']['kills'] = pl_kills;
//                                             servData['edata']['quests'] = pl_quests;
//                                             servData['upg']['weapons'] = pl_weapons;
//                                             servData['upg']['skins'] = pl_skins;
//                                             servData['upg']['deco'] = pl_deco;

//                                             servData['upg']['ads'] = pl_ads_time;

//                                             servData['upg']['magnet'] = pl_magnet;
//                                             servData['upg']['ghost'] = pl_ghost;
//                                             servData['upg']['ghost_c'] = pl_ghost_c;
//                                             servData['upg']['statue'] = pl_statue;
//                                             servData['upg']['statue_c'] = pl_statue_c;
//                                             servData['upg']['souls'] = pl_souls;
//                                             servData['upg']['rage'] = pl_rage;
//                                             servData['upg']['digger'] = pl_digger;
//                                             servData['upg']['digger_c'] = pl_digger_c;
//                                             servData['upg']['taglimit'] = pl_taglimit;

//                                             for (var i = 0; i < clientTags.length; i++) {
//                                                 var ret = innerLoop(clientTags[i], pdata_tags_serv);
//                                                 //newpush
//                                                 if (ret === 0) {
//                                                     newPush.push(clientTags[i]);
//                                                 }
//                                                 //    diff status
//                                                 else if (ret === 2) {
//                                                     changeStatus.push(clientTags[i]);
//                                                 }
//                                             }
//                                             toAll = {
//                                                 n: newPush,
//                                                 c: changeStatus
//                                             };
//                                             maxLen = pdata_tags_serv.length + toAll.n.length;
//                                             // more tags tham possible
//                                             if (maxLen > 10) {
//                                                 datt = {
//                                                     "success": false,
//                                                     'message': '0'
//                                                 };
//                                                 res.writeHead(400, headFail);

//                                                 res.end(JSON.stringify(datt));
//                                                 return;
//                                             }
//                                             // if there's some new tags to push
//                                             if (toAll.n.length) {
//                                                 playerdataColl.update({
//                                                     pid: playerid
//                                                 }, {
//                                                     $addToSet: {
//                                                         "playerdata.tags": {
//                                                             $each: toAll.n
//                                                         }
//                                                     }
//                                                 }, function (err, result) {
//                                                     // pushing new tags to player document
//                                                     if (err) {
//                                                         errors++;
//                                                     }
//                                                     // change the status to current status of the tags
//                                                     else {
//                                                         recordsUpdated++;
//                                                         for (var i = 0; i < toAll.c.length; i++) {
//                                                             var tT = toAll.c[i].name;
//                                                             var sT = toAll.c[i].status;
//                                                             playerdataColl.update({
//                                                                 playerId: playerid,
//                                                                 "playerdata.tags.name": tT
//                                                             }, {
//                                                                 "$set": {
//                                                                     "playerdata.tags.$.status": sT
//                                                                 }
//                                                             }, function (err, result) {
//                                                                 if (err) {
//                                                                     errors++;
//                                                                 } else {
//                                                                     recordsUpdated++;
//                                                                 }
//                                                             });
//                                                         }
//                                                     }
//                                                 });
//                                             }
//                                             //cleint side new
//                                             else {
//                                                 for (var i = 0; i < toAll.c.length; i++) {
//                                                     var tT = toAll.c[i].name;
//                                                     var sT = toAll.c[i].status;
//                                                     playerdataColl.update({
//                                                         pid: playerid,
//                                                         "playerdata.tags.name": tT
//                                                     }, {
//                                                         "$set": {
//                                                             "playerdata.tags.$.status": sT
//                                                         }
//                                                     }, function (err, result) {
//                                                         if (err) {
//                                                             errors++;
//                                                         } else {
//                                                             recordsUpdated++;
//                                                         }
//                                                     });

//                                                 }
//                                             }

//                                             if (errors > 0 && recordsUpdated > 0) {
//                                                 msg = "1";
//                                                 status = 200;
//                                                 succStatus = true;
//                                             } else if (errors == 0 && recordsUpdated > 0) {
//                                                 msg = "2";
//                                                 status = 200;
//                                                 succStatus = true;
//                                             } else if (errors > 0 && recordsUpdated == 0) {
//                                                 msg = "0";
//                                                 status = 400;
//                                                 succStatus = false;
//                                             } else if (errors == 0 && recordsUpdated == 0) {
//                                                 msg = "2";
//                                                 status = 200;
//                                                 succStatus = true;
//                                             } else {
//                                                 msg = "2";
//                                                 status = 200;
//                                                 succStatus = true;
//                                             }
//                                             if (succStatus === true) {
//                                                 datt = {
//                                                     "success": succStatus,
//                                                     'message': msg,
//                                                     'data': servData
//                                                 };
//                                                 res.writeHead(status, headSucc);

//                                                 res.end(JSON.stringify(datt));
//                                                 return;
//                                             } else {
//                                                 datt = {
//                                                     "success": succStatus,
//                                                     'message': msg,
//                                                     'data': 'nothing'
//                                                 };
//                                                 res.writeHead(status, headFail);

//                                                 res.end(JSON.stringify(datt));
//                                                 return;
//                                             }
//                                         }
//                                     }
//                                 });

//                             }
//                             // no tag
//                             else {
//                                 datt = {
//                                     "success": false,
//                                     'message': '0'
//                                 };
//                                 res.writeHead(400, headFail);
//                                 res.end(JSON.stringify(datt));
//                                 return;
//                             }
//                         }
//                     }
//                 });

//             }
//         });
//     });

// };