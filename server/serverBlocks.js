'use strict';
var SAT = require('./sat.js');
var Conf = require('./gameConf.js');
var GridDot = require('./griddot.js');
var FMath = require('./fastmath.js');
var BW = require("./lib/BinaryWriter.js");
var BR = require("./lib/BinaryReader.js");
var fMath = new FMath();
var worldSize = Conf.WORLD_SIZE;
var SERVER_BLOCKS_COUNT = Conf.SERVER_BLOCKS_COUNT;
var BB_SIZE = Math.floor(Conf.WORLD_SIZE / Conf.SERVER_BLOCKS_COUNT);

var CIC = SAT.testCircleCircle;
var PIC = SAT.pointInCircle;
var V = SAT.Vector;
var SC = SAT.Circle;
var S_R = SAT.Response;
var B = SAT.Box;
var waterLevel = Conf.waterDepth;
var MIN_FOOD = 1;
var MAX_FOOD = 100;
var SV = SAT.Vector;
var SC = SAT.Circle;

var Block = function (x, y, size, count, parent) {
    this.sx = x;
    this.sy = y;
    this.minx = Math.max(50, x + 1);
    this.maxx = Math.min(worldSize - 50, x + size - 1);
    this.maxy = Math.min(worldSize - waterLevel, y + size - 1);
    this.miny = Math.max(50, y + 1);
    this.dots = {};
    this.food_Small = [];
    this.players = {};
    this.totalFoodInBlock = 0;
    this.bno = Math.floor(x / size) + Math.floor(y / size) * count;

    this.init = function (size, parent) {
        this.initFood(size, parent);
    };
    this.init(size, parent);
};


Block.prototype.getFood = function () {
    return this.food_Small;
};

Block.prototype.resetNode = function(){
    var keys = Object.keys(this.dots);
    for (var i = 0; i < keys.length; i++) {
        this.dots[keys[i]].node = null;
    }
}

Block.prototype.addFoodToQT = function (qt) {

    var keys = Object.keys(this.dots);
    for (var i = 0; i < keys.length; i++) {
        var node = this.dots[keys[i]].node;
        node && qt.insert(node);
    }
};


Block.prototype.getPlayers = function () {
    return Object.keys(this.players);
}

Block.prototype.initFood = function ( size, parent) {
    var x = 0,
        y = 0;
    var __MIN = MIN_FOOD;
        var dc = fMath.getRandom(__MIN,MAX_FOOD);
        if(dc<__MIN*10){
            dc =__MIN;
        }
    var ids = parent.currentId;
    for (var i = 0; i < dc; i++) {
        parent.foodInSpace++;
        var ret = this.getXandY(parent.foodIdsInUse);
        x = ret[0];
        y = ret[1];
        this.dots['' + ++ids] = new GridDot(1, x, y, ids, this.bno, 1, -1);
        this.food_Small.push([ids, x, y, 1, 1]);
        parent.totalFood++;
    }
    this.totalFoodInBlock = dc;
    parent.currentId = ids;
}
Block.prototype.getXandY = function (ids, debug) {
    var x = null;
    var y = null;
    var uid = null;
    if (debug) {
        this.maxx = 50;
        this.minx = 20;
        this.miny = 20;
        this.maxy = 50;
    };
    do {
        x = Math.floor(Math.random() * (this.maxx - this.minx + 1)) + this.minx;
        y = Math.floor(Math.random() * (this.maxy - this.miny + 1)) + this.miny;
        uid = (x + y) * (x + y + 1) * 0.5 + x;
    } while (ids['' + uid]);
    ids['' + uid] = 1;
    return [x, y];
}
Block.prototype.singleNewFood = function ( value, x, y, qt, parent, state, pid) {
    var ids = parent.currentId,
        angryRet = [-1, 0],ret = [];
    ids++;
    this.dots['' + ids] = new GridDot(value, x, y, ids, this.bno, state, pid);
    ret.push(x, y, value, state);
    this.food_Small.push([ids, x, y, value, state]);
    this.dots['' + ids].node && qt.insert(this.dots['' + ids].node);
    parent.currentId = ids;
    parent.foodInSpace+=value;
    return [this.bno, ret, angryRet];
}
Block.prototype.newFood = function (value, qt, count, parent) {
    var ids = parent.currentId,
        size = parent.bsize,
        ret = [],
        newXY = [];
    for (var i = 0; i < count; i++) {
        parent.foodInSpace+=value;
        newXY = this.getXandY(parent.foodIdsInUse);
        ids++;
        this.dots['' + ids] = new GridDot(value, newXY[0], newXY[1], ids, this.bno, 1, -1);
        ret.push(newXY[0], newXY[1], value, 1);
        this.food_Small.push([ids, newXY[0], newXY[1], value, 1]);
        this.dots['' + ids].node && qt.insert(this.dots['' + ids].node);
    }
    parent.currentId = ids;
    return [this.bno, ret];
};
Block.prototype.emptyFood = function (id, parent) {
    var dot = this.dots['' + id];
    delete parent.foodIdsInUse['' + dot.uid];
    delete this.dots['' + id];
    for (var i = 0; i < this.food_Small.length; i++) {
        if (this.food_Small[i][0] === id) {
            ind = i;
            break;
        }
    }
    ind >= 0 && this.food_Small.splice(ind, 1);
    parent.foodInSpace = 0;
}
Block.prototype.removeFood = function (id, parent) {
    var dot = this.dots['' + id];
  var ret =  dot.disableColl();
    delete parent.foodIdsInUse['' + dot.uid];
    delete this.dots['' + id];
    var ind = -1;
    parent.foodInSpace -= ret || 1;
    for (var i = 0; i < this.food_Small.length; i++) {
        if (this.food_Small[i][0] === id) {
            ind = i;
            break;
        }
    }
    ind >= 0 && this.food_Small.splice(ind, 1);
    return dot.node;
};

Block.prototype.getBlockNo = function () {
    return this.bno;
}
Block.prototype.hasPlayer = function (id) {
    return (this.players['' + id]);
}

Block.prototype.addPlayer = function (id) {
    this.players['' + id] = 1;
};

Block.prototype.removePlayer = function (id) {
    delete this.players['' + id];
};


var ServerBlocks = function () {
    this.blocks = [];
    this.nodesToDelete = [];
    this.foodIdsInUse = {};
    this.bsize = worldSize / SERVER_BLOCKS_COUNT;
    this.worldSize = worldSize;
    this.bcount = SERVER_BLOCKS_COUNT;
    this.ww = 0;
    this.wh = 0;
    this.totalFood = 0;
    this.itemManager = null;
    this.currentId = 0;
    this.foodInSpace = 0;
    this.angryFood = [];
    this.lastBlock = 0;
    this.blocksByPlayer = [{}];
    var sortRet = [];



    this.blockCount = function () {
        return this.blocks.length;
    }
    this.getPositionInBlock = function (bno) {
        var bl = this.blocks[bno];
        var startx = bl.sx + 100;
        var endx = bl.sx + this.bsize - 100;
        var starty = bl.sy + 100;
        var endy = bl.sy + this.bsize - 100;
        var r1 = Math.floor(Math.random() * (endx - startx)) + startx;
        var r2 = Math.floor(Math.random() * (endy - starty)) + starty;
        return [r1, r2];
    };
    this.init = function () {
        var ff = Math.floor;
        var bl = null;
        for (var j = 0; j < this.bcount; j++) {
            for (var i = 0; i < this.bcount; i++) {
                bl = new Block(ff(i * this.bsize), ff(j * this.bsize), this.bsize, this.bcount, this);
                this.blocks.push(bl);
                this.blocksByPlayer[0]['' + this.blocks.length - 1] = 0;
            }
        }
        this.lastBlock = this.blocks.length - 1;
    };
 
    this.newFoodAtPos = function ( px, py, qt, value, state, pid) {
        var added = [];
        var ret = {};
        var x = px;
        var y = py;
        var count = 0;
        var uid = null;
        do {
            count++;
            x = Math.min(worldSize - 30, Math.max(30, x + 1));
            y = Math.min(worldSize - waterLevel - 100, Math.max(30, y + 1));
            uid = (x + y) * (x + y + 1) * 0.5 + x;

            if (count > 5) {
                return;
            }
        } while (this.foodIdsInUse['' + uid]);
        this.foodIdsInUse['' + uid] = 1;
        var blockInd = this.getBlockNo([x, y]);
        if(!this.blocks[blockInd]){
            var q =3;
        }
        added = this.blocks[blockInd].singleNewFood( value, x, y, qt, this, state, pid);
        ret['' + added[0]] = ret['' + added[0]] || [];
        ret['' + added[0]] = ret['' + added[0]].concat(added[1]);
        return ret;
    };
    this.getRandomPos = function(){
        var x = fMath.getRandom(10,worldSize);
        var y = fMath.getRandom(10,worldSize);
        //return [200,200];
      return [Math.min(worldSize - 500, Math.max(500, x + 1)),Math.min(worldSize - waterLevel - 300, Math.max(300, y + 1))];
    };
    this.newFood = function ( value, qt, count) {
        var added = [];
        var ret = {};
        var sortRet = [];
        var _val = value;
        var blockInd = fMath.getRandom(0, this.bcount * this.bcount - 1);
        blockInd = 0;
        if(count<20){
            value= 1;
        }else{
            count = Math.ceil(count/20);
        }
        added = this.blocks[blockInd].newFood( value, qt, count, this);
        ret['' + added[0]] = ret['' + added[0]] || [];
        ret['' + added[0]] = ret['' + added[0]].concat(added[1]);
        return ret;
    };
    this.resize = function (w, h) {
        this.wh = h;
        this.ww = w;
    }
    this.reset = function(){
        while(this.blocks.length>0){
            this.blocks[0].resetNode();
            this.blocks.splice(0,1);
        }
        var keys = Object.keys(this.foodIdsInUse);
        for(var i=0;i<keys.length;i++){
            delete this.foodIdsInUse[keys[i]];
        }

        this.blocks = [];
        this.foodIdsInUse = {};
        this.blocksByPlayer = [{}];
        this.init();
    };
    this.addToQt = function (qt, added) {
        if (added) {
            return;
        }
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].addFoodToQT(qt);
        } 
    }

    this.collision_dot = function (id, block) {
        var a = this.blocks[block].dots['' + id];
        return a;
    }
    // this.clearBlock = function () {
    //     for (var i = 0; i < this.blocks.length; i++) {
    //         this.blocks[i].clearBlock();
    //     }
    // }
    this.emptyFood = function (block, id) {
        this.blocks[block].emptyFood(id, this);
    }
    this.removeFood = function (block, id) {
        return this.blocks[block].removeFood(id, this);

    }

    this.getFoodForBlocks = function (blocks) {
        var d = [],
            b = [],
            g = [];
        for (var i = 0; i < blocks.length; i++) {
            d.push(this.blocks[+blocks[i]].getFood());
            b.push(this.blocks[+blocks[i]].getBlockNo());
        }
        return [b, d];
    }
    this.addFood = function (x, y) {
        var bno = Math.floor(x / this.bsize) + Math.floor(y / this.bsize) * this.bcount;
        this.blocks[+bno].addFood(x, y, this);
    };

    this.getScreenBlocks = function (pl) {
        var pos = pl.position,
            ww = pl.ww,
            wh = pl.wh,
            pl_lr = pl.range;
        var myBl = this.getBlockNo([pos[0], pos[1]]);
        var sb = this.getBlockNo([pos[0] - ww / 2, pos[1] - wh / 2]);
        var eb = this.getBlockNo([pos[0] + ww / 2, pos[1] + wh / 2]);
        var sRowNo = Math.floor(sb / (this.bcount)); //starts from zero
        var eRowNo = Math.floor(eb / (this.bcount));
        var sColNo = sb % this.bcount,
            eColNo = eb % this.bcount
        var range = [],
            enterColl = [],
            exitColl = [],
            ecIndex = -1;
        for (var j = sRowNo; j <= sRowNo + (eRowNo - sRowNo); j++) {
            for (var i = sColNo; i <= sColNo + (eColNo - sColNo); i++) {
                ecIndex = (i + j * this.bcount);
                range.push(ecIndex);
                pl_lr.indexOf(ecIndex) < 0 && enterColl.push(ecIndex);

            }
        }
        for (var i = 0; i < pl_lr.length; i++) {
            if (range.indexOf(pl_lr[i]) < 0) {
                exitColl.push(pl_lr[i]);
            }
        }
        pl.range = range;
        pl.enterColl = enterColl;
        pl.exitColl = exitColl;
        pl.currBlock = myBl;
        if (pl.lastBlock !== pl.currBlock && pl.currBlock < 10000) {
            this.blocksByPlayer[0]['' + pl.currBlock]++;
            this.blocks[pl.currBlock].addPlayer(pl.pid);
            if (pl.lastBlock < 10000) {
                this.blocksByPlayer[0]['' + pl.lastBlock] = Math.max(0, --this.blocksByPlayer[0]['' + pl.lastBlock]);
                this.blocks[pl.lastBlock].removePlayer(pl.pid);

            }
        }
    };

    this.getBlockNo = function (pos) {
        pos[0] = Math.max(3, Math.min(worldSize - 3, pos[0]));
        pos[1] = Math.max(3, Math.min(worldSize - 3, pos[1]));
        return Math.floor(pos[0] / this.bsize) + Math.floor(pos[1] / this.bsize) * this.bcount;
    };

    this.init();
};

module.exports = ServerBlocks;