// Implementation of Camera for the game @KARK.IO 
// (LOVE && PEACE)


var mmin = Math.min;
var mmax = Math.max;
var rrand = Math.random;
var shakeMult = 8;
var shakeMult2 = 4;
var Zoomer = require('./zoomer.js');
PIXI.utils.skipHello();
(function () {
    if (!navigator) {
        return;
    }
    var check = navigator.userAgent;

    if (check && check.toLowerCase().indexOf('chrome') > -1) {
        var args = ['\n \n %c %c KARK.IO ' + ' \u25B3 \u25B3 %c \u2665 \u2665 \u2665 %c \u25B3 \u25B3 ' + '%c' + '\n\n',
            'padding:6px;background-color:#af1212;font-size:18px',
            'padding:6px;color:white;background-color:#e65060;font-size:18px',
            'padding:6px;background-color:#af1212;color:white;font-size:18px',
            'padding:6px 4px;background-color:#08eb66;color:black;font-size:18px',
            'padding:6px 4px;background-color:#08eb66;color:blue;font-size:18px'
        ];
    //     var args = ['\n \n %c %c KARK.IO ' + '%c Version ' + window.gv + '%c HAVE FUN%c \u25B3 \u25B3 %c \u2665 \u2665 \u2665 %c \u25B3 \u25B3 ' + '%c' + '\n\n',
    //     'padding:6px;background-color:#af1212;font-size:18px',
    //     'padding:6px;color:white;background-color:#e65060;font-size:18px',
    //     'padding:6px;background-color:#af1212;color:white;font-size:18px',
    //     'padding:6px 4px;background-color:#08eb66;color:black;font-size:18px',
    //     'padding:6px 4px;background-color:#08eb66;color:blue;font-size:18px',
    //     'padding:6px 4px;background-color:#08eb66;color:red;font-size:18px',
    //     'padding:6px 4px;background-color:#08eb66;color:blue;font-size:18px',
    //     'padding:0px'
    // ];
        window.console.log.apply(console, args);
    } else if (window.console) {
        window.console.log('KARK.IO  VERSION - ' + window.gv);
    }

})();
var ZOOM = {
    'IN': 1,
    'OUT': -1
}
var Camera = function (world, width, height, target, tw) {
    PIXI.Container.call(this);
    this.TweenEngine = tw;
    this.world = world;
    this.zoomer = new Zoomer();
    this.zoomAmount = 1;
    this.sW = width;
    this.sH = height;
    this.baseW = width;
    this.baseH = height;
    this.zoomContainer = new PIXI.Container();
    this.zoomContainer.pivot.x = this.zoomContainer.pivot.y = 0.5;
    this.target = target;
    this.mask = new PIXI.Graphics();
    this.viewport = new PIXI.Rectangle(0, 0, width, height);
    this.bounded = false;
    this.updateMask();
    this.shaking = false;
    this.shakeTime = 0;
    this.shakeInt = 1;
    // hack to makee camera zoom
    this.world.transform._worldID = 2;
    // hack to makee camera zoom
    this.world.alpha = 1;
    this.zoomContainer.addChild(this.world);
    this.addChild(this.zoomContainer);

    // reset the camera
    this.reset = function () {
        this.zoomContainer.removeChild(this.world);
        this.removeChild(this.zoomContainer);
    };

};
Camera.prototype = Object.create(PIXI.Container.prototype);
Camera.prototype.resize = function (x, y) {
    this.sW = x;
    this.sH = y;
}

Camera.prototype.zoomCam = function (dir, amount, bySize) {
    var by = 0.1;
    if (amount) {
        by = amount;
    }
    if (bySize) {

    }
    var r = (dir > 0) ? this.zoomer.zoomBy(by, by) : this.zoomer.zoomBy(-by, -by);
    this._updateZoom();
};

Camera.prototype.zoomLevel = function () {
    return this.zoomer.currentZoomLevel;
}

Camera.prototype._updateZoom = function () {
    var t = this.zoomer.Transform();

    this.world.transform.localTransform.set(t.a, t.b, t.c, t.d, t.tx, t.ty);
    this.zoomContainer.transform.updateTransform(this.world.transform);
};
Camera.prototype.updateTarget = function (obj) {
    this.target = obj;
};

Camera.prototype.shakeOn = function (shakeInt,time) {
    this.shaking = true;
    this.shakeInt = shakeInt;
    this.shakeTime = time;
    if (!time) {
        this.shakeTime = 800;
    }
};

Camera.prototype.isShaking = function () {
    return this.shaking;
}

Camera.prototype.startZoomAni = function (px, py, from, to, time, tweenTime, lays, opacity, cb) {
    var self = this;
    this.zoomer.setScaleCenter(px, py);
    self.alpha = 1;
    self.alpha = 1;
    lays.css({
        opacity: 0
    });
    cb();
    // new TweenEngine.Tween({
    //         x: from,
    //         y: 1,
    //         z: 0,
    //         t: top
    //     })
    //     .to({
    //         x: to,
    //         y: 0,
    //         z: 1,
    //         t: top - 50
    //     }, time)
    //     .easing(TWEEN.Easing.Quadratic.Out)
    //     .onUpdate(function () {
    //         self.alpha = this.z;
    //         self.zoomer.absScale(this.x);
    //         self._updateZoom();
    //         lays.css({
    //             opacity: this.y
    //         });
    //         sections.css({
    //             top: this.t + 'px'
    //         });
    //     })
    //     .onComplete(function () {
    //       //  self.zoomer.absScale(1);
    //       //  self._updateZoom();
    //         self.alpha = 1;
    //         lays.css({
    //             opacity: 0
    //         });
    //         self.alpha = 1;
    //         lays.css({
    //             opacity: 0
    //         });
    //         sections.css({
    //             top: 0
    //         });
    //         cb();
    //     })
    //     .start(tweenTime);
};

Camera.prototype.stopShaking = function () {
    this.shaking = false;
}

Camera.prototype.update = function (dt) {
    var tx = this.target.x;
    var ty = this.target.y;
    if(this.shaking){
        tx += -this.shakeInt + Math.random()*2*this.shakeInt;
        ty += -this.shakeInt + Math.random()*2*this.shakeInt;
        this.shakeTime -=dt;
        if(this.shakeTime<=0){
            this.shaking = false;
        }
    }
    var pos = [(this.viewport.width / 2 - tx), (this.viewport.height / 2 - ty)];
    this.zoomContainer.position.set(pos[0], pos[1]);
    this.zoomer.setScaleCenter(tx,ty);
};

Camera.prototype.getPos = function () {
    return this.zoomContainer.position;
};


// update the mask if the viewport changes
Camera.prototype.updateMask = function () {
    this.mask.beginFill(0x00ff00, 1);
    this.mask.drawRect(0, 0, this.width, this.height);
    this.mask.endFill();
};

Object.defineProperties(Camera.prototype, {
    width: {
        get: function () {
            return this.viewport.width;
        },

        set: function (value) {
            this.viewport.width = value;
            this.updateMask();
            return this.viewport.width;
        }
    },

    height: {
        get: function () {
            return this.viewport.height;
        },

        set: function (value) {

            this.viewport.height = value;
            this.updateMask();
            return this.viewport.height;
        }
    }
});

module.exports = Camera;
