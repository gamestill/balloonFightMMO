var Conf = require('./gameConf.js');
var FMath = require('./fastmath.js');
var fMath = new FMath();
var ROTATION_SPEED = Conf.WINGS_ROTATION_BASE_SPEED;
var PL_RAD = Conf.PL_WINGS_RAD;
var WING_RAD = Conf.WING_RAD;
var BABY_WING_LEN_COUNT = 3;
var MAX_PER_WING_LEN = Conf.MAX_PER_WING_LEN;
var MAX_EXT_LEN = Conf.MAX_EXT_LEN;
var MAX_WING_DEPTH = Conf.MAX_WING_DEPTH;
var WING_LEN_FOR_COOL_WINGS = Conf.MIN_LEN_FOR_COOL_WINGS;
var FOOD_FOR_A_BEAD_IN_WING =Conf.FOOD_FOR_A_BEAD_IN_WING;
var MAX_WINGS = Math.pow(2, MAX_WING_DEPTH) / 2;
var MAX_WINGS_FAC = (MAX_WINGS / 2);
var MIN_EXT_REQ_TO_SPLIT = 2;
var SAT = require('./sat.js');
var SV = SAT.Vector;
var SC = SAT.Circle;
var S_R = SAT.Response;
var SP = SAT.Polygon;
var CIC = SAT.testCircleCircle;
var PIC = SAT.pointInCircle;

var WING_ANG = [0, 90, 45, 135, 22, 67, 112, 157];

var Extension = function (index, win, pid, wingArrIndex, child, power) {
    this.wArrIndex = wingArrIndex;
    this.pid = pid;
    this.child = child;
    this.power = power;
    this.wingIndex = win;
    this.id = index;
    this.node = null;
    this.vec = new SV(0, 0);
    this.collider = new SC(this.vec, WING_RAD * 4);
    this.powerExt = false;
}
Extension.prototype.update = function (x, y, powerExt) {
    this.vec.x = x;
    this.vec.y = y;
    this.collider.pos = this.vec;
    this.powerExt = powerExt;
};

Extension.prototype.getCollider = function () {
    return this.collider;
};
Extension.prototype.getPos = function () {
    return this.collider.pos;
};

Extension.prototype.clean = function (qt) {
    if (this.node) {
        qt.remove(this.node);
    }
    this.node = null;
};

Extension.prototype.collision_player = function (last) {
    if (last) {
        console.log('collision with the last body');
    } else {
        console.log('collision with normal body');
    }
};

Extension.prototype.updateNode = function (qt, last) {
    if (this.node) {
        qt.remove(this.node);
    }
    this.node = {
        bound: {
            minx: this.vec.x - WING_RAD,
            miny: this.vec.y - WING_RAD,
            maxx: this.vec.x + WING_RAD,
            maxy: this.vec.y + WING_RAD
        },
        id: this.id,
        pid: this.pid,
        c: this.child,
        warrid: this.wArrIndex,
        wid: this.wingIndex,
    };
    this.node.type = last ? Conf.ITEM_TYPES.WING_MAIN : Conf.ITEM_TYPES.WING_EXT;
    qt.insert(this.node);
};

var ChildWing = function (parent, arrIndex, d, wingId, pid, ba) {
    this.d = d;
    this.baseAngle = ba;
    this.extension = [];
    this.arrIndex = arrIndex;
    this.angle = 0;
    this.wingId = wingId;
    this.on = true;
    this.pid = pid;
    this.pos = [0, 0];
};

ChildWing.prototype.resetAngle = function () {
    this.angle = this.baseAngle;
};
ChildWing.prototype.setAngle = function (angle) {
    this.angle = angle;
};

ChildWing.prototype.addOneExtension = function (parent) {
    parent.wingIndex++;
    this.extension.push(new Extension(parent.wingIndex, this.id, this.pid, this.arrIndex));

};

ChildWing.prototype.addBeadsToWings = function (parent, count) {

    for (var i = 0; i < count; i++) {
        this.addOneExtension(parent);
    }

};

ChildWing.prototype.updateNode = function (qt) {
    var last = false;
    for (var i = 1; i < this.extension.length; i++) {
        last = i >= (WING_LEN_FOR_COOL_WINGS - 1) && (i === this.extension.length - 1);
        this.extension[i].updateNode(qt, last);
    }
};
ChildWing.prototype.closeWing = function (qt, type) {
    var extLen = this.extension.length;
    this.active = false;
    this.on = false;
    if (+type === 1) {
        this.active = true;
        this.on = true;
    }
    for (var i = 1; i < extLen; i++) {
        this.extension[i].clean(qt);
    }
    this.extension = [];
    return extLen;
};

ChildWing.prototype.update = function (dt, x, y, angle) {
    var last = false;
    var WING_RAD_L = WING_RAD;
    this.angle = angle;
    var a = angle * Math.PI / 180;
    var ca = fMath.cos(a);
    var sa = fMath.sin(a);
    this.pos[0] = x - (this.d + WING_RAD_L) * ca;
    this.pos[1] = y - (this.d + WING_RAD_L) * sa;
    for (var i = 0; i < this.extension.length; i++) {
        last = i >= (WING_LEN_FOR_COOL_WINGS - 1) && (i === this.extension.length - 1);
        var dx = this.pos[0] + (2 * (i + 1) * WING_RAD_L) * ca;
        var dy = this.pos[1] + (2 * (i + 1) * WING_RAD_L) * sa;
        this.extension[i].update(dx, dy, last);

    }
};

var Wing = function (parent, arrIndex, d, wingId, pid, baseAngle, count) {
    this.d = d;
    this.baseAngle = baseAngle;
    this.active = true;
    this.arrIndex = arrIndex;
    this.pos = [0, 0];
    this.pid = pid;
    this.wingId = wingId;
    this.on = true;
    this.childWing = null;
    this.extension = [];
    this.totalExt = 0;
    this.angle = 0;
    this.setupWing(parent, count);
};
Wing.prototype.getColliders = function () {
    var ret = [];
    for (var i = 0; i < this.extension.length; i++) {
        ret.push(this.extension[i].collider);
    }
    for (var i = 0; i < this.childWing.extension.length; i++) {
        ret.push(this.childWing.extension[i].collider);
    }

    return ret;
};
Wing.prototype.setupWing = function (parent, beadCount) {
    var count = beadCount;
    this.totalExt = 0;
    this.childWing = new ChildWing(parent, this.arrIndex, -PL_RAD, this.wingId, this.pid, (this.baseAngle + 180) % 360);
    this.addBeadsToWings(parent, count, true);
    this.totalExt += count;
};

Wing.prototype.updateNode = function (qt) {
    var last = false;
    this.childWing.updateNode(qt);
    for (var i = 1; i < this.extension.length; i++) {
        last = i >= (WING_LEN_FOR_COOL_WINGS - 1) && (i === this.extension.length - 1);
        this.extension[i].updateNode(qt, last);
    }
};

Wing.prototype.addOneExtension = function (parent) {
    parent.wingIndex++;
    this.extension.push(new Extension(parent.wingIndex, this.id, this.pid, this.arrIndex));
    return this.extension.length;
};

Wing.prototype.addBeadsToWings = function (parent, count, child) {

    for (var i = 0; i < count; i++) {
        this.addOneExtension(parent);
    }
    if (child) {
        this.childWing.addBeadsToWings(parent, count);
    }
    this.totalExt += count * 2;
    return (Math.min(this.extension.length, this.childWing.extension.length));
};

Wing.prototype.update = function (dt, x, y) {
    var last = false;
    var WING_RAD_L = WING_RAD;
    this.angle = (this.angle + ROTATION_SPEED * dt) % 360;
    var a = this.angle * Math.PI / 180;
    this.childWing.update(dt, x, y, (this.angle + 180) % 360);
    var ca = fMath.cos(a);
    var sa = fMath.sin(a);
    this.pos[0] = x + (this.d + WING_RAD_L) * ca;
    this.pos[1] = y + (this.d + WING_RAD_L) * sa;
    for (var i = 0; i < this.extension.length; i++) {
        last = i >= (WING_LEN_FOR_COOL_WINGS - 1) && (i === this.extension.length - 1);
        var dx = this.pos[0] + (2 * (i + 1) * WING_RAD_L) * ca;
        var dy = this.pos[1] + (2 * (i + 1) * WING_RAD_L) * sa;
        this.extension[i].update(dx, dy, last);
    }
    //   console.log(this.extension[this.extension.length-1].vec.x + "," + this.extension[this.extension.length-1].vec.x);
};

Wing.prototype.resetAngle = function () {
    this.angle = this.baseAngle;
    this.childWing.resetAngle((this.angle + 180) % 360);
};

Wing.prototype.closeWing = function (qt, type) {
    var count = 0;
    var extLen = this.extension.length;
    this.active = false;
    this.on = false;
    if (+type === 1) {
        this.active = true;
        this.on = true;
    }

    for (var i = 1; i < extLen; i++) {
        this.extension[i].clean(qt);
    }
    this.extension = [];
    count = this.childWing.closeWing(qt, type);
    return extLen + count;
};

Wing.prototype.maxWingSize = function () {
    if (!this.on) {
        return 0;
    }
    return Math.min(this.extension.length, this.childWing.extension.length);
}

Wing.prototype.canSplit = function () {
    if (this.extension.length >= MIN_EXT_REQ_TO_SPLIT && this.childWing.extension.length >= MIN_EXT_REQ_TO_SPLIT) {
        return true;
    }
    return false;
};

Wing.prototype.totalExtCount = function () {
    return this.extension.length + this.childWing.extension.length;
}

Wing.prototype.collision_player = function (wid, id) {
    var last = false;
    // for (var i = 0; i < this.extension; i++) {
    //     if (+this.extension[i].id === +id) {
    //         last = (i === this.extension.length - 1);
    //         this.collision_player(last);
    //         return;
    //     }
    // }
};

var WingsManager = function (pid) {
    if (!WingsManager.prototype.wingIndex) {
        WingsManager.prototype.wingIndex = 0;
    }
    this.plx = 0;
    this.ply = 0;
    this.pid = pid;
    this.angle = 0;
    this.depthLevel = 0;
    this.canSplit = false;
    this.allExtCount = 0;
    this.changeBits = 0;
    this.positiveChange = 0;
    this.foodCounter = 0;
    this.wingId = 0;
    this.wings = [];
    this.lastWingBits = 0;
    this.longestWing = [0, 0];
    this.wingBits = 0;
};

module.exports = WingsManager;

WingsManager.prototype.getWingsCount = function () {
    return this.wings.length;
};

WingsManager.prototype.collision_wing_player = function (wid, id, wingArrIndex) {
    this.wings[wingArrIndex].collision_player(wid, id);
};

WingsManager.prototype.foodConsumed = function (count) {
    this.foodCounter += count;
    var activeWingLen = Math.pow(2, this.depthLevel - 1);
    var ret = false;
    if (this.foodCounter >= FOOD_FOR_A_BEAD_IN_WING * activeWingLen) {
        if (this.addBeadsToAllActiveWings()) {
            this.foodCounter = 0;
            return 1;
        }
    }
    return 0;
};

WingsManager.prototype.addBeadsToAllActiveWings = function () {
    if (this.allExtCount >= MAX_EXT_LEN) {
        console.log('already maxed out');
        return false;
    }
    for (var i = 0; i < this.wings.length; i++) {
        if (this.wings[i].on) {
            this.wings[i].addBeadsToWings(this, 1, true);
        }
    }
    return true;
};

WingsManager.prototype.getWingBits = function (notUpdate) {
    var rot = [];
    var ext = [];
    var wing = null;
     this.updateWingBits();
    for (var i = 0; i < this.wings.length; i++) {
        wing = this.wings[i];
        if(!wing.on){
            continue;
        }
        rot.push(wing.angle);
        ext.push([wing.extension.length, wing.childWing.extension.length]);
    }
    return [this.wingBits, rot, ext];
}

WingsManager.prototype.getWingData_start = function () {
    var data = [];
    var bits = 0;
    var rot = [];
    var ext = [];
    for (var i = 0; i < this.wings.length; i++) {
        if (this.wings[i].on) {
            bits = fMath.setBit(this.wingBits, i);
            rot.push(this.wings[i].angle);
            ext.push([this.wings[i].extension.length, this.wings[i].childWing.extension.length]);
        } else {
            bits = fMath.clearBit(this.wingBits, i);
        }
    }
    return [bits, rot, ext];
};
WingsManager.prototype.updateWingBits = function () {
    for (var i = 0; i < this.wings.length; i++) {
        if (this.wings[i].on) {
            this.wingBits = fMath.setBit(this.wingBits, i);
        } else {
            this.wingBits = fMath.clearBit(this.wingBits, i);
        }
    }
};


WingsManager.prototype.mergeWings = function (qt) {
    var count = 0;
    if (this.wings.length <= 1) {
        console.log('cannot merge wings');
        return;
    }
    var activeWingLen = Math.pow(2, this.depthLevel - 1);
    if (activeWingLen <= 1) {
        console.log('cannot merge wings');
        return;
    }
    var halfLen = Math.floor(activeWingLen / 2);
    for (var i = halfLen; i < this.wings.length; i++) {
        count += this.wings[i].closeWing(qt);
    }
    var perWing = Math.floor(count / (halfLen * 2));
    this.depthLevel--;
    for (var i = 0; i < halfLen; i++) {
        this.wings[i].addBeadsToWings(this, Math.max(0, perWing), true);
    }
};
WingsManager.prototype.splitExistingWings = function (activeWingLen, qt) {
    for (var i = 0; i < activeWingLen; i++) {
        if (!this.wings[i].canSplit()) {
            return;
        }
    }
    var oldWingLen = Math.pow(2, this.depthLevel - 1);
    var count = 0;
    for (var i = 0; i < oldWingLen; i++) {
        count += this.wings[i].closeWing(qt, 1);
    }
    this.depthLevel++;
    var activeWingLen = Math.pow(2, this.depthLevel - 1);
    var perWing = Math.floor(+count / (activeWingLen * 2));
    for (var i = 0; i < activeWingLen; i++) {
        this.wings[i].on = true;
        this.wings[i].active = true;
        this.wings[i].addBeadsToWings(this, Math.max(0, perWing), true);
    }

    for (var i = 0; i < this.wings.length; i++) {
        this.wings[i].resetAngle();
    }
}

WingsManager.prototype.slowUpdate = function () {
    var active = Math.pow(2, this.depthLevel - 1);
    var cmax = 0;
    var max = 0;
    var index = -1;
    for (var i = 0; i < active; i++) {
        max = this.wings[i].maxWingSize();
        if (max > cmax) {
            cmax = max;
            index = i;
        }
    }
    this.longestWing = [cmax, index];
};

WingsManager.prototype.collisionWithFood = function () {
    var activeWingLen = Math.pow(2, this.depthLevel - 1);
    for (var i = 0; i < activeWingLen; i++) {

    }
};

WingsManager.prototype.splitGrowing = function (qt, activeWingLen) {
    var count = 0;
    var oldWingLen = activeWingLen;
    var changeInWingLen = 0;
    for (var i = 0; i < activeWingLen; i++) {
        count += this.wings[i].closeWing(qt, 1);
    }
    this.depthLevel++;
    activeWingLen = Math.pow(2, this.depthLevel - 1);
    changeInWingLen = activeWingLen - oldWingLen;
    var perWing = Math.floor(+count / (activeWingLen * 2));
    for (var i = 0; i < oldWingLen; i++) {
        this.wings[i].addBeadsToWings(this, Math.max(0, perWing), true);
    }
    for (var i = 0; i < changeInWingLen; i++) {
        this.wings.push(new Wing(this, this.wings.length, PL_RAD, ++this.wingId, this.pid, WING_ANG[Math.max(0, this.depthLevel - 1) + i], perWing));
    }
}

WingsManager.prototype.splitWings = function (qt) {
    var wingLen = this.wings.length;
    var activeWingLen = Math.pow(2, this.depthLevel - 1);
    if (this.depthLevel <= 0) {
        activeWingLen = 0;
    }
    if (activeWingLen >= MAX_WINGS || this.depthLevel >= MAX_WING_DEPTH) {
        console.log('you cannot split more 0:0');
        return;
    }
    // player combined wings sometime ago and has some spare wings..
    if (activeWingLen < this.wings.length) {
        return this.splitExistingWings(activeWingLen, qt);
    }

    // no wings at all , runs only 1 time
    if (activeWingLen === 0 && wingLen === 0) {

        this.depthLevel++;
        this.wings.push(new Wing(this, this.wings.length, PL_RAD, ++this.wingId, this.pid, WING_ANG[Math.max(0, this.depthLevel - 1)], BABY_WING_LEN_COUNT));
        return;
    }

    // check if player can split...
    for (var i = 0; i < activeWingLen; i++) {
        if (!this.wings[i].canSplit()) {
            return;
        }
    }
    // PLAYR CAN ACTUALLY SPLIT :)
    // double the active wings
    this.splitGrowing(qt, activeWingLen);

    for (var i = 0; i < this.wings.length; i++) {
        this.wings[i].resetAngle();
    }
    return;
};

WingsManager.prototype.updateNode = function (qt) {
    for (var i = 0; i < this.wings.length; i++) {
        this.wings[i].updateNode(qt);
    }
};

// OPTIMIZATION PENDING\\\\\\
WingsManager.prototype.getColl = function () {
    var ret = [];
    var activeWingLen = Math.pow(2, this.depthLevel - 1);
    for (var i = 0; i < activeWingLen; i++) {
        ret.push(this.wings[i].getColliders());
    }
    return ret;
};

WingsManager.prototype.update = function (dt, pos) {
    this.plx = pos[0];
    this.ply = pos[1];
    var total = 0;
    for (var i = 0; i < this.wings.length; i++) {
        total += this.wings[i].totalExtCount();
        if (this.wings[i].on) {
            this.wings[i].update(dt, this.plx, this.ply);
        }
    }
    this.allExtCount = total;
    this.angle = this.wings[0].angle;
};