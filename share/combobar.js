var P = require('./pixinc.js');
var Conf = require('./gameConf.js');
var FastMath = require('./fastmath.js');
var fMath = new FastMath();
var MAX = 1000;
var COMBO_TIME = Conf.COMBO_TIME;
var TINTS = {
    '1':0x00ff00,
    '2':0xff0000,
    '3':0x00ffff
}

var ComboBar = function (client) {
    COMBO_TIME = Conf.COMBO_TIME*1000;
    this.filled = 0;
    this.client = client;
    this.total = 100;
    this.repeatTween =null;
    this.barGraphic = null;
    this.spriteFill = null;
    this.spriteFrame = null;
    this.comboText = null;
    this.comboCount = 0;
    this.level = 1;
    this.yPos = window.innerHeight / 2 + window.innerHeight / 8;
    this.currentColor = 0x00ff00;
    this.maxValue = MAX;
};

ComboBar.prototype.comboOver = function(){
   var self = this;
    var TW = self.client.getTW();
    this.spriteFrame.visible= false;
    if(this.repeatTween){
        this.repeatTween.end()
        this.repeatTween.stop();
        this.repeatTween = null;
    }
    new TW.Tween({
        y: 1,
        x:1
    })
    .to({
        x:1.4,
        y: 0
    }, 500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function () {
        self.comboText.scale.set(this.x,this.x);
        self.comboText.alpha=  this.y;
    })
    .onComplete(function () {
        self.comboText.scale.set(1,1);
        self.comboText.visible = false;   
        self.comboText.alpha = 1;
        self.spriteFrame.visible = false;
    })
    .start(self.client.appTime);
};
ComboBar.prototype.reset = function(){
    this.spriteFrame.visible = false;
    this.comboText.visible = false;
    if(this.repeatTween){
        this.repeatTween.stop();
        this.repeatTween = null;
    }
    if(this.ctween){
        this.ctween.stop();
        this.ctween = null;
    }
};
ComboBar.prototype.startTween = function (count) {
    var self = this;
    var TW = self.client.getTW();
    if (this.ctween) {
        this.ctween.stop();
        this.ctween = null;
    }
    var index = Math.min(3,count);
    this.comboText.tint = TINTS[''+ index];
    this.spriteFrame.visible = true;
    this.comboText.alpha = 1;
    this.comboText.visible = true;
    this.comboText.scale.x = 1;
    this.comboText.scale.y = 1;

    self.comboText.text = count + "X" + ' COMBO';

    this.ctween = new TW.Tween({
            y: 1
        })
        .to({
            y: 0
        }, COMBO_TIME)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function () {
            self.spriteFill.scale.x = this.y;
        })
        .onComplete(function () {
            self.spriteFill.scale.x = 0;
            self.comboOver();
            self.ctween = null;
        })
        .start(self.client.appTime);

      this.repeatTween =  new TW.Tween({
            y: 0.5,
            x:0.95
        })
        .to({
            y: 1,
            x:1.05
        }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function () {
                self.comboText.scale.x = this.x;
                self.comboText.scale.y = this.x;
                self.comboText.alpha = this.y;
        })
        .yoyo(true)
        .repeat(Infinity)
        .start(self.client.appTime);

};

ComboBar.prototype.combo = function (count) {
    this.comboCount = count+1;
    this.startTween(count+1);
};

ComboBar.prototype.resize = function () {
    var width = 100;
    this.yPos = window.innerHeight / 2 + window.innerHeight / 8;
    this.spriteFrame.position.x = window.innerWidth - width - 30;;
    this.spriteFrame.position.y = this.yPos;
    this.comboText.position.x = window.innerWidth - width - 30;;
    this.comboText.position.y = this.yPos + this.spriteFrame.height * 2;;
};

ComboBar.prototype.init = function (stage, layer) {
    var width = 100;
    var rect = new P.Graphics();
    rect.beginFill(0xffffff, 0);
    rect.lineStyle(4, 0xffffff, 1);
    rect.drawRoundedRect(0, 0, width, 15, 1);
    rect.endFill();
    var rectF = new P.Graphics();
    rectF.beginFill(0xffffff, 1);
    rectF.drawRoundedRect(0, 0, width, 15, 1);
    rectF.endFill();
    var texFill = rectF.generateCanvasTexture();
    var texFrame = rect.generateCanvasTexture();

    this.comboText = new PIXI.Text('2X Combo', {
        stroke: 0x222222,
        strokeThickness: 3,
        fontFamily: 'Do Hyeon',
        fill: 0xffffff,
        fontSize: 20
    });
    this.comboText.anchor.x = 0;
    this.comboText.anchor.y = 0;
    this.spriteFrame = new P.Sprite(texFrame);
    this.spriteFill = new P.Sprite(texFill);
    this.spriteFrame.anchor.x = 0;
    this.spriteFrame.anchor.y = 0.5;
    this.spriteFill.anchor.x = 0;
    this.spriteFill.anchor.y = 0.5;
    this.spriteFrame.position.x = window.innerWidth - width - 30;
    this.spriteFrame.position.y = this.yPos;
    this.comboText.position.x = window.innerWidth - width - 30
    this.comboText.position.y = this.yPos + this.spriteFrame.height;
    this.spriteFrame.addChild(this.spriteFill);
    this.spriteFrame.tint = 0x333333;
    this.spriteFrame.alpha = 1;
    this.spriteFill.alpha = 0.8;
    this.spriteFrame.displayGroup = this.comboText.displayGroup = layer;
    this.spriteFill.position.x = 2;
    this.spriteFill.tint = this.currentColor;
    stage.addChild(this.spriteFrame, this.comboText);
    this.spriteFrame.visible = false;
    this.comboText.visible = false;
};

ComboBar.prototype.update = function (count) {
    // this.speedVal = count;
    // var _sc = map(this.speedVal, 0,this.maxValue, 0, 1);
    // if (_sc <= 1 || _sc >= 0) {
    //     this.spriteFill.scale.x = _sc;
    // }
};

module.exports = ComboBar;