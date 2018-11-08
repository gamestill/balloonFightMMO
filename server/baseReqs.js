var Conf = require('./../server/gameConf.js');
var request = require('request');
var requestIp = require('request-ip');
var localGame = require('./../debugmode.js');
var ipUrl = Conf.LOC_FIND_SERVICE_URL;
var GEO_KEY = Conf.GEO_KEY;
var local_url = 'localhost:4444';
var DEFAULT_COUNTRY = "US";

var MSG_TYPE = {
    'success':1,
    'blocked':2,
    'maintenance':3,
    'default':4,
    'time_error':5,
    'local':6,
    'error':7
}
var DEFAULTS = {
    'country':'us',
    'regioncode':'us_w',
    'prefix': 'loc',
    'suffix': 'find'
}
var _head_origin = {
    "Content-type": "application/json"
};
var _head_local = {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
};

var timeErrorJSON = {
    'type': MSG_TYPE.time_error,

    'prefix': 'loc',
    'suffix': 'find'
};
var BlockedJSON = {
    'type': MSG_TYPE.blocked,
    'prefix': 'loc',
    'suffix': 'find',
    'regionname':''
};
var MaintainenceJSON = {
    'type': MSG_TYPE.maintenance,

    'prefix': 'loc',
    'suffix': 'find'
};
var LOCAL_JSON = {
    'type': MSG_TYPE.local,
    'server': 'localhost:4444',
    'regcode':2222,
    'prefix': 'loc',
    'suffix': 'find'
};
var DEFAULT_JSON ={
    'type': MSG_TYPE.error,
    "region": "US_W",
    'country':'N/A',
    'prefix': 'loc',
    'suffix': 'find'
};

function isBlockedCountry(code) {
    var lcase = ('' + code).trim().toLowerCase();
    if (Conf.BLOCKED_LIST.indexOf(lcase) >= 0) {
        return true;
    }
};

function oldTimeCheck(req,res){
    var query = req['query'] || '';
    query['t'] = query['t'] || '';
    if (query === '' || query['t'] === '') {
        return 1;
    }
    var DelTime = Math.abs(Date.now() - query['t'])/1000;
    // more than 24 hrs old req
    if (DelTime > 60*60*24*100) {
        return 2;
    }
    return 3;
}

function collectData(body){
    var city = body.city;
    var zip = body.zip;
    var capital = body.location.capital;
    var language = [];
    var lang_len = body.location.languages;
    for(var i=0;i<lang_len.length;i++){
        language.push(body.location.languages[i].name);
    }
};

function sendLocationRequest(req,res) {
    var area_list = Conf.IP_LIST;
    var fullNames = Conf.IP_LIST_C;
    var fullNames_len = fullNames.length;
    var region_list = Conf.IP_TO_REGION;
    var region_len = region_list.length;
    var clientIp = requestIp.getClientIp(req);
    var reqAdd = '' + ipUrl + clientIp + '?access_key=' +GEO_KEY;
    request(reqAdd, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var type = 0;
            var _body = JSON.parse(body);
            var country_code_iso = _body.country_code || DEFAULTS.country;
            collectData(_body);
            var countryName = '';
            var indexFound = -1;
            var regionCode_kark = DEFAULTS.regioncode;
            indexFound = area_list.indexOf(country_code_iso);
            if (isBlockedCountry(country_code_iso)) {
                type = MSG_TYPE.blocked
                countryName = fullNames[Math.min(fullNames_len, indexFound + 1)] || "N/A";
                countryName = countryName.trim();
            } 
            if (indexFound >= 0) {
                type = MSG_TYPE.success;
                countryName = fullNames[Math.min(fullNames_len, indexFound + 1)] || "N/A";
                countryName = countryName.trim();
                regionCode_kark = region_list[Math.min(region_len - 1, indexFound)] ;
                regionCode_kark = ('' + regionCode_kark).toUpperCase().trim();
            }
            var datt = {
                'type':type,
                'country': countryName,
                'regcode': regionCode_kark,
                'prefix': 'loc',
                'suffix': 'find'
            };
            res.writeHead(200, _head_origin);
            res.end(JSON.stringify(datt));
        } else {
            res.writeHead(200, _head_origin);
            res.end(JSON.stringify(DEFAULT_JSON));
        }
    });
}

module.exports = function (app, port, DEFAULT_COUNTRY, STATUS) {
    //connect player to server
    app.get('/info/ini_serv', function (req, res, next) {
        var ret =oldTimeCheck(req,res);
        if(ret===1){
            res.sendStatus(400);
            return;
        }else if(ret===2){
            res.writeHead(200, _head_local);
            res.end(JSON.stringify(timeErrorJSON));
            return;
        }
        
        var isLocal = (STATUS === Conf.GAME_STATUS_N.local)?true:false;
        if(isLocal){
            res.writeHead(200);
            res.end(JSON.stringify(LOCAL_JSON));
            return;
        }   
        else if (STATUS === Conf.GAME_STATUS_N.maintenance) {
            res.writeHead(200, _head_origin);
            res.end(JSON.stringify(MaintainenceJSON));
            return;
        } 
        else if (STATUS === Conf.GAME_STATUS_N.blocked) {
            res.writeHead(200, _head_origin);

            res.end(JSON.stringify(BlockedJSON));
            return;
        }
         else if (STATUS === Conf.GAME_STATUS_N.live) {
            sendLocationRequest(req,res);
            return;
        } 
      
    });
};