
var Block = function (x, y, size, count) {
    this.sx = x;
    this.sy = y;
    this.idCount = 0;
    this.items = {};
    this.visible = false;
    this.bno = Math.floor(x / size) + Math.floor(y / size) * count;
};

Block.prototype.getBlockNo = function () {
    return this.bno;
}

Block.prototype.removeItem = function(item){
    var id = item.id;
    delete this.items['' + id];
}

Block.prototype.addItem = function(item){
    var id = this.idCount++;
    this.items['' + this.id]= item;
};


Block.prototype.getBlockNo = function () {
    return this.bno;
}
Block.prototype.showHide = function (val) {
    this.visible = val;
};
Block.prototype.isVisible = function () {
    return this.visible;
};


var ClientBlocks = function (worldSize, count, ww, wh) {
    this.blocks = [];
    this.bsize = worldSize / count;
    this.worldSize = worldSize;
    this.bcount = count;
    this.ww = ww;
    this.visibleBl = [];
    this.invisibleBl = [];
    this.wh = wh;

    this.init = function () {
        var ff = Math.floor;
        for (var j = 0; j < this.bcount; j++) {
            for (var i = 0; i < this.bcount; i++) {
                this.blocks.push(new Block(ff(i * this.bsize), ff(j * this.bsize), this.bsize, this.bcount));
            }
        }
    };

    this.getBlockNo = function (px, py) {
        return  Math.floor(  Math.max(0,px) / this.bsize) +  Math.floor(  Math.max(0,py) / this.bsize) * this.bcount;
    };

    this.init();

};

module.exports = ClientBlocks;