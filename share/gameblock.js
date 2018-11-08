var GameBlock = function(x,y,id,type,spr){
this.x = x;
this.y = y;
this.id = id;
this.type =type;
this.spr = spr;
this.spr.x = x;
this.spr.y = y;
};

GameBlock.prototype.update = function(){

};

module.exports = GameBlock;