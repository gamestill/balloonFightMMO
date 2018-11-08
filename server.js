/// ENV VARIABLES

// GAME_STATUS
// NODE_ENV
// PORT

function typeCheck(check) {
    var toCheck = ('' + check).toLowerCase().trim();
    if ( (toCheck === Conf.GAME_STATUS_N.blocked) || (toCheck ===  Conf.GAME_STATUS_N.live) || (toCheck ===  Conf.GAME_STATUS_N.local) || (toCheck === Conf.GAME_STATUS_N.maintenance))
        return true;
    return false;
}
var manualMode = 'local';
var Conf = require('./server/gameConf.js');
var pstate = null;
console.log('server mode:::' +process.env.GAME_STATUS);
if (process.env.GAME_STATUS) {
    pstate = typeCheck(process.env.GAME_STATUS);
    if (!pstate) {
        console.error("GAME_STATUS ENVIORNMENT VAR NOT SET PROPERLY");
        return;
    }
}
else{
    console.error("GAME_STATUS ENVIORNMENT VAR NOT SET PROPERLY");
    return;
}
var onlineState = process.env.GAME_STATUS;
onlineState = Conf.GAME_STATUS['' + onlineState];
var __state = process.env.GAME_STATUS || manualMode;

var GAME_STATUS = __state;
var DEFAULT_COUNTRY = "US";
var generatePrimus = false;
Conf.SERVER_CODE = process.env.SERVER_CODE;

var app = require('./app')(generatePrimus,GAME_STATUS, DEFAULT_COUNTRY);
var __debug = require('./debugmode.js');
var port = process.env.PORT || __debug.port;

var server = app.listen(port, function () {
    console.log('server listening on port no : ' + port);
});