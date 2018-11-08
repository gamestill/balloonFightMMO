var Conf = require('./gameConf.js');

var GameTips= function(tween){
    this.TWEEN = tween;
    this.tips = Conf.GAME_TIPS;

    this.getHelpData = function() {
        var helpTemp = Soulcrashers.Templates.helptemp;
        var arr = {
            tips: []
        };
        for (var i = 0; i < this.tips.length; i++) {
            arr.tips.push({data:  this.tips[i]});
        }
        return helpTemp(arr);
    }
    this.update = (function () {
        var tipIndex = 0;
        var tipSize = this.tips.length;
        return (function (appTime) {
            var index = (tipIndex++) % tipSize;
            var tip = this.tips[index];
            var ele = $('.helpingsoul');
            var $this = this;
            new  this.TWEEN.Tween({
                    y: 1
                })
                .to({
                    y: 0
                }, 650)
                .easing(this.TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                    ele.css({
                        opacity: this.y
                    });
                })
                .onComplete(function () {
                    ele.text(tip);
                    new $this.TWEEN.Tween({
                            y: 0
                        })
                        .to({
                            y: 1
                        }, 250)
                        .easing($this.TWEEN.Easing.Quadratic.Out)
                        .onUpdate(function () {
                            ele.css({
                                opacity: this.y
                            });
                        })
                        .start(appTime);
                })
                .start(appTime);
        }).bind(this);
    }).bind(this)();

};


module.exports = GameTips;