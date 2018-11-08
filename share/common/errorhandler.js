var ErrorHandler = function (TW,app) {
    var tw = TW;
    var MSG_TIME = 5000;
    var MSG_SPEED = 200;
    var MARGIN = 30;
    this.app = app;
    this.tout = null;
    this.tw = null;
    this.hideError = function () {
        var tt = this.app.appTime;
        var ele = $('#error-msg');
        var fx = -MARGIN;
        var sx = 0;
        new tw.Tween({
                x: sx
            }) // Create a new tween that modifies 'coords'.
            .to({
                x: fx
            }, MSG_SPEED) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
            .onUpdate(function () {
                ele.css(
                    "margin-top", this.x + 'px'
                );
            })
            .onComplete(function () {
                $('#error-msg .error-center .error-fail').text('');
                ele.hide();
            })
            .start(tt);
    };
    this.showBuyMsg = function (msg,clr) {
        var tt = this.app.appTime;
        var ele = $('#error-msg');
        var self = this;
        $('#error-msg .error-center .error-fail').text('' + msg);
        var sx = -MARGIN;
        var fx = 0;
        ele.show();
        new tw.Tween({
                x: sx
            }) // Create a new tween that modifies 'coords'.
            .to({
                x: fx
            }, MSG_SPEED) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
            .onUpdate(function () {
              
                ele.css(
                    "margin-top", this.x + 'px'
                );
            })
            .onComplete(function () {

            })
            .start(tt);
        setTimeout(function () {
            self.hideError();
        }, MSG_TIME);

    };
    this.showError = function (msg,clr) {
        var tt = this.app.appTime;
        if(this.tout){
            window.clearTimeout(this.tout);
            this.tout = null;
        }
        if(this.tw && this.tw.playing){
            this.tw.stop();
            this.tw = null;
        }
        var ele = $('#error-msg');
        var self = this;
        $('#error-msg .error-center .error-fail').text('' + msg);
        var sx = -MARGIN;
        var fx = 0;
        ele.show();
        this.tw = new tw.Tween({
                x: sx
            }) // Create a new tween that modifies 'coords'.
            .to({
                x: fx
            }, MSG_SPEED) // Move to (300, 200) in 1 second.
            .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
            .onUpdate(function () {
              
                ele.css(
                    "margin-top", this.x + 'px'
                );
            })
            .onComplete(function () {

            })
            .start(tt);
       this.tout = setTimeout(function () {
            self.hideError();
        }, MSG_TIME);

    };

};

module.exports = ErrorHandler;