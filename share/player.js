var Conf = require('./gameConf.js');
var COUNT_INC = 0.1;
var keys = require('./keyboard.js');
var util = require('util');
var Conf = require('./gameConf.js');
var FMATH = require('./fastmath.js');
var fMath = new FMATH();
var Bullet = require('./Bullet.js');
var waterHeight = Conf.WaterHeight;

var P = require('./pixinc.js');
var InterP = require('./common/Interp.js');
var RInterP = require('./common/rInterp.js');
var Faces = require('./Faces.js');
var MAX_SNAPSHOTS = Conf.MAX_SNAPSHOTS;
var MAX_LENGTH_TAG = 37;
var nameStroke = 2;
var nameSize = 16;
var baseScaleCircle = 0.4;

var BASE_INC_RATE = 0.1;
var HIGH_INC_RATE = 0.2;

function map(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var Player = function (faceName, app, name, skcolor, shortId, weaponColor, tween, color_hex, keyboard, renderer, self, edata) {
    // new
    this.debugShown = false;
    this.handTween = null;
    this.rope = null;
    this.upArrow = false;
    this.lastChatTime = 0;
    this.secSkin = null;
    this.camDisable = false;
    this.splashed = false;
    this.popped = false;
    this.hand = null;
    this.chatSpr = null;
    this.bullets = {};
    this.appTime = 0;
    this.deadSpec = false;
    this.mode = 1;
    this.dir = 1;
    this.increment = 0;
    Player.prototype.ws = Conf.worldSize;
    Player.prototype.app = app;
    Player.prototype.playerStage = this.app.getRenderer().getPlayerStage();
    this.ip = new InterP(shortId);
    this.rIp = new RInterP(shortId);
    this.id = shortId;
    this.happyFacesSaved = 0;
    this.screenRegion = [];
    this.mainScale = 0;
    this.currBlock = 0;
    this.incrementRate = BASE_INC_RATE;
    this.isSpectator = false;
    this.spectatorId = null;
    // new
    this.TW = tween;
    this.renderer = renderer;
    this.activeTags = ["We are Friends", "You are dead", "Try Killing me"];
    this.color = "";
    this.ang = 0;
    this.sPos = [0, 0];
    this.disc = false;
    this.charHeight = 20;
    this.happyTex = null;
    this.mainSkin = null;
    this.position = {
        x: 0,
        y: 0
    };
    this.initialized = false;
    this.angArr = [];
    this.aAng = 0;
    this.keyboard = keyboard;
    this.name = name || Conf.DEFAULT_NAME;
    this.weight = 1;
    this.skcolor = skcolor || '#ff000';
    this.visible = true;
    this.myFace = faceName;
    this.defaultSkin = false;
    this.totalTime = 0;
    this.packetNo = 0;
    this.cb = '';
    this.myAng = 0;
    this.syncOn = false;
    this.self = self;
    this.ghostTween = null;
    this.currWeight = 1;
    this.defaultSkin = null;
    this.getTW = function () {
        return this.TW;
    }
    this.setupGraphic();
    this.updateGraphic = Player.prototype.updateGraphicPlayer;
    this.update = Player.prototype.updatePlayer;
    Player.prototype.counting = 0;
    this.hidePl();
};
module.exports = Player;
Player.prototype.reset = function () {
    this.graphic = [];
    this.ip = null;
};
Player.prototype.getColor = function () {
    return this.color;
};

Player.prototype.removeChat = function (tt) {
    var self = this;
    if (!self.chatSpr) {
        return;
    }

    new this.TW.Tween({
            y: 1,
            z: 1
        })
        .to({
            y: 0,
            z: 0.5
        }, 400)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function () {
            if (self.chatSpr) {
                self.chatSpr.alpha = this.y;
                self.chatSpr.scale.set(this.z, this.z);
            }
        })
        .onComplete(function () {
            self.removeChatMsg();
        })
        .start(tt);

};
Player.prototype.removeChatMsg = function () {
    var child = null;
    var len = 0;
    var g = this.graphic[2];

    if (this.chatSpr && g) {
        len = this.chatSpr.children.length;
        while (this.chatSpr.children.length > 0) {
            child = this.chatSpr.getChildAt(0);
            this.chatSpr.removeChild(child);
        }
        g.removeChild(this.chatSpr);
        this.chatSpr = null;
    }
};

Player.prototype.showChat = function (tt, msg, key) {
    var self = this;
    var g = this.graphic[2];
    if (!g) {
        return;
    }
    var child = null;
    var len = 0;
    if (this.chatSpr) {
        len = this.chatSpr.children.length;
        while (this.chatSpr.children.length > 0) {
            child = this.chatSpr.getChildAt(0);
            this.chatSpr.removeChild(child);
        }
        g.removeChild(this.chatSpr);
        this.chatSpr = null;
    }
    this.noChatPending = false;
    var len = ('' + msg).length;
    var rows = 1 + Math.min(3, Math.max(0, Math.floor(len / 16)));
    var text = new PIXI.Text("" + msg, {
        fontFamily: 'Do Hyeon',
        fill: 0xffffff,
        fontSize: 20,
        wordWrap: true,
        wordWrapWidth: 120
    });
    text.anchor.x = 0.5;
    text.anchor.y = 0;
    text.position.x = 0;

    var chatFrame = new P.Graphics();
    chatFrame.beginFill(0x111111, 0.6);
    chatFrame.drawRoundedRect(0, 0, 180, 3 + rows * 24, 10);
    chatFrame.endFill();
    var chatSpr = new P.Sprite(chatFrame.generateCanvasTexture());
    chatSpr.anchor.x = 0.5;
    chatSpr.anchor.y = 1;
    g.addChild(chatSpr);
    chatSpr.addChild(text);
    this.chatSpr = chatSpr;
    if (this.graphic[0]);
    this.chatSpr.position.x = 0;
    var toPos = -this.graphic[0].height * 2
    var fromPos = -this.graphic[0].height * 2 - 30;
    text.position.y = 3 - chatSpr.height;
    new this.TW.Tween({
            x: fromPos,
            y: 0,
            z: 1.2
        })
        .to({
            x: toPos,
            y: 1,
            z: 1
        }, 400)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function () {
            if (self.chatSpr) {
                self.chatSpr.position.y = this.x;
                self.chatSpr.alpha = this.y;
                self.chatSpr.scale.set(this.z, this.z);
            }
        })
        .start(tt);

    this.lastChatTime = tt;
};

Player.prototype.disconnect = function () {
    this.disc = true;
    var spr = null;
    for (var i = 0; i < this.graphic.length; i++) {
        spr = this.graphic[i];
        this.renderer.clearContainer(spr);
    }
    this.graphic = null;
    if (this.handTween) {
        this.handTween.stop();
        this.handTween = null;
    }
    this.setEmptyFn();
};

Player.prototype.setEmptyFn = function () {
    this.pushSnapshots = function () {};
    this.updateCommon = function () {};
    this.updateGraphicPlayer = function () {};
    this.updatePlayer = function () {};
    this.updateCommon = function () {};
}
Player.prototype.balloonReady = function (self) {
    if (self.mainSkin) {
        self.mainSkin.visible = true;
        self.mainSkin.scale.set(baseScaleCircle, baseScaleCircle);
    }
    if (self.secSkin) {
        self.secSkin.visible = false;
        self.secSkin = null;
    }
};

// Player.prototype.setHeathBar = function () {
//     var rect = new P.Graphics();
//     rect.beginFill(0xffffff, 0);
//     rect.lineStyle(2, 0xffffff, 1);
//     rect.drawRect(0, 0, 40, 5);
//     rect.endFill();
//     var rectF = new P.Graphics();
//     rectF.beginFill(0xffffff, 1);
//     rectF.drawRect(0, 0, 40, 5);
//     rectF.endFill();
//     var texFill = rectF.generateCanvasTexture();
//     var texFrame = rect.generateCanvasTexture();
//     this.spriteFrame = new P.Sprite(texFrame);
//     this.spriteFill = new P.Sprite(texFill);
//     this.spriteFrame.anchor.x = 0;
//     this.spriteFrame.anchor.y = 1;
//     this.spriteFill.anchor.x = 0;
//     this.spriteFill.anchor.y = 1;
//     this.spriteFrame.addChild(this.spriteFill);
//     this.spriteFrame.tint = 0x444444;
//     this.spriteFrame.alpha = 1;
//     this.spriteFill.alpha = 0.8;
//     this.spriteFill.position.x = 2;
//     this.spriteFill.tint = 0x00ff00;
// }

Player.prototype.setupGraphic = function () {
    var self = this;
    var url_high = null;
    var randomClrLen = Conf.SKINCHILD_CLRS.length;
    var r_color = fMath.getRandom(0, randomClrLen);
    var pCircleTex = P.Resources[Conf.FILES[Conf.FILESI['cz']]].texture;
    var pHelmentTex = P.Resources[Conf.FILES[Conf.FILESI['hm']]].texture;
    var phandTex = P.Resources[Conf.FILES[Conf.FILESI['ph']]].texture;
    var names = Conf.SKINS_DATA;
    var skinname = (this.myFace) || null;
    var clrs = [0xff0000, 0xffff00, 0x0000ff, 0x00ffff, 0xff00ff, 0xaa5588];
    var len = Math.max(0, clrs.length - 1);
    var rand = Math.floor(Math.random() * len);
    var _skinTex = null;
    var defaultBalloonTex = P.Resources[Conf.FILES[Conf.FILESI['br']]].texture;

    var ropeTex = new P.Graphics();
    ropeTex.beginFill(0xffffff, 0.6);
    ropeTex.drawRect(0, 0, 3, 25);
    ropeTex.endFill();
    var weaponT = null;
    var rope = new P.Sprite(ropeTex.generateCanvasTexture());
    var weaponC = new P.Sprite(defaultBalloonTex);
    this.secSkin = weaponC;
    if (skinname) {
        url_high = 'http://' + 'kark.io/skins/' + skinname + '.png';
        this.mainSkin = weaponT = new PIXI.Sprite.fromImage(url_high);
        this.mainSkin.visible = false;
        if (!this.mainSkin.texture.baseTexture.hasLoaded) {
            this.mainSkin.texture.baseTexture.on('loaded', this.balloonReady.bind(this, self));
        } else {
            this.balloonReady(self);
        }
        //  weaponC.visible = false;
    } else {
        this.mainSkin = weaponT = new P.Sprite(defaultBalloonTex);
        this.mainSkin.visible = true;
        weaponC.visible = false;
    }
    rope.anchor.x = 0.5;
    rope.anchor.y = 1;
    rope.position.x = 0;
    this.rope = rope;
    var keysLen_color = Object.keys(Conf.FOOD_TINT).length;
    var pcolor = Conf.FOOD_TINT['' + Math.floor(Math.random() * keysLen_color)];
    var tauntTextMsg = " ";
    var pclr = Conf.PNAME_CLRS[Math.floor(Math.random() * 4)];
    var pCircleMain = new P.Sprite(pCircleTex);
    var pHelmentSpr = new P.Sprite(pHelmentTex);
    var pHandMain = new P.Sprite(phandTex);
  //  this.setHeathBar();
    this.skcolor = this.skcolor.replace(/#/g, "0x");

    var pScore = new PIXI.Text("221", {
        stroke: 0x444444,
        strokeThickness: nameStroke,
        fontFamily: 'Do Hyeon',
        fill: 0xffffaa,
        fontSize: 16
    });
    var pname = new PIXI.Text("" + this.name, {
        stroke: 0x111111,
        strokeThickness: nameSize / 4,
        fontFamily: 'Do Hyeon',
        fill: 0xffffff,
        fontSize: nameSize
    });
    if (window.store.get('s_name') == 1) {
        //    pname.visible = false;
    }
    weaponC.scale.set(baseScaleCircle, baseScaleCircle);
    weaponT.scale.set(baseScaleCircle, baseScaleCircle);

    weaponC.anchor.y = 1;
    weaponC.anchor.x = 0.5;
    weaponC.position.x = 0;
    pHandMain.position.y = 28;
    pHandMain.position.x = -5;
    pHandMain.anchor.x = 1;
    pHandMain.anchor.y = 1;
    weaponC.position.y = -7;
    weaponC.alpha = 1;
    pHelmentSpr.tint = this.skcolor;
    weaponT.anchor.y = 1;
    weaponT.anchor.x = 0.5;
    weaponT.position.x = 0;
    weaponT.position.y = -7;
    weaponT.alpha = 1;
    pCircleMain.alpha = 1;
    this.charHeight = pCircleMain.height;
    pHelmentSpr.alpha = 1;
    pHandMain.alpha = 1;
    this.hand = pHandMain;
    pScore.anchor.x = pname.anchor.x = pCircleMain.anchor.x = Conf.ZERO_5;
    pScore.anchor.y = pname.anchor.y = Conf.ZERO_5;
    pCircleMain.anchor.y = 0;
    pHelmentSpr.anchor.y = 0;
    pHelmentSpr.anchor.x = 0.5;
    pname.alpha = 0.8;
    pHelmentSpr.position.x = 2;
    pHelmentSpr.position.y = 2;

    pScore.alpha = 1;

    pname.position.x = 0;
    pname.position.y = this.mainSkin.position.y - (pCircleMain.height * 2);

    pScore.scale.x = pScore.scale.y = pname.scale.x = pname.scale.y = 1;
    rope.position.y = 0;
    pname.interactive = false;
    pScore.interactive = false;
    weaponC.interactive = false;
    weaponT.interactive = false;
    this.playerStage.addChild(pCircleMain, pname, pScore);
   
    pCircleMain.addChild(rope);
    pCircleMain.addChild(weaponC);
    pCircleMain.addChild(this.mainSkin);
    pCircleMain.addChild(pHelmentSpr);
    pCircleMain.addChild(pHandMain);
    var pr = [pCircleMain, pname, pScore];
    this.graphic = pr;
    this.showPl();
}
Player.prototype.hideShow = function (hide) {
    for (var i = 0; i < this.graphic.length; i++) {
        this.graphic[i].visible = hide;
    }
};

Player.prototype.setTimeAlive = function (time) {
    this.totalTime = time;
};
Player.prototype.initOther = function () {
    var tt = this.app.appTime;
    var self = this;
    new this.TW.Tween({
            y: 0.2
        })
        .to({
            y: 1
        }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .yoyo(true)
        .repeat(15)
        .onUpdate(function () {
            if (self.graphic) {
                self.graphic[0].alpha = this.y;
                self.graphic[1].alpha = this.y;
                self.graphic[2].alpha = this.y;
                self.rope && (self.rope.alpha = this.y);

            }
        })
        .onComplete(function () {
            if (self.graphic) {
                self.graphic[0].alpha = 1;
                self.graphic[1].alpha = 1;
                self.graphic[2].alpha = 1;
                self.rope && (self.rope.alpha = 1);
            }
        })
        .start(tt);
}
Player.prototype.initPlayer = function (ct, ptime, x, y) {
    this.initialized = true;
    this.position.x = x;
    this.position.y = y;
    this.ip.reset(0, 0, this.position);
    var tt = this.app.appTime;
    var self = this;
    new this.TW.Tween({
            y: 0.2
        })
        .to({
            y: 1
        }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .yoyo(true)
        .repeat(15)
        .onUpdate(function () {
            if (self.graphic) {
                self.graphic[0].alpha = this.y;
                self.graphic[1].alpha = this.y;
                self.graphic[2].alpha = this.y;
                self.rope && (self.rope.alpha = this.y);

            }
        })
        .onComplete(function () {
            if (self.graphic) {
                self.graphic[0].alpha = 1;
                self.graphic[1].alpha = 1;
                self.graphic[2].alpha = 1;
                self.rope && (self.rope.alpha = 1);
            }
        })
        .start(tt);
};

Player.prototype.updateCommon = function (time, dt) {
    this.counting += this.incrementRate;
    this.increment++;
    var gg = this.graphic;
    if(!gg[0].visible && !this.popped){
        gg[0].vislble = true;
        gg[1].vislble = true;
        gg[2].vislble = true;
    }

    gg[1].x = gg[2].x = gg[0].x = this.position.x;
    gg[0].y = this.position.y;
    gg[2].y = gg[0].y + gg[0].height + gg[2].height / 2 + 5;
    gg[1].y = gg[0].y - gg[0].height / 2 - 50;
 
    var new_scale_x =  baseScaleCircle + baseScaleCircle * 0.05 * Math.cos(this.counting);
    var new_scale_y = baseScaleCircle + baseScaleCircle * 0.05 * Math.sin(this.counting);
    this.mainSkin.scale.set(new_scale_x, new_scale_y);
    if (this.increment % 193 === 0) {
        if (this.incrementRate < 0.15) {
            this.incrementRate = BASE_INC_RATE - BASE_INC_RATE * 0.2 + Math.random() * BASE_INC_RATE * 0.4;
          }
    }

    if (this.upArrow && !this.handTween) {
        this.handAni();
        if (this.self) {
            this.app.playSoundFly();
        }

    } else if (!this.upArrow) {
        this.mainSkin.position.x = 0;
        this.mainSkin.position.y = -7;
        this.graphic[0].scale.set(this.dir, 1);
    }
};

Player.prototype.handAni = function () {
    var tt = this.app.appTime;
    var self = this;
    var k = -5;
    this.handTween = new this.TW.Tween({
            y: -Math.PI / 6,
            x: 0.98,
            z: 1,
            w: -1
        })
        .to({
            y: Math.PI / 6,
            x: 1.02,
            z: 0.9,
            w: 1
        }, 250)
        .easing(TWEEN.Easing.Quadratic.Out)
        .yoyo(true)
        .repeat(1)
        .onUpdate(function () {
            self.mainSkin.position.x = this.w;
            self.mainSkin.position.y = k;
            self.hand.rotation = this.y;
            self.hand.scale.set(this.z, this.z);
            self.graphic[0].scale.set(this.x * self.dir, this.x);
        })
        .onComplete(function () {
            self.handTween = null;
            self.hand.rotation = -Math.PI / 6;
        })
        .start(tt);
}

Player.prototype.updateGraphicPlayer = function (time, dt) {

    this.updateCommon(time, dt);
};

Player.prototype.leftC = function () {

}
Player.prototype.leftUp = function () {}
Player.prototype.rightC = function () {
}
Player.prototype.rightUp = function () {}
Player.prototype.lc = function () {
    this.incrementRate = HIGH_INC_RATE;
};
Player.prototype.lc_up = function () {
    this.incrementRate = BASE_INC_RATE;
};

Player.prototype.updatePlayer = function (currentTime, dt) {
    var ret = this.ip.getPosition(currentTime, this.id);
    var bullToRem = [];
    if (ret) {
        this.position.x = ret[0];
        this.position.y = ret[1];
    }
    var keys = Object.keys(this.bullets);
    for (var i = 0; i < keys.length; i++) {
        if (!this.bullets[keys[i]].update(this.worldSize, dt)) {
            bullToRem.push(keys[i]);
        }
    }
    if (bullToRem.length > 0) {
        this.removeBullets(bullToRem);
    }

    if (this.position.y > (this.ws - waterHeight) && !this.splashed) {
        this.popped = true;
        this.splashed = true;
        this.app.splash(2, this.position.x, this.position.y);
    }

};

Player.prototype.getGraphic = function () {
    return this.graphic[0];
};
Player.prototype.showPl = function () {
    if (this.graphic[0].visible) {
        return;
    }
    this.hideShow(true);
};


Player.prototype.hidePl = function () {
    this.ip.phide();
    if (!this.graphic[0].visible) {
        return;
    }
    this.hideShow(false);
};
Player.prototype.setBlock = function (block) {
    this.currBlock = block;
}

Player.prototype.removeBullets = function (ids) {
    for (var i = 0; i < ids.length; i++) {
        if (this.bullets['' + ids[i]]) {
            this.bullets['' + ids[i]].remove(this.playerStage);
            delete this.bullets['' + ids[i]];
        }
    }

};

Player.prototype.createBullets = function (bull) {
    for (var i = 0; i < bull.length; i++) {
        this.bullets['' + bull[i]] = new Bullet([this.position.x, this.position.y - this.charHeight*1.5 ], this.playerStage);
    }
    if (this.self) {
        this.app.shakeCam(40, 5);
    }
};
Player.prototype.respawn = function(){
    this.popped = false;
    this.camDisable = false;
    this.deadSpec = false;
    this.mainSkin.visible = true;
    if (this.secSkin) {
        this.secSkin.visible = true;
    }
    this.rope.visible = true;
    this.graphic[1].visible = true;
    this.graphic[2].visible = true;
    this.graphic[0].visible = true;
    this.graphic[0].alpha = 1;
    this.graphic[0].scale.set(1,1);
};

Player.prototype.pushSnapshots = function (appTime, sTime, now, childData, px, py, speedPower, pops, data_ent,
    data_ex, newbl, sdt, chatMsg, killedName, leftArr, rightArr, popped, upArrowOn, upArrowOff, bullets, bulletsR) {
    var _sc = 0;
    this.appTime = appTime;

    if (popped) {
        this.popped = true;
        this.mainSkin.visible = false;
        if (this.secSkin) {
            this.secSkin.visible = false;
        }
        this.rope.visible = false;
        this.graphic[1].visible = false;
        this.graphic[2].visible = false;
        this.graphic[0].alpha = 0.7;
        this.graphic[0].scale.set(0.8, 0.8);
    }

    if (bullets.length > 0) {
        this.createBullets(bullets);
        this.app.playSoundBulletFire();
    }

    if (bulletsR.length > 0) {
        this.removeBullets(bulletsR);
    }

    if (leftArr) {
        this.dir = -1;
        this.graphic[0].scale.x = -1;
    }
    if (rightArr) {
        this.dir = 1;
        this.graphic[0].scale.x = 1;
    }
    if (upArrowOn) {
        this.upArrow = true;
    }
    if (upArrowOff) {
        this.upArrow = false;
    }

    if (killedName) {
        this.renderer.killUpdate(this.id, this.name, killedName);
    }
    if ((appTime - this.lastChatTime) > 5000 && this.chatSpr && !this.noChatPending) {
        this.removeChat(appTime);
        this.noChatPending = true;
    }
    if (chatMsg) {
        this.showChat(appTime, chatMsg);
    }
    if (data_ent.length > 0) {
        for (var i = 0; i < data_ent.length; i++) {
            if (this.screenRegion.indexOf(data_ent[i]) < 0) {
                this.screenRegion.push(data_ent[i]);
            }
        }
    }
    if (data_ex.length > 0) {
        for (var i = 0; i < data_ex.length; i++) {
            if (this.screenRegion.indexOf(data_ex[i]) >= 0) {
                this.screenRegion.splice(i, 1);
            }
        }
    }
    this.graphic[2].text = pops;
    this.pops = pops;
    newbl >= 0 && this.setBlock(newbl);
    this.sPos = [px, py];
    this.ip.addSample(sTime, now, px, py);
 
};