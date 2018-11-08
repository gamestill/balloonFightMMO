var Conf = require('./gameConf.js');
var P = require('./pixinc.js');
var GameVer = function(){
    this.versionText = null;
    this.buildText = null;
 
    this.VER_STATE = function(val){
        var show = false;
        if(val===1){
            show = true;
        }
        this.versionText.visible = show;
        this.buildText.visible = show;
    }
    
    this.resize = function(w,h){
        this.versionText.position.x = w-  this.versionText.width -10;
        this.versionText.position.y = h - 5;        
        this.buildText.position.x = w-  this.buildText.width -10;
        this.buildText.position.y =  this.versionText.position.y - this.versionText.height - 5;
    };
    this.init = function(version,stage,w,h,container,topLayer){
        var version_val = version;
        var buildStage_val = stage;
        this.buildText  =  new PIXI.Text(buildStage_val,{
            stroke: 0x000000,
            strokeThickness: 1,
            fill: 0xcccccc,
            fontSize: 12
        });
        this.versionText = new PIXI.Text(version_val,{
            stroke: 0x000000,
            strokeThickness: 1,
            fill: 0xffffff,
            fontSize: 13
        });

        this.versionText.position.x =  w-  this.versionText.width -10;
        this.versionText.position.y = h - 5;        
        this.buildText.position.x = w-  this.buildText.width -10;
    
        this.buildText.position.y =  this.versionText.position.y - this.versionText.height - 5;
        
        this.versionText.anchor.x = 0;
        this.versionText.anchor.y = 1;
        this.buildText.anchor.x = 0;
        this.buildText.anchor.y = 1;
        this.buildText.displayGroup = P.Layer1;
        this.versionText.displayGroup = P.Layer1;
        this.versionText.displayGroup = topLayer;
        this.buildText.displayGroup = topLayer;
        
        container.addChild(this.versionText,this.buildText);
        this.versionText.alpha = 0.6;
        this.buildText.alpha = 0.6;
        
    };


};

module.exports = GameVer;