var P = require('./pixinc.js');
var Conf = require('./gameConf.js');
var FastMath = require('./fastmath.js');
var fMath = new FastMath();

function map(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var SpeedBar = function () {
    this.filled = 0;
    this.powerLevel = 1;
    this.textSpr = null;
    this.total = 100;
    this.barGraphic = null;
    this.spriteFill = null;
    this.spriteFrame = null;
    this.speedVal = 50;
    this.level = 1;
    this.currentColor = 0x00ff00;
    this.maxValue = Conf.POWER_BAR_MAX[0];

    
    this.init = function (stage, layer) {
        this.lvlText = new PIXI.Text("Energy Level:1", {
            stroke: 0x111111,
            strokeThickness: 2,
            fontFamily: 'Do Hyeon',
            fill: 0xffffff,
            fontSize: 18
        });
        this.textSpr = new PIXI.Text("0/0", {
            stroke: 0x111111,
            strokeThickness: 4,
            fontFamily: 'Do Hyeon',
            fill: 0xffffff,
            fontSize: 16
        });

        var rect = new P.Graphics();
        rect.beginFill(0xffffff, 0);
        rect.lineStyle(2, 0xffffff, 1);
        rect.drawRoundedRect(0, 0, window.innerWidth / 4, 24, 4);
        rect.endFill();
        var rectF = new P.Graphics();
        rectF.beginFill(0xffffff, 1);
        rectF.drawRoundedRect(0, 0, window.innerWidth / 4, 20, 4);
        rectF.endFill();
        var texFill = rectF.generateCanvasTexture();
        var texFrame = rect.generateCanvasTexture();
        this.spriteFrame = new P.Sprite(texFrame);
        this.spriteFill = new P.Sprite(texFill);

        this.lvlText.anchor.x = this.textSpr.anchor.x = 0.5;
        this.textSpr.anchor.y = 0.5;
        this.lvlText.anchor.y = 1;
        this.spriteFrame.anchor.x = 0;
        this.spriteFrame.anchor.y = 0.5;
        this.spriteFill.anchor.x = 0;
        this.spriteFill.anchor.y = 0.5;
        this.spriteFrame.position.x = window.innerWidth / 2 - this.spriteFrame.width / 2;
        this.spriteFrame.position.y = window.innerHeight - this.spriteFrame.height / 2 - 20;
        this.textSpr.position.x = this.spriteFrame.width / 2;
        this.lvlText.position.x = this.spriteFrame.width / 2;
        this.lvlText.position.y = -this.spriteFrame.height / 2 - 3;
        this.spriteFrame.addChild(this.spriteFill, this.textSpr, this.lvlText);
        this.spriteFrame.tint = 0x333333;
        this.spriteFrame.alpha = 1;
        this.spriteFill.alpha = 0.8;
        this.spriteFrame.displayGroup = layer;
        this.spriteFill.position.x = 2;
        this.spriteFill.tint = this.currentColor;
        stage.addChild(this.spriteFrame);
    };
};
SpeedBar.prototype.resize = function(){
    this.spriteFrame.position.x = window.innerWidth / 2 - this.spriteFrame.width / 2;
    this.spriteFrame.position.y = window.innerHeight - this.spriteFrame.height / 2 - 20;
};
SpeedBar.prototype.hideShow = function (val) {
    this.spriteFrame.visible = val;
};

SpeedBar.prototype.powerLevelChange = function (val) {
    this.powerLevel = val;
    this.lvlText.text = 'Energy Level:' + (val + 1);
    this.maxValue = Conf.POWER_BAR_MAX[this.powerLevel];
};

SpeedBar.prototype.update = function (count) {
    this.speedVal = count;
    this.textSpr.text = '' + this.speedVal + '/' + this.maxValue;
    var _sc = map(this.speedVal, 0, this.maxValue, 0, 1);
    if (_sc <= 1 || _sc >= 0) {
        this.spriteFill.scale.x = _sc;
    }
};

module.exports = SpeedBar;