var P = require('./pixinc.js');
var Conf = require('./gameConf.js');
var FastMath = require('./fastmath.js');

var BW = require('./common/BinaryWriter.js');
var BR = require('./common/BinaryReader.js');
var fMath = new FastMath();
var BASE_SCALE_HIGH = 1;
var BASE_SCALE_MED = 1;
var BASE_SCALE_LOW = 1;

var Food = function (TEX, state, val, tex, stage, t, x, y, id, vis, app) {
    this.scaleSpeedFactor = Math.random() * 0.15;
    this.scalar = 0;
    this.factor = 0.01 + Math.random() * 0.04;
    this.foodFac = 0.05 + Math.random() * 0.1;
    this.id = id;
    this.baseScale = BASE_SCALE_LOW;
    this.state = state;
    this.c = 0;
    this.a = app;
    this.value = val;
    this.spr = new P.Sprite(tex);
    this.spr.position.x = x
    this.spr.position.y = y;
    this.spr.anchor.x = this.spr.anchor.y = 0.5;
    this.spr.visible = vis;
    this.spr.scale.x = this.spr.scale.y = 0.85 + Math.random() * 0.3;
    this.spr.tint = Conf.FOOD_TINT['' + t];
    stage.addChild(this.spr);
    if (app) {
        this.spr.texture = TEX['5'];
        this.baseScale = BASE_SCALE_MED;
        var $this = this;
        var TW = app.getTW();
        var tt = app.getAppTime();
        new TW.Tween({
                x: 0,
                y: 0
            })
            .to({
                x: 1,
                y: $this.baseScale
            }, 300)
            .easing(TW.Easing.Linear.None)
            .onUpdate(function () {
                $this.spr.scale.x = $this.spr.scale.y = this.y;
                $this.spr.alpha = this.x;
            })
            .onComplete(function () {
                $this.spr.alpha = 1;
                $this.spr.scale.x = $this.spr.scale.y = $this.baseScale;
            })
            .start(tt);
    }
};

Food.prototype.set = function (data, id, tex) {
    this.spr.position.x = data[0];
    this.spr.position.y = data[1];
    this.value = data[2];
    this.state = data[3];
    this.spr.visible = true;
    this.id = id;

   if (this.value > 1) {
        this.baseScale = BASE_SCALE_MED;
        this.spr.texture = tex;
    }

    this.spr.scale.set(this.baseScale, this.baseScale);
    
};

Food.prototype.justRemove = function (TW, appTime, cont) {
    var $this = this;
    new TW.Tween({
            x: 1,
            y: 1
        })
        .to({
            x: 0,
            y: 0.5

        }, 250)

        .easing(TWEEN.Easing.Sinusoidal.Out)
        .onUpdate(function () {
            $this.spr.scale.set(this.y, this.y);
            $this.spr.alpha = this.x;
        })
        .onComplete(function () {
            $this.id = -1;
            $this.spr.visible = false;
            $this.spr.rotation = 0;
            $this.spr.scale.set(1, 1);
            cont.removeChild($this.spr);
        })
        .start(appTime);
}
Food.prototype.eat = function (TW, appTime, cont, pl) {
    var $this = this;
    var spr = this.spr;
    if (!pl) {

        this.justRemove(TW, appTime, cont);
        return;
    }
    var app = pl.app;
    var vis = pl.graphic[0].visible;
    if (!vis) {
        this.id = -1;
        this.spr.visible = false;
        cont.removeChild(this.spr);
        return;
    }

    spr.scale.set(this.baseScale * 1.5, this.baseScale * 1.5);
    new TW.Tween({
            x: this.spr.position.x,
            y: this.spr.position.y
        })
        .to({
            x: pl.position.x,
            y: pl.position.y

        }, 450)

        .easing(TWEEN.Easing.Sinusoidal.Out)
        .onUpdate(function (cb) {
            cb({
                x: pl.position.x,
                y: pl.position.y
            });
            if((spr.position.x - this.x)>1000 || (spr.position.x - this.x)<-1000){

            }else{
                spr.position.x = this.x;
                spr.position.y = this.y;
                spr.rotation += 0.2;    
            }
        })
        .onComplete(function () {
            $this.id = -1;
            spr.visible = false;
            spr.rotation = 0;
            spr.scale.set(1, 1);
            cont.removeChild($this.spr);
        })
        .start(appTime);
};

Food.prototype.updateAni_high = function (a, b) {

    this.c += this.factor;
    this.scalar += this.scaleSpeedFactor;
    var sc = this.baseScale * 0.75 + this.baseScale * (1 + fMath.sin(this.scalar)) / 7;
    this.spr.scale.set(sc, sc);
    this.spr.x += fMath.cos(this.c) * this.foodFac;
    this.spr.y += fMath.sin(this.c) * this.foodFac;
};

Food.prototype.updateAni_medium = function (a, b) {
    this.c += this.factor;
    this.spr.x += fMath.cos(this.c) * this.foodFac;
    this.spr.y += fMath.sin(this.c) * this.foodFac;
};
Food.prototype.updateAni_low = function (a, b) {
    this.scalar += this.scaleSpeedFactor;
    var sc = this.baseScale * 0.75 + this.baseScale * (1 + fMath.sin(this.scalar)) / 7;
    this.spr.scale.set(sc, sc);
};



var GameFood = function (count, stage, layer, containerCount, app) {
    this.food = [];
    this.noOfContainers = Conf.SERVER_BLOCKS_COUNT * Conf.SERVER_BLOCKS_COUNT;
    this.app = app;
    this.errorEatBoxRec = [];
    this.cont = [];
    this.foodIdsInUse = {};
    this.layer = layer;
    this.TEX = {};

    this.expandFoodContainer = function (bno, by) {
        var r = 0;
        var t = 0;
        var max = 4;
        var min = 1;
        var maxt = 10;
        var mint = 0;
        var ff = Math.floor;
        var rr = Math.random;
        var tex = null;
        var cont = this.cont[bno];
        for (var j = 0; j < by; j++) {
            r = ff(rr() * (max - min + 1)) + min;
            t = ff(rr() * (maxt - mint + 1)) + mint;
            tex = this.TEX['' + r];
            this.food[bno].push(new Food(this.TEX, 1, 1, tex, cont, t, 999999, 999999, 0, false, false));
        }
    };

    this.setLowTex = function () {
        this.TEX = {};
        var btn = new P.Graphics();
        btn.beginFill(0xffffff, 1);
        btn.drawCircle(0, 0, Conf.LOW_FOOD_RAD);
        btn.endFill();
        var tex = btn.generateCanvasTexture();
        for (var i = 1; i < 7; i++) {
            delete this.TEX['' + i];
            this.TEX['' + i] = tex;
        }
    };
    this.setOkTex = function () {
        this.TEX = {};
        for (var i = 1; i < 7; i++) {
            delete this.TEX['' + i];
            this.TEX['' + i] = P.Resources[Conf.FILES[Conf.FILESI['d' + i]]].texture;
        }
    };

    this.updateTex = function () {
        var quality = window.kgraphic || 'high';
        if (quality === 'low' || quality === 'ugly') {
            this.setLowTex();
        } else if (quality === 'high' || quality === 'medium') {
            this.setOkTex();
        }
    };
    this.reset = function () {
        var arr = [];
        for (var i = 0; i < this.noOfContainers; i++) {
            arr.push(i);
        }
        this.dataPop(arr);
        this.foodIdsInUse = {};
    };
    this.init = function (stage, layer, count) {
        var r = 0;
        var t = 0;
        var max = 4;
        var min = 1;
        var maxt = 10;
        var mint = 0;
        var ff = Math.floor;
        var rr = Math.random;
        var tex = null;
        this.updateTex();
        for (var i = 0; i < this.noOfContainers; i++) {
            this.cont.push(new P.Container());
            this.food.push([]);
            this.cont[i].visible = false;
            this.cont[i].pivot.x = this.cont[i].pivot.y = 0.5;
            this.cont[i].displayGroup = layer;
            stage.addChild(this.cont[i]);
            for (var j = 0; j < count; j++) {
                r = ff(rr() * (max - min + 1)) + min;
                t = ff(rr() * (maxt - mint + 1)) + mint;
                tex = this.TEX['' + r];
                this.food[i].push(new Food(this.TEX, 1, 1, tex, this.cont[i], t, 999999, 999999, 0, false, false));
            }
        }
    };
    this.init(stage, layer, count);
};


GameFood.prototype.eat = function (TW, apptime, x, y, value, state, block, pl) {
    var food = this.food[block],
        index = -1,
        id = 0;
    if (block < 0 || !food) {
        return;
    }
    id = ((x + y) * (x + y + 1) * 0.5) + x;
    for (var i = 0; i < food.length; i++) {
        if (food[i].id === id) {
            index = i;
            break;
        }
    }
    if (index >= 0) {
        delete this.foodIdsInUse['' + food[index].id];
        food[index].eat(TW, apptime, this.cont[block], pl);
        food.splice(index, 1);
    } else {
        this.errorEatBoxRec.push([x, y, id]);
    }
};

GameFood.prototype.hasIdInErrorBox = function (x, y, id) {
    for (var i = 0; i < this.errorEatBoxRec.length; i++) {
        if (+this.errorEatBoxRec[i][2] === +id) {
            this.errorEatBoxRec.splice(i, 1);
            return true;
        }
    }
    return false;
};

// new food created
GameFood.prototype.newFoodFromServer = function (br) {
    var x = 0,
        y = 0,
        r = 0,
        t = 0,
        val = 0,
        max = 4,
        min = 1,
        maxt = 10,
        mint = 0,
        id = 0,
        bno = -1,
        state = 1,
        arrLen = 0;
    var count = br.readUInt16();
    for (var i = 0; i < count; i++) {
        bno = br.readUInt16(); // block no 
        arrLen = br.readUInt16(); // no of items in the block to add
        for (var j = 0; j < arrLen; j++) {
            x = br.readUInt16();
            y = br.readUInt16();
            val = br.readUInt8();
            state = br.readUInt8();
            r = Math.floor(Math.random() * (max - min + 1)) + min;
            t = Math.floor(Math.random() * (maxt - mint + 1)) + mint;
            id = ((x + y) * (x + y + 1) * 0.5) + x;
            if (this.hasIdInErrorBox(x, y, id)) continue;
            this.food[bno].push(new Food(this.TEX, state, val, this.TEX['' + r], this.cont[bno], t, x, y, id, true, this.app));
        }
    }
};


GameFood.prototype.dataPop = function (blocks) {
    var block = null,
        foodCont = null;
    for (var i = 0; i < blocks.length; i++) {
        block = blocks[i];
        if (block < 0) continue;
        foodCont = this.food[block];
        this.cont[block].visible = false;
        for (var j = 0; j < foodCont.length; j++) {
            this.cont[block].removeChild(foodCont[j].spr);
            delete this.foodIdsInUse['' + foodCont[j].id];
        }
        this.food[block] = [];
    }
};

// block data
GameFood.prototype.dataPush = function (foods) {
    var keys = Object.keys(foods),
        newfood = null,
        bno = -1,
        foodSprites = null;
    for (var i = 0; i < keys.length; i++) {
        // per block
        bno = +keys[i];

        newfood = foods[bno];
        if (newfood.length > this.food[bno].length) {
            this.expandFoodContainer(bno, newfood.length);
        }
        foodSprites = this.food[bno];
        for (var j = 0; j < newfood.length; j++) {
            id = (newfood[j][0] + newfood[j][1]) * (newfood[j][0] + newfood[j][1] + 1) * 0.5 + newfood[j][0];
            this.foodIdsInUse['' + id] = 1;
            foodSprites[j].set(newfood[j], id, this.TEX['5']);
        }
        for (var j = newfood.length; j < foodSprites.length; j++) {
            foodSprites[j].spr.visible = false;
        }
        this.cont[bno].visible = true;
    }
};

GameFood.prototype.updateQuaity = function (q) {
    q = ('' + q).toLowerCase().replace(' ', '');
    if (q === Conf.QUALITY.medium) {
        this.update_high = this.update_medium;
    } else if (q === Conf.QUALITY.high) {
        this.update_high = this.update_high;
    } else if (q === Conf.QUALITY.low) {
        this.update_high = this.update_low;
    } else if (q === Conf.QUALITY.ugly) {
        this.update_high = this.update_ugly;
    }
};
GameFood.prototype.withInBounds = function (abs, spr, ww, wh, plpos) {
    var ret = true;
    if (plpos.x < spr.position.x && (spr.position.x - spr.width / 2 - plpos.x) > ww) {
        ret = false;
    } else if ((plpos.x - spr.position.x - spr.width / 2) > ww) {
        ret = false;
    }
    if (plpos.y < spr.position.y && (spr.position.y - spr.height / 2 - plpos.y) > wh) {
        ret = false;
    } else if ((plpos.y - spr.position.y - spr.height / 2) > wh) {
        ret = false;
    }
    spr.visible = ret;
    return ret;
};
GameFood.prototype.update_high = function (ww, wh, plpos) {
    var items = null;
    this.counter += 0.03;
    var abs = Math.abs;
    for (var i = 0; i < this.cont.length; i++) {
        if (!this.cont[i].visible) continue;
        items = this.food[i];
        for (var j = 0; j < items.length; j++) {
            if (this.withInBounds(abs, items[j].spr, ww, wh, plpos)) {
                items[j].updateAni_high(this.counter, items[j].state === 1);
            }

        }
    }
};
GameFood.prototype.update_low = function (ww, wh, plpos) {
    var items = null;
    var abs = Math.abs;
    this.counter += 0.03;
    for (var i = 0; i < this.cont.length; i++) {
        if (!this.cont[i].visible) continue;
        items = this.food[i];
        for (var j = 0; j < items.length; j++) {
            this.withInBounds(abs, items[j].spr, ww, wh, plpos) && items[j].updateAni_low(this.counter, items[j].state === 1);
        }
    }
};
GameFood.prototype.update_medium = function (ww, wh, plpos) {
    var items = null;
    var abs = Math.abs;
    this.counter += 0.03;
    for (var i = 0; i < this.cont.length; i++) {
        if (!this.cont[i].visible) continue;
        items = this.food[i];
        for (var j = 0; j < items.length; j++) {
            this.withInBounds(abs, items[j].spr, ww, wh, plpos) && items[j].updateAni_medium(this.counter, items[j].state === 1);
        }
    }
};
GameFood.prototype.update_ugly = function () {};
module.exports = GameFood;