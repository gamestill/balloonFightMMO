JQuery = $ = require('jquery');
var Conf = require('./gameConf.js');
var Color = require('./common/colors.js');
var DEFAULT_LOC = 'US';
var _local = "@@00false";
var local = ('' + _local).substr(4, _local.length - 4);
var local_port = "@@,4444";
local_port = ('' + local_port).substr(3, local_port.length - 3);
var baseUrl = 'http://kark.io';
if (local === 'true') {
    baseUrl = 'http://localhost:4444';
} else {
    baseUrl = 'http://kark.io';
}

function IsJsonString(str) {
    try {
        var o = JSON.parse(str);
        if (o && typeof o === "object") {
            return o;
        }
    } catch (e) {}

    return false;
}

function JQ_click(classname, id_class, cb) {
    $("" + id_class + classname).on('click', cb);
}

var ReqServer = function (app) {
    var GAME_SERVER = '';
    this.app = app;
    this.init = function (url) {
        GAME_SERVER = url;
    };
    this.dbLogin = false;
    this.dbTimeOuthandle = null;

    this.dbTimeout = function () {
        if (this.dbTimeOuthandle) {
            clearTimeout(this.dbTimeOuthandle);
            this.dbTimeOuthandle = null;
        }
        this.app.dbConnected = false;
        this.app.getErrorHand().showError('Cannot connect to database server. Please try again later.', Color.DARK);
    };

    this.getDirectData = function (serv, cb) {
        var servStr = baseUrl + '/loc/find/' + serv;
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("Content-type", "text/plain");
            },
            type: "POST",
            url: servStr,
            data: serv,
        }).done(function (data) {
            var suff = data.suff || '';
            Conf.VER_PACK = suff;
            var reg = data.reg || '';
            var server = data.server || '';
            if (server !== '' && reg !== '')
                cb(reg, server);
        }).fail(function () {
            console.log('failed to connect to serv');
        });
    };

    // 1 success
    // 2 blocked
    // 3 maintenance
    // 4 default
    // 5 time-error
    // 6 local


    this.getMData = function (priority, cb) {
            cb('localhost:4444',1,'ase001','IN');
    };
};

module.exports = ReqServer;