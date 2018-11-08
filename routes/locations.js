var __ip = require('ip');
var publicIp = require('public-ip');
var Conf = require('./../server/gameConf.js');
var ipwritten = false;

module.exports = function (app, servPort, bodyParser, status) {
    var toRetClient = '';

    function commonLoc(regionName,cb) {
        var __ipa = '';
        if (status === Conf.GAME_STATUS_N.live) {
            if (toRetClient === '') {
                publicIp.v4().then(function (val) {
                    __ipa = val;
                    toRetClient = '' + __ipa + ':' + servPort;
                    var toRet = {
                        success:1,
                        regcode:regionName,
                        server: toRetClient
                    };
                    cb(200, toRet);
                }).catch(function (reason) {
                    __ipa = '';
                    cb(400);
                });
                toRetClient = '' + __ipa + ':' + servPort;
            } 
            // already cached
            else {
                var toRet = {
                    success:1,
                    'regcode':regionName,
                    server: toRetClient
                };
                cb(200, toRet);
            }

        } else {
            var toRet = {
                success:0,
                'regcode':0,
                server: 'noserver'
            };
            cb(200, toRet);
        }
    }


    app.post('/loc/find/us_e', bodyParser.text(), function (req, res, next) {
        commonLoc(Conf.SERVER_REGIONS_TO_CODE.US_E,function (status, data) {
            data = data || '';
            res.status(status);
            if (data !== '') {
                res.send(data);

            } else {
                res.send();
            }
        });
    });

    app.post('/loc/find/us_w', bodyParser.text(), function (req, res, next) {
        commonLoc(Conf.SERVER_REGIONS_TO_CODE.US_W,function (status, data) {
            data = data || '';
            res.status(status);
            if (data !== '') {
                res.send(data);

            } else {
                res.send();
            }
        });
    });

    app.post('/loc/find/rus', bodyParser.text(), function (req, res, next) {
        commonLoc(Conf.SERVER_REGIONS_TO_CODE.RUS_W,function (status, data) {
            data = data || '';
            res.status(status);
            if (data !== '') {
                res.send(data);

            } else {
                res.send();
            }
        });
    });

    app.post('/loc/find/asia_e', bodyParser.text(), function (req, res, next) {
        commonLoc(Conf.SERVER_REGIONS_TO_CODE.ASIA_E,function (status, data) {
            data = data || '';
            res.status(status);
            if (data !== '') {
                res.send(data);

            } else {
                res.send();
            }
        });
    });

    app.post('/blocked',bodyParser.text(),function(req,res,next){
        
    });
    app.post('/loc/find/asia_w', bodyParser.text(), function (req, res, next) {
        commonLoc(Conf.SERVER_REGIONS_TO_CODE.ASIA_W,function (status, data) {
            data = data || '';
            res.status(status);
            if (data !== '') {
                res.send(data);

            } else {
                res.send();
            }
        });
    });

    app.post('/loc/find/fra', bodyParser.text(), function (req, res, next) {
        commonLoc(Conf.SERVER_REGIONS_TO_CODE.FRA,function (status, data) {
            data = data || '';
            res.status(status);
            if (data !== '') {
                res.send(data);

            } else {
                res.send();
            }
        });
    });
};