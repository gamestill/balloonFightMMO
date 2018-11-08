var Conf = require('./server/gameConf.js');
module.exports = function(){
    (function () {
    var serv_data_final = Conf.SERVER_DATA || {};
    var serv_data_main = Conf.servers;

    var keys = Object.keys(serv_data_main);
    var keyI = "";
    var loc = "";
    var ipv4 = "";
    var dbcount = 0;
    var gameservcount = 0;
    var gameserv = "";
    var nginx = "";
    var type = "";
    for (var i = 0; i < keys.length; i++) {
        keyI = (('' + keys[i])).toLowerCase();
        //database serv
        //nginx + game servers
        if (keyI.indexOf('s') >= 0) {
            loc = serv_data_main['' + keyI][0];
            type = serv_data_main['' + keyI][1];
            nginx = serv_data_main['' + keyI][2];
            gameservcount++;
            var __key = 'server' + gameservcount;
            serv_data_final[__key] = {
                "type": type,
                "loc": loc,
                "ipv4": nginx,
                "servers": []
            }
            for (var j = 3; j < serv_data_main['' + keyI].length; j++) {
                gameserv = serv_data_main['' + keyI][j];
                serv_data_final[__key]['servers'].push('' + gameserv);
            }
        }
    }

})(this);
};