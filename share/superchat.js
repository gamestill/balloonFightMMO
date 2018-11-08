var Conf = require('./gameConf.js');
var P = require('./pixinc.js');

var SuperChat = function(rend){
this.chats = [];
this.renderer = rend;
this.container = new P.Container();
this.container.visible = false;
this.container.pivot.y = 0;
this.container.pivot.x = 0;

this.init = function(){
    this.container.position.x = 0;
    this.container.position.y = 0;
    this.container.visible = false;
    var layer = this.renderer.getUILayer();
    var overlay = this.renderer.getOverlayStage();
    overlay.addChild(this.container);
    this.container.displayGroup = layer;
};
this.resize = function (w, h) {
//    this.container.position.x = 10;
 //   this.container.position.y = ;
}
this.showStickyMsg = function(){

};

this.showAll = function(){

};

this.hideAll = function(){

};

this.updateTags = function(tags){
    var obj = {};
    this.chats = [];
    var key = 0;
    for(var i=0;i<tags.length;i++){
        obj = tags[i];
        key++;
        if(obj.tagstate==='off'|| obj.tagstate==='OFF'){
        }else{
            this.chats.push([obj.name,key]);
        }
    }
};

this.init();
};

module.exports = SuperChat;