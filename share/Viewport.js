var Conf = require('./gameConf.js');

var Viewport = function (cl,TWEEN, renderer, width, height, stage, target) {
    this.renderer = renderer;
    this.Tween = TWEEN;
    this.cl = cl;
    this.ws = Conf.worldSize;
    this.stage = stage || renderer.stage;
    this.stage.rotation = 0;
    this.target = target;
    this.manualZoom = 1;
    this.zoom = 1;
    this.pending = [];
    this.fromX = 0;
    this.fromY = 0;
    this.shaking = false;
    this.shakeTime = 0;
    this.toY = 0;
    this.toX = 0;


    this.zoomToCurrent = function () {
        this.zoomTo(this.renderer.width / this.zoom, this.renderer.height / this.zoom);
    };
    this.zoomToMax = function () {
        this.zoomTo(this.renderer.width / Conf.CAM_MAX_ZOOM, this.renderer.height / Conf.CAM_MAX_ZOOM);

    }

    this.recalculate = function () {
        this.screenToViewRatio = this._width / this.renderer.width;
        this.viewToScreenRatio = this.renderer.width / this._width;
        this.screenRatio = this.renderer.height / this.renderer.width;
        this.stage.scale.set(this.viewToScreenRatio);
        this.stage.pivot.set(this.center.x, this.center.y);
        this.stage.position.set(this._width / 2 * this.stage.scale.x, this._height / 2 * this.stage.scale.y);
        this.topLeft = {
            x: this.center.x - this._width / 2,
            y: this.center.y - this._height / 2
        };
        this.AABB = [this.topLeft.x, this.topLeft.y, this.topLeft.x + this._width, this.topLeft.y + this._height];
        this.bounds = {
            x: this.topLeft.x,
            y: this.topLeft.y,
            width: this._width,
            height: this._height
        };
    }
    this.view = function (width, height, center) {
        if (width !== 0) {
            this._width = width;
            this._height = (width * this.renderer.height) / this.renderer.width;
        } else {
            this._height = height;
            this._width = (height * this.renderer.width) / this.renderer.height;
        }
        if (center) {
            this.center.x = center.x;
            this.center.y = center.y;
        }
        this.recalculate();
    }

    if (width) {
        this.center = {
            x: width / 2,
            y: height / 2
        };
        this.view(width, height);
    } else {
        this.center = {
            x: 0,
            y: 0
        };
    }

    this.move = function (deltaX, deltaY) {
        this.center.x += deltaX;
        this.center.y += deltaY;
        this.recalculate();
    }


    this.moveTo = function (x, y) {
        if (arguments.length === 1) {
            this.center.x = arguments[0].x;
            this.center.y = arguments[0].y;
        } else {
            this.center.x = x;
            this.center.y = y;
        }
        this.recalculate();
    };

    this.moveTopLeft = function (x, y) {
        this.center.x = x + this._width / 2;
        this.center.y = y + this._height / 2;
        this.recalculate();
    };

    this.zoomTo = function (zoomLevel, center) {
        var zoomX =this.renderer.width ;
        var zoomY =this.renderer.height;
        this._width = zoomX || zoomY / this.screenRatio;
        this._height = zoomY || zoomX * this.screenRatio;
        if (center) {
            this.center.x = center.x;
            this.center.y = center.y;
        }
        this.recalculate();
        this.manualZoom = this.renderer.width / this._width;
    };

    this.zoomToFit = function (width, height, center) {
        if (width > height / this.screenRatio) {
            this._width = width;
            this._height = width * this.screenRatio;

        } else {
            this._height = height;
            this._width = height / this.screenRatio;
        }
        if (center) {
            this.center.x = center.x;
            this.center.y = center.y;
        }
        this.recalculate();
    };


    this.resize = function () {
        this.view(this.renderer.width, 0);
        this.zoomTo(this._width, this._height);
    };

    this.zoomTween = function (ele) {      
    };
    this.shake = function(time,int){
        this.shakeInt = int || 9;
        this.shaking = true;
        this.shakeTime = time;

    }
    ///////////////
    this.zoomPercent = function (time, percent, center, auto) {
       
    };
    //////////////
    this.fitX = function () {
        this.view(this.stage.width, 0);
    };

    this.fitY = function () {
        this.view(0, this.stage.height);
    }

    this.it = function () {
        if (this.stage.width / this.stage.height > this.renderer.width / this.renderer.height) {
            this.fitX();
        } else {
            this.fitY();
        }
    }

    this.heightTo = function (height) {
        this.view(0, height, this.center);
    }

    this.toWorldFromScreen = function () {
        var screen = {};
        var x = 0,
            y = 0;
        var rotatedX = 0,
            rotatedY = 0;
        if (arguments.length === 1) {
            screen.x = arguments[0].x;
            screen.y = arguments[0].y;
        } else {
            screen.x = arguments[0];
            screen.y = arguments[1];
        }

        if (this.stage.rotation) {
            x = (screen.x - this.renderer.width / 2) * this.screenToViewRatio;
            y = (screen.y - this.renderer.height / 2) * this.screenToViewRatio;
            rotatedX = x * this.cos + y * this.sin;
            rotatedY = y * this.cos - x * this.sin;
            return {
                x: rotatedX + this.center.x,
                y: rotatedY + this.center.y
            };
        } else {
            x = this.center.x + (screen.x - this.renderer.width / 2) * this.screenToViewRatio;
            y = this.center.y + (screen.y - this.renderer.height / 2) * this.screenToViewRatio;
            return [x, y];
        }
    }

    this.toScreenFromWorld = function (world) {
        if (this.stage.rotation) {
            var x = world.x - this.center.x;
            var y = world.y - this.center.y;
            var rotatedX = x * this.cos - y * this.sin;
            var rotatedY = y * this.cos + x * this.sin;
            return {
                x: (rotatedX + this._width / 2) * this.viewToScreenRatio,
                y: (rotatedY + this._height / 2) * this.viewToScreenRatio
            };
        }
        return {
            x: (world.x - this.center.x + this._width / 2) * this.viewToScreenRatio,
            y: (world.y - this.center.y + this._height / 2) * this.viewToScreenRatio
        };
    }

    this.toScreenSize = function (original) {
        return original * this.viewToScreenRatio;
    }

    this.toWorldSize = function (original) {
        return original * this.screenToViewRatio;
    }


    this.screenHeightInWorld = function () {
        return this.toWorldSize(this.renderer.height);
    }

    this.screenWidthInWorld = function () {
        return this.toWorldSize(this.renderer.width);
    }
    this.zoomPinch = function (x, y, amount, min, max, center) {
        var change = amount + this._width;
        var ret = [];
        change = (change < min) ? min : change;
        change = (change > max) ? max : change;
        var deltaX, deltaY;
        if (center) {
            ret = this.toWorldFromScreen(center);
            this.center.x = ret[0];
            this.center.y = ret[1];
            deltaX = (this.renderer.width / 2 - x) / this.renderer.width;
            deltaY = (this.renderer.height / 2 - y) / this.renderer.height;
        }
        this._width = change;
        this._height = change * this.screenRatio;
        if (center) {
            this.center.x += this._width * deltaX;
            this.center.y += this._height * deltaY;
        }
        this.recalculate();
    }

    this.screenXtoY = function (x) {
        return x * this.renderer.height / this.renderer.width;
    }

    this.screenYtoX = function (y) {
        return y * this.renderer.width / this.renderer.height;
    }

    this.scaleGet = function () {
        return this.stage.scale.x;
    }
    this.update = function (dt) {
        var my = window.innerWidth/4;
        if(this.shaking){
            this.shakeTime-= dt;
            if(this.shakeTime<=0){
                this.shaking = false;
                this.shakeTime = 0;
            }
            var _x = this.target.x - this.shakeInt + Math.random()*this.shakeInt*2;
            var _y = Math.min(this.ws - my ,this.target.y)- this.shakeInt + Math.random()*this.shakeInt*2;
            this.moveTo(_x, _y);
            return;
        }
        var maxy = Math.min(this.ws - my,this.target.y);
        this.moveTo(this.target.x,maxy);
    };
}


Object.defineProperties(Viewport.prototype, {

    width: {
        get: function () {

            return this._width;
        },

        set: function (value) {

            this._width = value;
            this.recalculate();
        }
    },
    height: {
        get height() {
            return this._height;
        },
        set height(value) {
            this._height = value;
            this.recalculate();
        }

    },
    rotation: {
        get rotation() {
            return this.stage.rotation;
        },
        set rotation(value) {
            this.stage.rotation = value;
            this.cos = Math.cos(value);
            this.sin = Math.sin(value);
            this.recalculate();
        }

    },
    y: {
        get y() {
            return this.center.y;
        },
        set y(value) {
            this.center.y = value;
            this.recalculate();
        }
    },
    x: {
        get x() {
            console.log(this);
            return this.center.x;
        },
        set x(value) {
            this.center.x = value;
            this.recalculate();
        }
    }
});

module.exports = Viewport;