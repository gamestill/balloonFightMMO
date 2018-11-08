
var Conf = require('./gameConf.js');
 var worldSize = Conf.worldSize;
var SERVER_BLOCKS_COUNT = Conf.SERVER_BLOCKS_COUNT;
var GridDot = function (x, y,id) {
    this.x = x;
    this.y = y;
    this.id = id;
};


var Block = function (x, y, size, count) {
    this.sx = x;
    this.sy = y;
    this.dots = [];
    this.pls = [];
    this.bno = Math.floor(x / size) + Math.floor(y / size) * count;

    this.initDots = function (size) {
        var x = 0,
            y = 0;
        var f = Math.floor;
        var r = Math.random;
        var minx = this.sx + 1;
        var maxx = this.sx + size - 1;
        var miny = this.sy + 1;
        var maxy = this.sy + size - 1;

        for (var i = 0; i < dc; i++) {
            x = f(r() * (maxx - minx + 1)) + minx;
            y = f(r() * (maxy - miny + 1)) + miny;
            this.dots.push(new GridDot(x, y, ++this.currentId));
        }
    }
    this.init = function (size) {

    };

    this.init(size);
};

Block.prototype.getBlockNo = function () {
    return this.bno;
}
Block.prototype.hasPlayer = function (id) {
    return (this.pls.indexOf(id) >= 0 ? true : false);
}

var ServerBlocks = function () {
    this.blocks = [];
    this.bsize = worldSize / SERVER_BLOCKS_COUNT;
    this.worldSize = worldSize;
    this.bcount = SERVER_BLOCKS_COUNT;
    this.ww = 0;
    this.wh = 0;
    this.itemManager = null;
    this.init = function () {
        var ff = Math.floor;
        for (var j = 0; j < this.bcount; j++) {
            for (var i = 0; i < this.bcount; i++) {
                this.blocks.push(new Block(ff(i * this.bsize), ff(j * this.bsize), this.bsize, this.bcount));
            }
        }
    };
    this.resize = function (w, h) {
        this.wh = h;
        this.ww = w;
    }
    

    this.getBlockNo = function (pos) {
        var r = Math.floor(pos[0] / this.bsize) + Math.floor(pos[1] / this.bsize) * this.bcount;
        return r;
    };

    this.init();
};

module.exports = ServerBlocks;