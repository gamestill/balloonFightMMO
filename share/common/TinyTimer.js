var TTimer = function (val, func, repeat,param,silence) {
    this.val = 0;
    this.param = param;
    this.max = val;
    this.repeat = repeat;
    this.silence = silence;
    this.func = func;
    this.handle = null;
   
}
TTimer.prototype.updateTime = function (handleVal) {
    this.max = handleVal;
};
TTimer.prototype.resetTimerReset = function(){
    this.val = 0;
}
TTimer.prototype.update = function (dt) {
    this.val += dt;
    if (this.val >= this.max) {
        return 1;
    }
    return 0;
}

var TinyTimers = function () {
    this.timers = [];
    this.handleVal = 0;
    this.totalTime = 0;
    this.addResetTimer = function(val,cb){
        var t = new TTimer(val, cb,false,null,true);
        this.timers.push(t);
        t.handle = ++this.handleVal;
        return t;
    };
    this.resetTimer = function(timer){
        if(!timer){
            console.log('timer not found');
        }
        timer.resetTimerReset();
    }

    this.addTimer = function (val, cb,repeat, param) {
        var t = new TTimer(val, cb,repeat,param);
        this.timers.push(t);
        t.handle = ++this.handleVal;
        return t;
    }
    this.updateTimerVal = function (timer, val) {
       if(!timer){
           return false;
       }
        if (this.timers.indexOf(timer) >= 0) {
            timer.updateTime(val);
            return true;
        }
        return false;
    };
    this.getHandle = function(timer){
        if(timer){
            return timer.handle;
        }
        return null;
    }
    this.nullTimer = function(timer){
        timer.func = null;
        timer.val = null;
        timer.param = null;
        timer.max = null;
        timer.repeat = null;
        timer.silence = null;
        timer.handle = null;
    };
    this.removeAll = function(){
        if(this.timers.length>0){
            while(this.timers.length>0){
                this.nullTimer(this.timers[0]);
                this.timers.splice(0, 1);
            }
            this.timers = [];
        }
    };
    this.removeTimer = function(timer){
        if(timer){
            var index = -1;
            for (var i = 0; i < this.timers.length; i++) {
                if (timer === this.timers[i]) {
                    index = i;
                    this.nullTimer(this.timers[i]);
                    break;
                }
            }

            this.timers.splice(index, 1);
        }
    }
    this.removeTimerByHandle = function (handle) {
        var index = -1;
        for (var i = 0; i < this.timers.length; i++) {
            if (handle === this.timers[i].handle) {
                this.nullTimer(this.timers[i]);
                index = i;
                break;
            }
        }
        this.timers.splice(index, 1);
    };
    this.update = function (dt) {
        var tt = null;
        this.totalTime +=dt;
        for (var i = 0; i < this.timers.length; i++) {
            tt = this.timers[i];
            if (tt.update(dt)) {
                tt.func(tt.param);
                if(tt.repeat){
                    tt.val = 0;
                }else{
                    tt = undefined;
                    this.timers.splice(i, 1);
                }
            }
        }
    };

};

module.exports = TinyTimers;