var Conf = require('./gameConf.js');


var Leaderboard_Serv = function(rend, type,winwidth,winHeight) {
    this.type = type;
    this.renderer = rend;
    this.lbRect = undefined;
    this.countsTex = undefined;
    this.plNames = undefined;
    this.winwidth = winwidth;
    this.winHeight = winHeight;
    console.log(this.winwidth + "," + this.winHeight);
    this.score = undefined;
    this.clrs = [];
    this.lbData = {};
    var ran = 0;
    console.log('type:' + type);
    this.container = new PIXI.Container();
    this.container.pivot.y = 0.5;
    this.container.pivot.x = 1;
    var records = [];

    this.lbUpdate = function(data){    
        var keys = Object.keys(this.lbData);
        for(var i=0;i<keys.length;i++){
                
        }
    };





};


module.exports = Leaderboard_Serv;