var P = require('./pixinc.js');
var Conf = require('./gameConf.js');
var FastMath = require('./fastmath.js');
var fMath = new FastMath();
var waterHeight = Conf.WaterHeight;
var SPLASH_TYPE = {
    BOOST: 1,
    WAVE: 2
}
var WATER_SEGMENTS = 80;
var MAX_WATER_VEL = 150;
var Point = function (x, y, v) {
    this.x = x;
    this.y = y;
    this.v = v;
};
var Water = function (size, stage, layer) {
    this.size = size;
    this.allSegments = WATER_SEGMENTS;
    this.drawSegments = WATER_SEGMENTS;
    this.one_segment_dim = Math.ceil(screen.width / WATER_SEGMENTS);
    this.spread = 0.25;
    this.wconst = 0.025;
    this.totalWidth = screen.width;
    this.dconst = 0.015;
    this.baseHeight = size - waterHeight;
    this.boost_wave = 25;
    this.coll_wave = 100;
    this.coll_wave_dubki = 80;
    this.max = MAX_WATER_VEL;
    this.points = [];
    this.container = new P.Container();
    this.container.pivot.x = 0.5;
    this.container.pivot.y = 0.5;
    this.graphic = null;
    this.graLine = null;

    this.init = function (size, stage, layer) {
        this.graphic = new P.Graphics();
        this.graLine = new P.Graphics();
        var x = 0;
        var y = 0;
        this.container.addChild(this.graphic, this.graLine);
        stage.addChild(this.container);
        for (var i = 0; i < this.drawSegments; i++) {
            x = -this.totalWidth / 2 + i * this.one_segment_dim;
            y = this.baseHeight;
            this.points.push(new Point(x, y, 0));
        }
        this.container.displayGroup = layer;
    };
    this.init(size, stage, layer);
};

Water.prototype.splash = function (type, x, y) {
    var off = Math.floor((this.container.position.x - x) / this.one_segment_dim);
    var shiftFromCenter = Math.min(this.points.length - 1, Math.max(0, (this.drawSegments / 2) - off));
    var dy = 0;
    var max = 0;
    if (type === SPLASH_TYPE.BOOST) {
        dy = Math.max(0, 100 / (this.baseHeight - y));
        max = this.boost_wave;
        if (dy < 0.2) {
            dy = 0;
        } else {
            max = max * dy;
            this.points[shiftFromCenter].v = max;
        }
    } else {
        dy = (this.baseHeight - y);
        if (dy < 0 && dy > -100) {
            max = this.coll_wave_dubki;
            this.points[shiftFromCenter].v = fMath.getRandom(max-5,max+20);
        }
    }
};

Water.prototype.update = function (x, zoom) {
    this.container.position.x = Math.min(this.size - this.totalWidth / 2, Math.max(this.totalWidth / 2, x));
    if (this.points.length <= 0) {
        return;
    }
    var _x = 0;
    var Spread = this.spread;
    for (var i = 0; i < this.points.length; i++) {
        _x = this.baseHeight - this.points[i].y;
        this.points[i].v = Math.max(-this.max, Math.min(this.max, this.points[i].v + this.wconst * _x - this.points[i].v * this.dconst));
        this.points[i].y += this.points[i].v;
    }

    var leftDeltas = Array.apply(null, Array(this.points.length)).map(Number.prototype.valueOf, 0);
    var rightDeltas = Array.apply(null, Array(this.points.length)).map(Number.prototype.valueOf, 0);
    var pt = this.points;
    this.graLine.clear();
    this.graLine.lineStyle(3, 0x227db2, 1);
    this.graphic.clear();
    this.graphic.beginFill(0x40a4df, 1);
    for (var i = 0; i < pt.length; i++) {
        if (i > 0) {
            leftDeltas[i] = Spread * (pt[i].y - pt[i - 1].y);
            pt[i - 1].v += leftDeltas[i];
        }
        if (i < this.points.length - 1) {
            rightDeltas[i] = Spread * (pt[i].y - pt[i + 1].y);
            pt[i + 1].v += rightDeltas[i];
        }
    }
    for (var i = 0; i < this.points.length; i++) {
        if (i > 0)
            pt[i - 1].y += leftDeltas[i];
        if (i < this.points.length - 1) {
            pt[i + 1].y += rightDeltas[i];
        }
        this.graLine.moveTo(pt[i].x, pt[i].y);
        this.graLine.lineTo(pt[i].x + this.one_segment_dim, pt[Math.min(pt.length - 1, i + 1)].y);
        // draw graphics
        this.graphic.drawPolygon(
            new PIXI.Point(pt[i].x, pt[i].y),
            new PIXI.Point(pt[i].x + this.one_segment_dim, pt[Math.min(pt.length - 1, i + 1)].y),
            new PIXI.Point(pt[i].x + this.one_segment_dim, pt[i].y + 1200),
            new PIXI.Point(pt[i].x, pt[i].y + 1200)
        );
    }

    this.graLine.endFill();
    this.graphic.endFill();

};


var Rotator = function(data,container){
    this.x = data[0] - data[2]/2;
    this.y = data[1] - data[3]/2;
    this.size_x = data[2];
    this.size_y = data[3];

    this.ox = data[0]  - data[3]/2;
    this.oy = data[1] -  data[2]/2;
    this.osize_x =data[3];
    this.osize_y = data[2];
                   
    this.spr = null;
    this.init = function (cont) {
        var gra = new P.Graphics();   
        gra.lineStyle(2,0xff0000,1);
        gra.beginFill(0xcc0000,1);
        gra.drawRoundedRect(this.x,this.y,this.size_x,this.size_y,5); 
        gra.drawRoundedRect(this.ox,this.oy,this.osize_x,this.osize_y,5);
        gra.endFill();
        this.spr = new P.Sprite(gra.generateCanvasTexture());
        this.spr.anchor.x = 0.5;
        this.spr.anchor.y = 0.5;
        this.spr.position.x = this.x + data[2]/2;
        this.spr.position.y = this.y + data[3]/2;

        cont.addChild(this.spr);
    };
    this.init(container);
}

Rotator.prototype.update = function(dt){
this.spr.rotation+=100*dt;

}

var MurderRoom = function (room,size,container) {
    this.x = room[0];
    this.y = room[1];
    this.size = size;
    this.openSide = room[2];
    this.init = function (cont) {
        var count = 0;
        var gra = new P.Graphics();
        gra.lineStyle(6,0xff0000,1);
        gra.moveTo(this.x,this.y);
        count++;
        gra.lineTo(this.x+this.size,this.y); // top line
        count++;
        if(count===this.openSide){
            gra.lineTo(this.x +  this.size,this.y + this.size*0.4); // right line
            gra.moveTo(this.x +  this.size,this.y + this.size*0.6);
            gra.lineTo(this.x +  this.size,this.y + this.size); // right line
        }else{
            gra.lineTo(this.x +  this.size,this.y + this.size); // right line
        }
        count++;
        if(count===this.openSide){
            gra.lineTo(this.x +  this.size*0.6,this.y + this.size); // bottom line
            gra.moveTo(this.x +  this.size*0.4,this.y + this.size);
            gra.lineTo(this.x,this.y + this.size); // bottom line
        }else{
            gra.lineTo(this.x,this.y + this.size); // bottom line
        }
        gra.lineTo(this.x,this.y); // left line

        gra.endFill();
        cont.addChild(gra);
        
    };
    this.init(container);
};

var WorldBoundary = function (x, y, size, tileSize, tex) {
    this.width = size;
    this.height = size;
    this.x = x;
    this.y = y;
    this.count = 0;
    this.rooms = [];
    this.rotator = [];
    this.lines = undefined;
    this.container = new P.Container();
    this.roomCont = new P.Container();
    this.repeatTile = null;
    this.backcolor = Conf.BOUND_BACK_COLOR;
    this.color = Conf.BOUND_COLOR;
    this.magicColor = 0xff0000;
    this.lineT = Conf.BOUND_THICK;
    this.scalar = Conf.BOUND_SCALAR;
    this.water = null;
};

WorldBoundary.prototype.update = function (dt,x, y) {
    this.water && this.water.update(x, y);
    for(var i=0;i<this.rotator.length;i++){
        this.rotator[i].update(dt);
    }
};

WorldBoundary.prototype.setBoundary = function () {
    var SCALAR = this.scalar;
    var lineT = this.lineT;
    var lines = new P.Graphics();
    var filler = new P.Graphics();
    filler.lineStyle(1, 0x000000, 0.0);
    filler.beginFill(this.backcolor, 0.7);
    filler.drawRect(this.x, this.y - SCALAR, this.width, SCALAR); //top line
    filler.drawRect(this.x - SCALAR, this.y - SCALAR, SCALAR, SCALAR); //top left filler
    filler.drawRect(this.x + this.width, this.y, SCALAR, this.height); //right line
    filler.drawRect(this.x + this.width, this.y - SCALAR, SCALAR, SCALAR); //right filler
    filler.drawRect(this.x - SCALAR, this.y, SCALAR, this.height); //left line
    filler.drawRect(this.x - SCALAR, this.y + this.height, SCALAR, SCALAR); //bottom  left filler
    filler.drawRect(this.x, this.y + this.height, this.width, SCALAR); //bottom line
    filler.drawRect(this.x + this.width, this.y + this.height, SCALAR, SCALAR); //bottom  right  filler   
    filler.endFill();
    lines.beginFill(this.color, 1);
    lines.drawRect(this.x, this.y, this.width, lineT); //top line
    lines.endFill();
    lines.beginFill(this.magicColor, 1);
    lines.drawRect(this.x + this.width, this.y + lineT, lineT, this.height - lineT); //right line
    lines.drawRect(this.x, this.y + lineT, lineT, this.height - lineT); //left line
    lines.drawRect(this.x, this.y + this.height - lineT, this.width, lineT); //bottom line
    lines.endFill();
    this.container.addChild(filler, lines);
    this.lines = lines;
};

WorldBoundary.prototype.roomsInit = function(){
    var rooms = [[1000,1200,2],[6000,1200,2],[1000,4000,2],[6000,4000,2]];
    var size = 1500;
    for(var i=0;i<rooms.length;i++){
        this.rooms.push(new MurderRoom(rooms[i],size,this.roomCont))
    }           

    var rotators = [
        [4750,1500,500,30],
        [4750,3000,500,30],
        [4750,4500,500,30],
        [4750,6000,500,30],
       
    ]
    for(var i=0;i<rotators.length;i++){
        this.rotator.push(new Rotator(rotators[i],this.roomCont));
    }
};

WorldBoundary.prototype.setWorld = function (stage, tex, blockSize, eleSize, layer, topStage, topLayer) {

    stage.addChild(this.container,this.roomCont);
    var offset = 10000;
    this.repeatTile = new PIXI.extras.TilingSprite(
        tex, this.width + offset, this.height + offset);
    this.repeatTile.position.x = -offset / 2;
    this.repeatTile.position.y = -offset / 2;
    this.container.displayGroup = layer;
    this.roomCont.displayGroup = layer;
    this.container.addChild(this.repeatTile);
    this.water = new Water(this.width, topStage, topLayer);
    
    this.roomsInit();
    this.setBoundary();

};


module.exports = WorldBoundary;