
var DIR = {
    'PRODUCTION':'/public/',
    'LOCAL':'/',
    'LIVE':'/public/',
    'MAINTENANCE':'/',
    'BLOCKED':'/'
};
var fs = require('fs')
var Conf = require('./server/gameConf.js');
var pkg = process.cwd() || '';
var json = '';
var localPort = process.env.PORT || 2222;
var final_mode = process.env.GAME_STATUS || 'local';

if(pkg==='' || (final_mode === Conf.GAME_STATUS_N.local) ){
    json = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
}
else if(final_mode === Conf.GAME_STATUS_N.live){
    json = JSON.parse(fs.readFileSync(pkg + '/karkio/package.json', 'utf8'))
}
var version = 0;
if(json){
    version = json.version;
}else{
    version = "0.1.13981"
}

var data = {
    mode: Conf.GAME_STATUS_N['' + final_mode],
    fileDir:DIR[Conf.GAME_STATUS_N['' + final_mode]],
    port :localPort
};

module.exports = data;
module.exports.version = version;
