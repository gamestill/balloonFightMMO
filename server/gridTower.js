
var Conf = require('./gameConf.js');
var SAT = require('./sat.js');
var SV = SAT.Vector;
var SC = SAT.Circle;
var S_R = SAT.Response;

var GridTower = function (x, y, size,ind) {
    this.x = x;
    this.y = y;
    this.index = ind;
    this.coll =  new SC(new SV(this.x ,this.y), 20);
    this.node = {
        bound: {
            minx: this.x - 25,
            miny: this.y - 25,
            maxx: this.x + 25,
            maxy: this.y + 25
        },
        index:ind,
        id:'' + this.x + '_' + this.y,
        type: Conf.COLL_OBJ_TYPE.MOVEAROUND
    };

    this.size = size;
    this.on = true;
    this.timeLeft = 0;
};

module.exports = GridTower;