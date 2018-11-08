var Conf = require('./gameConf.js');
var P = require('./pixinc.js');
var InterP = require('./common/Interp.js');
var P = require('./pixinc.js');


var MAP_FACE_VALUE = Conf.MAP_FACE_VALUE;
function map (num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
var Face = function (id, tex, tex2, tex3, stage) {
    this.x = 0;
    this.id = id;
    this.chargeTween  = null;
    this.time = 0;
    this.removed = false;
    this.ip = new InterP(id);
    this.sprite = null;
    this.bombTex = null;
    this.attack = false;
    this.aTex = null;
    this.frame = null;
    this.fill = null;
    this.maxTime = 15;
    this.init = function (tex, tex2, tex3, stage) {
        var aTex = new P.Texture.fromFrame(tex + '.png');
        this.aTex = aTex;
        this.bombTex = P.Resources[Conf.FILES[Conf.FILESI['bl']]].texture;
        this.sprite = new P.Sprite(aTex);
        this.frame = new P.Sprite(tex2);
        this.fill = new P.Sprite(tex3);
        this.frame.tint = 0xffffff;
        this.frame.scale.x = 1;
        this.removeByOther = false;
        this.fill.scale.x = 0.5;
        this.fill.scale.y = 1;
        this.sprite.scale.x = this.sprite.scale.y = 0.7;
        this.frame.scale.x = this.frame.scale.y = 1;
        this.fill.anchor.x = 0;
        this.frame.anchor.x = 0;
        this.fill.anchor.y = 0.5;

        this.sprite.anchor.x = this.sprite.anchor.y = this.frame.anchor.y = 0.5;
        this.frame.addChild(this.fill);
        this.frame.position.set(-this.sprite.width / 2, -this.sprite.height / 1.2);
        stage.addChild(this.sprite,this.frame);
    };

    this.init(tex, tex2, tex3, stage);
};
Face.prototype.rc = function(val){
    if(val && this.attack){
    //    this.sprite.filters = [glow];
    }else{
        this.sprite.filters = [];
    }
}
Face.prototype.hideShow = function(val){
    this.sprite.filters = [];
    this.sprite.visible = val;
    this.fill.visible = val;
    this.frame.visible = val;
};
Face.prototype.setRemoveByOther = function () {
    this.removeByOther = true;
};
Face.prototype.newPos = function (sTime, now, pos) {
    this.time = pos[0]/10;
    var _sc = map(this.time,0,MAP_FACE_VALUE,0,1) ;
    if(_sc<=1 || _sc>=0){
        this.fill.scale.x = _sc;
        this.fill.tint = 0x00ff00;
        if(_sc<0.3){
            this.fill.tint = 0xff0000;
        }else if(_sc<0.6){
            this.fill.tint = 0xffff00;
        }    
    }
    this.ip.addSample(sTime, now, pos[2], pos[3]);
};

Face.prototype.clear = function (stage) {
    this.sprite.visible = false;
    this.frame.visible = false;
    while (this.frame.children[0]) {
        this.frame.removeChild(this.frame.children[0]);
    }
    stage.removeChild(this.sprite);
    stage.removeChild(this.frame);
    this.frame = undefined;
    this.sprite = undefined;
};

Face.prototype.update = function (currentTime) {
    var ret = this.ip.getPosition(currentTime);
    if (ret) {
        this.sprite.position.x = ret[0];
        this.sprite.position.y = ret[1];
        this.frame.position.x = ret[0] - this.frame.width/2;
        this.frame.position.y = ret[1]  - this.sprite.height/2;
    }
    if(this.attack){
        this.sprite.rotation += 0.2;
    }else{
        this.sprite.rotation = 0;
    }
};
Face.prototype.updateN = function (ct) {

};
Face.prototype.attacking  = function( val){
    if(val &&!this.attack){
        this.sprite.texture = this.bombTex;
        this.attack = true;
        this.frame.visible = false;
    }else if(!val && this.attack){
        this.attack = false;
        this.sprite.texture = this.aTex;
        this.frame.visible = true;
    }
}
Face.prototype.charging = function(time,tw){
   var self = this;
    this.sprite.tint = 0x00ff00;
    if(this.chargeTween){
        this.chargeTween.stop();
        this.chargeTween = null;
    }
    this.chargeTween = new tw.Tween({
        x: 0.5
    })
    .to({
        x: 1
    }, 100)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function () {
        self.sprite.alpha = this.x;
    })
    .yoyo(true)
    .repeat(3)
    .onComplete(function(){
        self.chargeTween = null;
        self.sprite.tint = 0xffffff;
        self.sprite.alpha = 1;
    })
    .start(time);
}

var FaceManager = function (player,texName) {
    MAP_FACE_VALUE=  Conf.MAP_FACE_VALUE;
    this.faces = {};
    this.ids = 0;
    this.player = player;
    this.lastChildCount = 0;
    this.frTween = null;
    this.lastSnapshot = [];
    this.removeTime = 0;
    this.tex = null;
    this.tex2 = null;
    this.texFill = null;
    this.init = function (texName) {
        var rect = new P.Graphics();
        rect.beginFill(0xffffff, 0);
        rect.lineStyle(2, 0xffffff, 1);
        rect.drawRoundedRect(0, 0, 20, 8, 4);
        rect.endFill();
        var rectF = new P.Graphics();
        rectF.beginFill(0xffffff, 1);
        rectF.drawRoundedRect(0, 0, 20, 8, 4);
        rectF.endFill();
        this.texFill = rectF.generateCanvasTexture();
        this.tex2 = rect.generateCanvasTexture();
        this.tex = texName;
    };

    this.init(texName);
}

FaceManager.prototype.createNewChild = function (id, stage) {
    this.faces[id] = new Face(id, this.tex, this.tex2, this.texFill, stage);
    
    // else{
    //     var rend = this.player.renderer;
    //     rend.showError('Cooldown: ' + del + ' seconds remaining','0xffff00');
    // }
};



FaceManager.prototype.removeChild = function (face, stage, pl, TW, appTime) {
    var id = face.id;

    var rend = this.player.renderer;
    rend.showError('You have lost your companion','0xff0000',TW);
    var self = this;
  
    face.update = face.updateN;
    face.removed = true;
   new TW.Tween({
            z: 1
        })
        .to({
            z: 0
        }, 300)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function () {
            face.sprite.scale.x = face.sprite.scale.y = this.z;
            face.sprite.alpha = this.z;
        })
        .onComplete(function () {
           
            face.clear(stage);
            delete self.faces[id];

        })
        .start(appTime);

}

FaceManager.prototype.charge = function(currentTime,TW){
    var keys = Object.keys(this.faces);
    for (var i = 0; i < keys.length; i++) {
        this.faces[keys[i]].charging(currentTime,TW);
    }
}
FaceManager.prototype.attacking  = function( val){
    var keys = Object.keys(this.faces);
    for (var i = 0; i < keys.length; i++) {
        this.faces[keys[i]].attacking(val);
    }
}
FaceManager.prototype.update = function (currentTime) {
    var keys = Object.keys(this.faces);
    for (var i = 0; i < keys.length; i++) {
        this.faces[keys[i]].update(currentTime);
    }
};

FaceManager.prototype.rc = function(on){
    var keys = Object.keys(this.faces);
    for (var i = 0; i < keys.length; i++) {
        this.faces[keys[i]].rc(on);
    }
    
}

FaceManager.prototype.removeAllFaces = function (appTime, stage, pl, tw) {
  
    var keys = Object.keys(this.faces);
    var id = -1;
    var face = null;
    for (var i = 0; i < keys.length; i++) {
        face = this.faces[keys[i]];
        if (face && !face.removed) {         
            this.removeChild(face, stage, pl, tw, appTime);
            return true;
        }
      
    }
    return false;
};
FaceManager.prototype.hideShow = function(val){
    if(!this.faces){
        return;
    }
    var keys = Object.keys(this.faces);
    var id = -1;
    var face = null;
    for (var i = 0; i < keys.length; i++) {
        face = this.faces[keys[i]];
        face.hideShow(val);

    }
}
FaceManager.prototype.compareSnapShots = function (snapshot, stage, pl, tw, appTime) {
    var len = snapshot.length;
    var last_len = this.lastSnapshot.length;
    var newOnes = [];
    var currId = -1;
    var justIds = [];
    var face = null;
    for (var i = 0; i < snapshot.length; i++) {
        currId = snapshot[i][1];
        if (!this.faces[currId]) {
            this.createNewChild(currId, stage);
        }
        justIds.push(currId);
    }
    for (var i = 0; i < this.lastSnapshot.length; i++) {
        currId = this.lastSnapshot[i][1];
        if (justIds.indexOf(currId) < 0) {
            face = this.faces[currId];
            if (face && !face.removed) {
                this.removeChild(face, stage, pl, tw, appTime);
            }
        }
    }
};

FaceManager.prototype.snapshotRec = function (appTime, sTime, now, childData, stage, pl, tw) {
    var childDataLen = childData.length;
    var face = null;
    this.compareSnapShots(childData, stage, pl, tw, appTime);

    for (var i = 0; i < childDataLen; i++) {
        face = this.faces[childData[i][1]];
        face && face.newPos(sTime, now, childData[i]);
    }


    this.lastSnapshot = childData;
}
module.exports = FaceManager;