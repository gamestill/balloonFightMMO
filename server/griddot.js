var CONF = require('./gameConf.js');
var SAT = require('./sat.js');
var SV = SAT.Vector;
var SC = SAT.Circle;

var TYPE = {
    'happy':1,
    'sad':2
}

var GridDot = function (value,x, y,id,bno,type,pid) {
    this.x = x;
    this.y = y;
    this.pid = pid || -1;
    this.type = type || TYPE.happy;
    this.value = value;
    this.block = bno;
    this.collD = false;
    this.coll = new SV(x, y);
    this.uid =Math.floor((0.5 * Math.max(x, y) * (Math.max(x, y) + 1)) + Math.min(x, y));
    this.id = id;
    this.node = {
        bound: {
            minx: this.x - 10,
            miny: this.y - 10,
            maxx: this.x + 10,
            maxy: this.y + 10
        },
        id: this.id,
        block:bno,
        type:CONF.ITEM_TYPES.FOOD
    };
};

GridDot.prototype.disableColl = function(){
    this.collD = true;
    return this.value;
};

GridDot.prototype.getColl = function () {
    return this.coll;
};

module.exports = GridDot;
