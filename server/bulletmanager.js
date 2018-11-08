var Conf = require('./gameConf.js');
var worldSize = require('./playerServ.js').worldSize;
var waterLevel = Conf.waterDepth;
var bulletLifespan = 0.7;
var SAT = require('./sat.js');
var SV = SAT.Vector;
var SC = SAT.Circle;

var Bullet = function (id, pid, pos) {
    this.pos = [pos[0], pos[1]];
    this.vel = [0, 0];
    this.pid = pid;
    this.node = null;
    this.lifeTime = 0;
    this.coll = new SC(new SV(pos[0], pos[1]),12);
    this.id = id;
    this.destroyed = false;
};
Bullet.prototype.clear = function(){
    this.id = null;
    this.destroyed = true;
    this.pid = null;
};

Bullet.prototype.update = function (dt) {
    this.pos[1] = this.pos[1] - dt * 900;
    this.coll.pos.y = this.pos[1];
    this.lifeTime+=dt;
    if (this.pos[1] > (worldSize - waterLevel) || this.lifeTime>bulletLifespan) {
        this.destroyed = true;
        return false;
    }
    return true;
};
Bullet.prototype.reset  =function(){
    this.lifeTime = 0;
    this.node = null;
    this.id = null;
    this.destroyed = true;
    this.pid = null;
};
Bullet.prototype.clearNode = function (qt) {
    if (this.node) {
        qt.remove(this.node);
    }
    this.node = null;
}
Bullet.prototype.updateNode = function (qt) {
    if (this.node) {
        qt.remove(this.node);
        this.node = null;
    }
    var pos = this.pos;

    this.node = {
        bound: {
            minx: pos[0] - 16,
            miny: pos[1] - 16,
            maxx: pos[0] + 16,
            maxy: pos[1] + 16
        },
        pid: this.pid,
        id: this.id,
        type: Conf.ITEM_TYPES.BULLET
    }
    qt.insert(this.node);
};

Bullet.prototype.init = function () {

};

var BulletManager = function () {
    this.bullets = {};
    this.bid = 0;
    this.toDel = [];
    this.networkBullets = {};

};
BulletManager.prototype.update = function (dt) {
    var keys = Object.keys(this.bullets);
    var ret = null;
    for (var i = 0; i < keys.length; i++) {
        ret = this.bullets[keys[i]].update(dt);
        if (!ret) {
            this.toDel.push(keys[i]);
        }
    }

};

BulletManager.prototype.updateNode = function (qt) {
    var keys = Object.keys(this.bullets);
    for (var i = 0; i < keys.length; i++) {
        this.bullets[keys[i]].updateNode(qt);
    }
    if (this.toDel.length > 0) {
        for (var i = 0; i < this.toDel.length; i++) {
            if(this.bullets[this.toDel[i]]){
                this.bullets[this.toDel[i]].clearNode(qt);
                delete this.bullets[this.toDel[i]];
            }
        }
        this.toDel = [];
    }
};
BulletManager.prototype.reset = function(){
    this.networkBullets = {};
    var keys = Object.keys(this.bullets);
    for (var i = 0; i < keys.length; i++) {
        this.bullets[keys[i]].reset();
    }
    this.bullets = {};
    this.bid = 0;
    this.toDel = [];
};

BulletManager.prototype.getBullets = function () {
    var bullets = {};
    var bull = null;
    var keys = Object.keys(this.networkBullets);
    for (var i = 0; i < keys.length; i++) {
        bull = this.bullets[keys[i]];
        if (bull) {
            bullets.push([bull.id, bull.pid]);
        }
    }
    this.networkBullets = {};
    return bullets;
};

BulletManager.prototype.clearBullets = function (qt,ids) {
   for(var i=0;i<ids.length;i++){
       var b = this.bullets['' + ids[i]];
       if(b){
           b.clear();
           delete this.bullets['' + ids[i]];
            if(b.node && qt.contains(b.node)){
                qt.remove(b.node);
            }
        }
   }
};
BulletManager.prototype.collision_bullet = function (id) {
    return this.bullets['' + id];
};
BulletManager.prototype.addBullet = function (pid, pos, level) {
    this.bid++;
    this.bullets['' + this.bid] = new Bullet(this.bid, pid, pos);
    this.networkBullets['' + this.bid] = 1;
    return this.bid;
}
module.exports = BulletManager;