var Conf = require('./gameConf.js');
var P = require('./pixinc.js');

var Score = function(){
    this.scoreText = null;
    this.scoreValText = null;
    this.score = 0;
    this.reset = function(){
        if(this.scoreValText){
            this.scoreValText.text = "0";
        }
       this.score = 0;
    };
    this.update = function(val,TW,tt){
        this.score +=val;
        var $this = this;
        this.scoreValText.text = "" + this.score;
        new TW.Tween({
            x: 0.5
        })
        .to({
            x: 1
        }, 100)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
            $this.scoreValText.scale.x = $this.scoreValText.scale.y = this.x;
        })
        .start(tt);
    };
    this.SCORE_STATE = function(val){
        var show = false;
        if(val===1){
            show = true;
        }
        this.scoreValText.visible = show;
        this.scoreText.visible = show;
    }
    
    this.resize = function(w,h){      
        this.scoreText.position.x = 10;
        this.scoreValText.position.x = 10 + this.scoreText.width + 2;
      this.scoreValText.position.y =  this.scoreText.position.y = h - this.scoreText.height - 5;
    };
    this.init = function(stage,w,h,container,topLayer){
        this.scoreText  =  new PIXI.Text("Score:",{
            stroke: 0x000000,
            strokeThickness: 1,
            fill: 0xeeeeee,
            fontSize: 14
        });
        this.scoreValText = new PIXI.Text('0',{
            stroke: 0x000000,
            strokeThickness: 1,
            fill: 0xffffff,
            fontWeight:'bold',
            fontSize: 15
        });


        this.scoreText.position.x = 10;
        this.scoreValText.position.x = 10 + this.scoreText.width + 2;
        this.scoreValText.position.y = this.scoreText.position.y = h - this.scoreText.height - 5;
        this.scoreText.anchor.x = 0;
        this.scoreText.anchor.y = 1;
        this.scoreValText.anchor.x = 0;
        this.scoreValText.anchor.y = 1;
        this.scoreValText.displayGroup=   this.scoreText.displayGroup = P.Layer1;
        this.scoreValText.displayGroup =this.scoreText.displayGroup = topLayer;
        container.addChild(this.scoreText,this.scoreValText);
        this.scoreText.alpha = this.scoreValText.alpha =0.8;
        
    };


};

module.exports = Score;