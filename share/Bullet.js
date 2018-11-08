var P = require('./pixinc.js');
var Conf = require('./gameConf.js');
var waterHeight = Conf.WaterHeight;
var scale = 0.25;
var MAX_LIFETIME = 700;
var Bullet = function (pos, stage) {
    this.sprite = null;
    this.count = 0;
    this.lifeTime = 0;
    if (!Bullet.prototype.TEX) {
        Bullet.prototype.TEX = P.Resources[Conf.FILES[Conf.FILESI['ge']]].texture;
    }
    this.init = function (pos, stage) {
        this.sprite = new P.Sprite(this.TEX);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.position.x = pos[0];
        this.sprite.position.y = pos[1];
        this.sprite.scale.set(scale, scale);
        stage.addChild(this.sprite);

    };

    this.init(pos, stage);
};
Bullet.prototype.remove = function(stage){
    this.sprite.visible = false;
    stage.removeChild(this.sprite);

};

Bullet.prototype.update = function (ws,dt) {
    this.count += 0.1;
    this.lifeTime +=dt;
    var new_scale_x = scale + scale * 0.2 * Math.cos(this.count);
    var new_scale_y = scale + scale * 0.2 * Math.sin(this.count);
    this.sprite.position.y -= (dt / 1000) * 900;
    this.sprite.scale.set(new_scale_x, new_scale_y);
    this.sprite.rotation +=this.count/2;
    this.sprite.alpha = 0.7 + 0.3* Math.cos(this.count);
    if(this.lifeTime>MAX_LIFETIME){
        return false;
    }
    return true;
};

module.exports = Bullet;