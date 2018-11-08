var GridDot = require('./griddot.js');
var CONF = require('./gameConf.js');
var worldSize = require('./playerServ.js').worldSize;
var TinyMath = require('./../share/TinyMath.js');
var GRID_SIZE = CONF.GRID_SPACE_IN_DIM;
var GRID_SIZE_OPP = 1 / CONF.GRID_SPACE_IN_DIM;
var GRID_BOX_IN_1D = worldSize / GRID_SIZE;
var GRID_RECT_SPRITE_P_BLOCK = CONF.GRID_RECT_SPRITE_P_BLOCK;
var worldSizeBy2 = Math.floor(worldSize / 2);
var BLOCK_SIZE = CONF.BLOCK_SIZE;



var Block = function (id, sx, sy,bno) {
    this.id = id;
    this.bno = bno;
    this.sx = sx;
    this.sy = sy;
    this.dots = [];
    this.hasPlayer = false;
};
Block.prototype.getNo = function(){
    return this.bno;
}
Block.prototype.getStartX = function(){
    return this.sx - worldSizeBy2;
};
Block.prototype.getStartY = function(){
    return this.sy - worldSizeBy2;
};

// add item to the block
Block.prototype.addItem = function (type, item) {
    if (type === CONF.ITEM.dots) {
        this.dots.push(item);
    }
};

// Check if it contains the item
Block.prototype.hasItem = function (type, item) {
    var index = -1;
    if (type === CONF.ITEM.dots) {
        index = this.dots.indexOf(item);
    }
    if (index >= 0) {
        return index;
    }
    return -1;
};
Block.prototype.updatePlayer = function(val){
    this.hasPlayer = val;
};
// removes items frm the block
Block.prototype.removeItem = function (type, item) {
    var index = this.hasItem(type, item);
    if (index >= 0) {
        if (type === CONF.ITEM.dots) {
            this.dots.splice(index, 1);
        }
    }
};

// update the block
Block.prototype.update = function () {

};



var Blocks = function () {
    this.count = 0;
    this.blockData = {};

    this.getBlockFromLocation = function (x, y) {
        var _x =Math.min(this.count,Math.max(0,Math.floor(x / BLOCK_SIZE)));
        var _y = Math.min(this.count,Math.max(0,Math.floor(y / BLOCK_SIZE)));
        if (!this.blockData['' + (_y * this.count + _x)]) {
            return null;
        }
        var deb = _y * this.count + _x;
     //   console.log(_y + "," + this.count + "," + _x);
        return this.blockData['' + (_y * this.count + _x)];
    };

    this.getPlayerBlocks = function(pl){
        var sx = pl.position.x - pl.collider.r;
        var fx = pl.position.x + pl.collider.r;
        var sy = pl.position.y - pl.collider.r;
        var fy = pl.position.y + pl.collider.r;

        if((!sx && sx!==0) ||(!sy && sy!==0) || (!fx && fx!==0) || (!fy && fy!==0) ){
            return [];
        }
        var block1 =this.getBlockFromLocation(sx,sy) ;
        var block2 =this.getBlockFromLocation(fx,fy) ;
        if(!block1 || !block2){
            return [];
        }
      //  console.log(sx + "," + sy + "," + fx + "," + fy);
        var b1 = block1.getNo();
        var b2 = block2.getNo();
        var del = Math.abs(b2 -b1);
        var ydel = Math.floor(del/this.count);
        var bs = [];
        for(var i=0;i<del;i++){
            for(var j=0;j<ydel;j++){
                bs.push(b1 + i + j*this.count);
            }
        }
        return bs;
    };

    // updates the block
    this.update = function (pl) {
        var keys = Object.keys(this.blockData),i=0;
        var len = keys.length;
        var blocks = [];
        for( i=0;i< pl.lastBlocks.length;i++){
            this.blockData['' +  pl.lastBlocks[i]].updatePlayer(false);
        }
 
        blocks = this.getPlayerBlocks(pl);
        if (blocks) {
            pl.blocks = blocks;
            for( i=0;i<blocks.length;i++){
                this.blockData['' + blocks[i]].updatePlayer(true);
            }
        }
    };

    this.init = function () {
        var noOfBlocks = 0;
        if (BLOCK_SIZE > worldSize) {
            noOfBlocks = 1;
        }
        noOfBlocks = Math.ceil(worldSize / BLOCK_SIZE);
        this.count = noOfBlocks;
        var id = 0,
            i = 0,
            j = 0;
        var block = null;
        var ind = '' + (i * this.count + j);
        for (i = 0; i < this.count; i++) {
            for (j = 0; j < this.count; j++) {
                block = new Block(id++, i * BLOCK_SIZE, j * BLOCK_SIZE,ind);
                this.blockData['' + ind] = (block);
            }
        }
    }

    this.addToBlock = function () {

    };

    this.init();
};

module.exports = Blocks;