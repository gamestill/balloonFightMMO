var P = require('./pixinc.js');
var MAIN_UI_Container = '.all_sections';
var MAIN_SHOP_BTN = '.mm-sett-quests';

var Quests = function(app, stage, tweenEngine, width, height){
    $('.mm-sett-quests').show();
    this.tweenEngine = tweenEngine;
    this.questsVisible = false;
    this.container = new P.Container();
    this.container.pivot.x = this.container.pivot.y = 0.5;
    stage.addChild(this.container);

    
    this.runTween = function (options, cb, cb2) {
        var self = options[0];
        var ele = options[1];
        var from = options[2];
        var to = options[3];
        var time = options[4];
        var element = ele;
        if (!self.twRunning) {
            self.twRunning = new self.tweenEngine.Tween({
                    x: from
                }) // Create a new tween that modifies 'coords'.
                .to({
                    x: to
                }, time) // Move to (300, 200) in 1 second.
                .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
                .onUpdate(function () {
                    cb(this);
                })
                .onComplete(function () {
                    self.twRunning = null;
                    cb2(self);
                })
                .start();
        }
    };
    this.init = function(){
        var self = this;
        // this.data = data;
        this.container.visible = false;
        var all_sec_height = $(MAIN_UI_Container).outerHeight(true);
        var top = $(MAIN_UI_Container).offset().top;
        this.uiTop = top;
        var total = Number(top + all_sec_height);
        this.uiHeight = all_sec_height - all_sec_height * 0.1;

        this.setClickEvent = function (thisptr, domEle, cb) {
            $('' + domEle).off('click').on('click', function (e) {
                cb(thisptr, e);
            });
        };

        
        this.setClickEvent(self, MAIN_SHOP_BTN, function (self, e) {
            e.stopPropagation();
            var ele = $(MAIN_UI_Container);
            self.questsVisible = true;
            var options = [self, ele, self.uiTop, -self.uiHeight, 1000];
            self.runTween(options,
                function ($this) {
                    ele.css({
                        top: $this.x + 'px'
                    });
                    ele.css({
                        top: $this.x + 'px'
                    });
                },
                function ($this) {

                });

            self.showQuests();
        });
    };

    Quests.prototype.showQuests = function(){
        console.log('showing quests');
    };
};


module.exports = Quests;