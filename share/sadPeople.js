var Conf = require('./gameConf.js');
var P = require('./pixinc.js');

var FMATH = require('./fastmath.js');
var fMath = new FMATH();

var SAD_STATE = {
    'happy': 1,
    'sad': 2
}
var CacheSize = 100;
var SpriteCache = [];

var SadPerson = function (sprite, text) {
    this.x = 0;
    this.y = 0;
    this.text = text;
    this.sprite = sprite;
    this.index = -1;
    this.state = SAD_STATE.sad;
};

SadPerson.prototype.stateChange = function (index ,cacheItem, state) {
    var rtint = Conf.AVATAR_CLRS[ fMath.getRandom(0,Conf.AVATAR_CLRS.length)];
    rtint = rtint.replace(/#/g, "0x");
    this.state = state;
    this.sprite = cacheItem[0];
    this.sprite.tint = rtint;
    this.text = cacheItem[1];
    this.index = index;
    this.sprite.visible = this.text.visible = true;
    this.sprite.position.x = this.x;
    this.sprite.position.y = this.y;
    this.text.position.x = this.x - 20;
    this.text.position.y = this.y - 20;

}

SadPerson.prototype.servInit = function (x, y) {
    this.x = x;
    this.y = y;
};


var SadPeople = function (app, stage, layer) {
    this.app = app;
    this.sadCont = new P.Container();
    this.sadCont.pivot.x = this.sadCont.pivot.y = 0.5;
    this.sadCont.displayGroup = layer;
    this.sadCont.visible = true;
    this.usedIndex = [];
    this.freeIndex = [];
    this.people = [];
    stage.addChild(this.sadCont);

    this.servInit = function (data) {
        for (var i = 0; i < data.length; i++) {
            this.people[data[i][0]] && this.people[data[i][0]].servInit(data[i][1], data[i][2]);
        }
    };
    
    this.remove = function (from, to) {
        var index = -1;
        var foundAt = -1;
        var person = null;
        for (var i = from; i <= to; i++) {
            console.log('hiding people at:' + i);
            person = this.people['' + i]
            if (person.sprite)
            {
                index =  person.index;
                foundAt = this.freeIndex.indexOf(index);
                if(foundAt<0 && index>0){
                    this.freeIndex.push(index);
                }
                person.sprite.visible = false;
                person.text.visible = false;
            }   
        }
    };

    this.removePeople = function (data) {
        var from = data[0];
        var to = data[data.length - 1];
        for (var i = 0; i < to - 1; i += 2) {
            this.remove(data[i], data[i + 1]);
        }

    };
    this.expandCache = function(by){
        console.log('expanding cache');
        var len = this.freeIndex.length;
        var sprite=null,text = null;
        for (var i = 0; i < by; i++) {
            sprite = new P.Sprite(tex);
            text = new PIXI.Text(":(", {
                fontFamily: 'Do Hyeon',
                fill: 0xffffff,
                fontSize: 10

            });
            text.anchor.x = text.anchor.y = sprite.anchor.x = sprite.anchor.y = 0.5;
            sprite.scale.x = sprite.scale.y = 0.4;
            sprite.visible = false;
            text.visilbe = false;
            SpriteCache.push([sprite, text]);
            this.freeIndex.push(len++);
            this.sadCont.addChild(sprite, text);
        }
    };

    this.addPeople = function (data) {
        var index = 0;
        if(data.length>this.freeIndex.length){
            this.expandCache( data.length - this.freeIndex.length +5 );
        }
        for (var i = 0; i < data.length; i++) {
            index = this.freeIndex[0];
            console.log('adding people at:' + data[i][0]);
            this.people[data[i][0]].stateChange(index,SpriteCache[index], data[i][1]);
            this.freeIndex.splice(0,1);
        }
    };
    this.init = function () {
        var start = 0;
        var sprite = null;
        var tex = P.Resources[Conf.FILES[Conf.FILESI['ge']]].texture;
        var count = 400 * Conf.NO_OF_SAD_PEOPLE_PER_BLOCK;
        for (var i = 0; i < count; i++) {
            this.people['' + ++start] = new SadPerson(null, null);
        }

        for (var i = 0; i < CacheSize; i++) {
            sprite = new P.Sprite(tex);
            text = new PIXI.Text(":(", {
                fontFamily: 'Do Hyeon',
                fill: 0xffffff,
                fontSize: 10

            });
            text.anchor.x = text.anchor.y = sprite.anchor.x = sprite.anchor.y = 0.5;
            sprite.scale.x = sprite.scale.y = 0.4;
            sprite.visible = false;
            text.visilbe = false;
            SpriteCache.push([sprite, text]);
            this.freeIndex.push(i);
            this.sadCont.addChild(sprite, text);
        }

    };
    this.init();
}

module.exports = SadPeople;