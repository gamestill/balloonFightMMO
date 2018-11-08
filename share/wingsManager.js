var Conf = require('./gameConf.js');
var FMath = require('./fastmath.js');
var fMath = new FMath();
var P = require('./pixinc.js');
var InterP = require('./common/rInterp.js');
var MAX_WINGS = 0;
var WING_LEN_FOR_COOL_WINGS = 0;
var PL_RAD = Conf.PRADIUS;
var PLA_BEAD_RAD = 6;
var WingSkin = require('./wingskin.js');
var BABY_WING_LEN_COUNT = 0;
var LOG_2 = Math.log(2);
var Extension = function (tex, parent, powerTex) {
    if (!Extension.prototype.powerTex) {
        Extension.prototype.powerTex = powerTex;
        Extension.prototype.tex = tex;
    }
    this.sprite = null;
    this.counter = 0;
    this.power = false;
    this.lastPower = false;

    this.setupExt(tex, parent);
}

Extension.prototype.destroy = function () {
    this.sprite = null;
    this.counter = 0;
    this.power = false;
    this.lastPower = false;
}

Extension.prototype.setupExt = function (tex, parent) {
    this.sprite = new P.Sprite(tex);
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
    parent.addChild(this.sprite);
}

Extension.prototype.hideShow = function (hide) {
    this.sprite.visible = hide;
};

Extension.prototype.update = function (x, y, last) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.counter += 0.1;
    var sc = 0;
    if (this.power) {
        sc = (1 + fMath.cos(this.counter)) / 8;
        this.sprite.scale.set(0.8 + sc, 0.8 + sc);
    }
    if (this.lastPower !== this.power) {
        if (this.power) {
            this.sprite.texture = this.powerTex;
            this.sprite.tint = 0xff0000;
        } else {
            this.sprite.texture = this.tex;
            this.sprite.tint = 0xffffff;
        }
    }
    this.lastPower = this.power;
    this.power = last;
}

var ChildWing = function (wingNo, d, tex, pTex, stage, data) {
    this.d = d;
    this.wingNo = wingNo;
    this.active = true;
    this.pos = [0, 0];
    this.angle = 0;
    this.tex = tex;
    this.powerTex = pTex;
    this.id = 0;
    this.extension = [];
    this.sprite = null;
    this.setupWing(tex, stage, data);
};
ChildWing.prototype.setupWing = function (tex, stage, data) {
    var childs = +data;
    this.sprite = new P.Sprite(tex);
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
    stage.addChild(this.sprite);
    if (data && +data > 0) {
        this.addBeadsToWings(childs);
    }
}
ChildWing.prototype.addOneExtension = function () {

    this.extension.push(new Extension(this.tex, this.sprite, this.powerTex));
};
ChildWing.prototype.addBeadsToWings = function (count) {
    for (var i = 0; i < count; i++) {
        this.addOneExtension();
    }
};

ChildWing.prototype.update = function (ctime, xy, ang) {
    var last = false;
    var spr = this.sprite;
    var ang = (ang + 180) % 360;
    var a = (ang * (Math.PI / 180));
    var ca = fMath.cos(a);
    var sa = fMath.sin(a);
    spr.x = xy[0] + (this.d + PLA_BEAD_RAD) * ca;
    spr.y = xy[1] + (this.d + PLA_BEAD_RAD) * sa;
    for (var i = 0; i < this.extension.length; i++) {
        last = i >= (WING_LEN_FOR_COOL_WINGS - 1) && (i === this.extension.length - 1);
        this.extension[i].update(2 * (i + 1) * PLA_BEAD_RAD * ca, 2 * (i + 1) * PLA_BEAD_RAD * sa, last);
    }

};

ChildWing.prototype.destroyWing = function (stage) {
    while (this.sprite.children.length > 0) {
        this.sprite.removeChild(this.sprite.children[0]);
    }
    stage.removeChild(this.sprite);
    var len = this.extension.length;
    for (var i = 0; i < this.extension.length; i++) {
        this.extension[i].destroy();
    }
    this.extension = [];
    return len;
};


ChildWing.prototype.removeBeads = function (extC) {
    if (this.extension.length > extC) {
        for (var i = this.sprite.children.length - 1; i >= extC; i--) {
            this.sprite.removeChild(this.sprite.children[i]);
            this.extension.splice(i, 1);
        };
    }

};

var Wing = function (wingNo, d, tex, pTex, stage, data) {

    this.d = d;
    this.ip = new InterP();
    this.skin = new WingSkin();
    Wing.prototype.stage = stage;
    this.wingNo = wingNo;
    this.tex = tex;
    this.powerTex = pTex;
    this.childWing = null;
    this.visible = true;
    this.active = true;
    this.angle = 0;
    this.pos = [0, 0];
    this.angle = 0;
    this.id = 0;
    this.sprite = null;
    this.extension = [];
    this.setupWing(tex, stage, data);
};


Wing.prototype.destroyWing = function () {
    var len = this.extension.length;
    while (this.sprite.children.length > 0) {
        this.sprite.removeChild(this.sprite.children[0]);
    }
    this.ip = null;
    this.stage.removeChild(this.sprite);
    for (var i = 0; i < this.extension.length; i++) {
        this.extension[i].destroy();
    }
    this.extension = [];
    len += this.childWing.destroyWing(this.stage);
    return len;
};
Wing.prototype.setupWing = function (tex, stage, data) {

    this.ip.reset(0, 0, 0);
    var extCount = +data[1];
    var childExtCount = +data[2];
    this.sprite = new P.Sprite(tex);
    this.sprite.anchor.x = this.sprite.anchor.y = 0.5;
    stage.addChild(this.sprite);
    data && data.length > 0 && this.addBeadsToWings(extCount);
    this.childWing = new ChildWing(this.wingNo, this.d, this.tex, this.pTex, this.stage, childExtCount);
}

Wing.prototype.addOneExtension = function () {

    this.extension.push(new Extension(this.tex, this.sprite, this.powerTex));
};
Wing.prototype.addBeadsToWings = function (count, child) {
    for (var i = 0; i < count; i++) {
        this.addOneExtension();
    }
    if (child) {
        this.childWing.addBeadsToWings(count);
    }
};
Wing.prototype.updateData = function (sTime, now, data, sdt, gain) {
    this.angle = data[0];
    if (this.visible) {
        this.ip.addSample(sTime, now, data[0]);
    }

    var extDel = this.extension.length - data[1];
    var c_extDel = this.childWing.extension.length - data[2];
    //create new extensions
    if (extDel < 0) {
        this.addBeadsToWings(-extDel, false);
    }
    //remove some ext
    else if (extDel > 0) {
        this.removeBeadsBase(extDel);
    }
    if (c_extDel < 0) {
        this.childWing.addBeadsToWings(-c_extDel);
    }
    //remove some ext
    else if (c_extDel > 0) {
        this.childWing.removeBeads(c_extDel);
    }

    this.childWing.angle = (data[0] + 180) % 360;
};

Wing.prototype.update = function (ctime, xy) {
    if (!this.visible) {
        return;
    }
    var last = false,
    ang = this.ip.getAngle(ctime) % 360,
    a=0;
    this.angle = ang;
    this.childWing.update(ctime, xy, ang);
    a = (ang * (Math.PI / 180)),
    ca = fMath.cos(a),
    sa = fMath.sin(a);
    this.sprite.x = xy[0] + (this.d + PLA_BEAD_RAD) * ca;
    this.sprite.y = xy[1] + (this.d + PLA_BEAD_RAD) * sa;
    for (var i = 0; i < this.extension.length; i++) {
        last = i >= (WING_LEN_FOR_COOL_WINGS - 1) && (i === this.extension.length - 1);
        this.extension[i].update(2 * (i + 1) * PLA_BEAD_RAD * ca, 2 * (i + 1) * PLA_BEAD_RAD * sa, last);
    }
};

Wing.prototype.removeBeadsBase = function (extM) {
    if (this.extension.length > extM) {
        for (var i = this.sprite.children.length - 1; i >= extM; i--) {
            this.sprite.removeChild(this.sprite.children[i]);
            this.extension.splice(i, 1);
        };
    }
};

Wing.prototype.removeBeads = function (extM, extC) {
    this.removeBeadsBase(extM);
    this.childWing.removeBeads(extC);
};

Wing.prototype.hideShow = function (hide) {
    this.visible = hide;
    for (var i = 0; i < this.extension.length; i++) {
        this.extension[i].hideShow(hide);
    }
    for (var i = 0; i < this.childWing.extension.length; i++) {
        this.childWing.extension[i].hideShow(hide);
    }
    this.sprite.visible = hide;
    this.childWing.sprite.visible = hide;
};

var WingsManager = function (pid, stage, self, data) {
    if (!WingsManager.prototype.wingIndex) {
        WING_LEN_FOR_COOL_WINGS = Conf.WING_LEN_FOR_COOL_WINGS;
        MAX_WINGS = Conf.MAX_WINGS;
        BABY_WING_LEN_COUNT = Conf.BABY_WING_LEN_COUNT;
        WingsManager.prototype.wingIndex = 0;
    }
    this.xy = new Array(2);
    this.me = self;
    this.lastFlag = 0;
    this.totalWings = MAX_WINGS;
    this.pid = pid;
    this.angle = 0;
    this.wings = [];
    this.stage = stage;
    this.pTex = null;
    this.wingBeadTex = null;
    this.init = function (data) {
        var gra = new P.Graphics();
        gra.beginFill(0xffffff, 1);
        gra.drawCircle(0, 0, PLA_BEAD_RAD);
        gra.endFill();
        this.wingBeadTex = gra.generateCanvasTexture();
        var pGra = new P.Graphics();
        pGra.beginFill(0xffffff, 1);
        pGra.drawCircle(0, 0, 2 + PLA_BEAD_RAD +3);
        pGra.endFill();
        this.pTex = pGra.generateCanvasTexture();

        if (data) {
            this.initServer(data);
        }

    };
    this.init(data);
};

module.exports = WingsManager;
WingsManager.prototype.initServer = function (data) {

}
WingsManager.prototype.disconnect = function(rend){
   var spr = null;
   var cSpr = null;
    for (var i = 0; i < this.wings.length; i++) {
      spr = this.wings[i].sprite;
      cSpr = this.wings[i].childWing.sprite;
      rend.clearContainer(spr);
      rend.clearContainer(cSpr);
    }
};
WingsManager.prototype.reset = function(){
this.xy = [];
this.wings  = [];
};

WingsManager.prototype.getWingsCount = function () {
    return this.wings.length;
};

WingsManager.prototype.createNewWing = function (wingNo, data) {;
    this.wings.push(new Wing(wingNo, PL_RAD, this.wingBeadTex, this.pTex, this.stage, data));
};
WingsManager.prototype.damageToWing = function (i, isChild, extIndex) {
    if (!this.wings[i]) {
        return;
    }
    this.wings[i].active && this.wing[i].damageToExt(isChild, extIndex);
};

WingsManager.prototype.splitWing = function (wingNo, data, ind, servWingCount, currMaxWingNo) {
    for (var i = 0; i < currMaxWingNo; i++) {
        this.wings[i] && this.wings[i].removeBeads(data[i][1], data[i][2]);
    }
    while (this.wings.length < servWingCount) {
        this.createNewWing(wingNo, data[currMaxWingNo + ind]);
    }
};

WingsManager.prototype.mergeWings_work = function (data, wingsLen) {
    var wing = null,
        gotNewBeads = 0,
        halfLen = 0,
        index = 0,
        perWing = 0;
    halfLen = Math.floor(wingsLen / 2);
    while (this.wings.length > halfLen) {
        index = this.wings.length - 1;
        gotNewBeads += this.wings[index].destroyWing();
        this.wings.splice(index, 1);
    }
    perWing = Math.floor(gotNewBeads / halfLen);
    for (var i = 0; i < halfLen; i++) {
        wing = this.wings[i];
        wing.removeBeads(0, 0);
        wing.addBeadsToWings(perWing, true);
    }
}

WingsManager.prototype.mergeWings_main = function (data) {
    while (this.wings.length > data.length) {
        this.mergeWings_work(data, this.wings.length);
    }
};

WingsManager.prototype.hideShow = function (hide) {
    for (var i = 0; i < this.wings.length; i++) {
        this.wings[i].hideShow(hide);
    }
};

// mywingdepth refers to the depth level of the wings like 3 for 4 wings
// 4 for 8 wings
WingsManager.prototype.updateFlag = function (flag, data) {
    var _servW_active_bits_set = data.length,
        _servW_active_depth = ((Math.log(_servW_active_bits_set)) / LOG_2) + 1,
        myWingsDepth = 0,
        deltaDepth = 0,
        startWingNo = 0;
    if (this.wings.length > 0) {
        myWingsDepth = ((Math.log(this.wings.length)) / LOG_2) + 1;
    }
    deltaDepth = _servW_active_depth - myWingsDepth;
    // server contains more wings than the child
    if (deltaDepth > 0) {
        if (myWingsDepth > 0) {
            startWingNo = Math.pow(2, Math.max(0, myWingsDepth - 1));
        }
        for (var i = 0; i < deltaDepth; i++) {
            this.splitWing(this.wings.length, data, i, _servW_active_bits_set, startWingNo);
        }
    }
    if (_servW_active_bits_set < this.wings.length) {
        this.mergeWings_main(data);
    }
}

WingsManager.prototype.updateData = function (sTime, now, data, sdt) {
    for (var i = 0; i < data.length; i++) {
        this.wings[i] && this.wings[i].updateData(sTime, now, data[i], sdt);
    }
};

WingsManager.prototype.update = function (currentTime, pos) {
    if (this.wings.length <= 0) {
        return;
    }
    this.xy = pos;
    for (var i = 0; i < this.wings.length; i++) {
        this.wings[i].update(currentTime, this.xy);
    }
    this.angle = this.wings[0].angle;
    return this.angle;
};