// var P = require('./pixinc.js');
// var Conf = require('./gameConf.js');
// var FastMath = require('./fastmath.js');
// var fMath = new FastMath();

// function pad(num, size) {
//     var s = "000000000" + num;
//     return s.substr(s.length - size);
// }

// var TimerBar = function () {
//     this.doublexpTime = Conf.DOUBLE_MODE_TIME;
//     this.secHand = null;
//     this.minHand = null;
//     this.matchOn = true;
//     this.doOrDieTimeText = null;
//     this.waitingJQ = null;
//     this.matchTimeRemaining = null;
//     this.lastSecondsOn = false;
//     this.clockMainSprite = null;

//     this.init = function (stage, layer) {
//         var size = 20;
   
//         this.doOrDieTimeText = new PIXI.Text("10", {
//             stroke: 0x111111,
//             strokeThickness: 4,
//             fontFamily: 'Do Hyeon',
//             fill: 0xff0000,
//             fontSize: 55,
//             fontWeight:'bold'
//         });
//         this.doOrDieTimeText.anchor.x = 0.5;
//     this.doOrDieTimeText.anchor.y = 0;
//        this.doOrDieTimeText.position.x = window.innerWidth/2;
//         this.doOrDieTimeText.position.y = window.innerHeight/20;
       

//         this.matchTimeRemaining = new PIXI.Text("0s", {
//             stroke: 0x111111,
//             strokeThickness: 4,
//             fontFamily: 'Do Hyeon',
//             fill: 0xffffff,
//             fontSize: 20,
//             fontWeight:'bold'
//         });
//         var circle = new P.Graphics();
//         circle.beginFill(0x000000,1);
//         circle.drawCircle(0,0,2);
//         circle.endFill();
//         var rect = new P.Graphics();
//         rect.beginFill(0x333333,1);
//         rect.drawRect(0,0,12,2);
//         rect.endFill();
//         var rect2 = new P.Graphics();
//         rect2.beginFill(0x11111,1);
//         rect2.drawRect(0,0,9,3);
//         rect2.endFill();
        
//         this.secHand =new P.Sprite(rect.generateCanvasTexture());
//         this.minHand =new P.Sprite(rect2.generateCanvasTexture());
//         this.secHand.rotation = 0;
//         this.minHand.rotation = Math.PI/2;
//         var tex = circle.generateCanvasTexture();
//         var cSpr1 = new P.Sprite(tex);
//         var cSpr2 = new P.Sprite(tex);
//         var cSpr3 = new P.Sprite(tex);
//         var cSpr4 = new P.Sprite(tex);
//         var cSpr5 = new P.Sprite(tex);
//         this.secHand.anchor.x = this.minHand.anchor.x = 0;
//         this.secHand.anchor.y = this.minHand.anchor.y =  0.5;
//         cSpr1.anchor.x = cSpr2.anchor.x = cSpr3.anchor.x= cSpr4.anchor.x = cSpr5.anchor.x =0.5;
//         cSpr1.anchor.y = cSpr2.anchor.y = cSpr3.anchor.y= cSpr4.anchor.y =cSpr5.anchor.y = 0.5;
//         var clock = new P.Graphics();
//         clock.beginFill(0xffff00, 1);
//         clock.lineStyle(1, 0x444444, 1);
//         clock.drawCircle(0, 0, size);
//         clock.endFill();
//         var ClockTop = new P.Graphics();
//         ClockTop.beginFill(0xdddddd,1);
//         ClockTop.lineStyle(1, 0x444444, 0.5);
//         ClockTop.drawCircle(0, 0, size-4);
//         ClockTop.endFill();
//         var texFill = ClockTop.generateCanvasTexture();
//         var texFrame = clock.generateCanvasTexture();
//         this.clockMainSprite = new P.Sprite(texFrame);
//         var spriteFill = new P.Sprite(texFill);

//         this.matchTimeRemaining.anchor.x = 0;
//         this.matchTimeRemaining.anchor.y = 0.5;
//         this.clockMainSprite.anchor.x = 0.5;
//         this.clockMainSprite.anchor.y = 0.5;
//         spriteFill.anchor.x = 0.5;
//         spriteFill.anchor.y = 0.5;
//          this.clockMainSprite.position.x = size+10;
//        this.matchTimeRemaining.position.y = this.clockMainSprite.position.y = size+10;
//         this.matchTimeRemaining.position.x = size + 10 + this.clockMainSprite.width/2 + 10;
//         cSpr1.position.y = cSpr2.position.y = 0;
//         cSpr3.position.x = cSpr4.position.x =  0;
//         cSpr1.position.x = -size/2 - 3;
//         cSpr2.position.x = size/2 + 3;
//         cSpr3.position.y = -size/2 - 3;
//         cSpr4.position.y = size/2 + 3;

//         this.clockMainSprite.addChild(spriteFill);
//         this.clockMainSprite.addChild(cSpr1);
//         this.clockMainSprite.addChild(cSpr2);
//         this.clockMainSprite.addChild(cSpr3);
//         this.clockMainSprite.addChild(cSpr4);
//         this.clockMainSprite.addChild(cSpr5);
//         this.clockMainSprite.addChild(this.secHand,this.minHand);
//         this.clockMainSprite.alpha = 1;
//         spriteFill.alpha = 1;
//         this.clockMainSprite.displayGroup = layer;
//         this.matchTimeRemaining.displayGroup = layer;
//         this.doOrDieTimeText.displayGroup = layer;
//         stage.addChild(this.clockMainSprite,this.matchTimeRemaining,this.doOrDieTimeText);
//         this.doOrDieTimeText.visible = false;
        
//     };

// };
// TimerBar.prototype.hideShow = function (val) {
//     this.clockMainSprite.visible = val;
// };
// TimerBar.prototype.backToGame = function(){
//     this.doOrDieTimeText.text = '';
//     this.doOrDieTimeText.visible = false;
//     this.matchOn = true;
//     this.clockMainSprite.visible = true;

// };

// TimerBar.prototype.matchGoingOn = function(time,TW,tweenTime){
//     var m = pad(Math.floor(time/60),2);
//     var s = pad(time%60,2);
//     if(time<=10){
//         this.matchOn = false;
//         this.matchTimeRemaining.text = '';
//         this.lastSeconds(time,TW,tweenTime);
//     }else{
//         this.clockMainSprite.visible = true;
//         this.matchOn = true;
//         this.matchTimeRemaining.text = '' + m + "m " + s + 's';
//     }
// };


// TimerBar.prototype.waitingForPlayers = function(time){
//     this.matchOn = false;
//     if( this.doOrDieTimeText.visible){
//         this.doOrDieTimeText.visible = false;
//         this.doOrDieTimeText.text = "";           
//     }
//     this.clockMainSprite.visible = false;
//     $('.next-match-time').show().text('Next match in ' + time + " seconds");
// };

// TimerBar.prototype.startNextMatch = function(){
//     console.log('starting next match');
//     return true;
// };


// TimerBar.prototype.lastSeconds = function(time,TW,tweenTime){
//     var self = this;
//     if(time<1){
//         this.doOrDieTimeText.text = 'Match Over';
//     }else{
//         this.doOrDieTimeText.text = '' + time;
//     }
//     this.doOrDieTimeText.visible = true;
//     this.clockMainSprite.visible = false;
//     this.matchTimeRemaining.vislble = false;
//     this.matchTimeRemaining.text='';
//     var from = window.innerHeight/20;
//     var to = window.innerHeight/12;
//     new TW.Tween({
//         x: 10,
//         y:0
//     })
//     .to({
//         x: to,
//         y: 1
//     }, 200)
//     .easing(TWEEN.Easing.Sinusoidal.Out)
//     .onUpdate(function () {
//         self.doOrDieTimeText.alpha= this.y;
//         self.doOrDieTimeText.position.y = this.x;
//     })
//     .onComplete(function () {
//         self.doOrDieTimeText.alpha= 1;
//         self.doOrDieTimeText.position.y = to;
//     })
//     .start(tweenTime);

// }


// TimerBar.prototype.update = function (dt) {
//     if(this.matchOn){
//         this.secHand.rotation += 0.03*dt;
//         this.minHand.rotation += 0.003*dt;    
//     }
   
// };

// module.exports = TimerBar;