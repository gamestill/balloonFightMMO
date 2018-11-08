var P = require('./pixinc.js');

var Zoomer = function () {
    this._zoomDirty = true;
    this._positionX = 0;
    this._positionY = 0;
    this._scaleX = 1;
    this._scaleY = 1;
    this.currentZoomLevel = 1;
    this._scaleCenterX = 0;
    this._scaleCenterY = 0;
    this._atSCTransform = new P.Matrix();
    this._zoomCenter = new P.Matrix();
    this._scaleTransform = new P.Matrix();
    this._negScaleCenter = new P.Matrix();
    this._transform = new P.Matrix();

    this._updateMatrix = function() {
        this._zoomCenter.set(1, 0, 0, 1, this._scaleCenterX, this._scaleCenterY); // Sets to translate
        this._scaleTransform.set(this._scaleX, 0, 0, this._scaleY, 0, 0); // Sets to scale
        this._negScaleCenter.set(1, 0, 0, 1, -this._scaleCenterX, -this._scaleCenterY); // Sets to translate
        this._atSCTransform.append(this._zoomCenter);
        this._atSCTransform.append(this._scaleTransform);
        this._atSCTransform.append(this._negScaleCenter);
        this._scaleX = 1;
        this._scaleY = 1;
        this._transform.set(
            this._atSCTransform.a, this._atSCTransform.b, this._atSCTransform.c, this._atSCTransform.d,
            this._atSCTransform.tx, this._atSCTransform.ty);
  
        this._transform.translate(this._positionX, this._positionY);
        this.currentZoomLevel = this._transform.a;
    }

    this.Transform = function () {
        if (this._zoomDirty) {
            this._updateMatrix();
            this._zoomDirty = false;
        }
        return this._transform;
    }

    this.setPosition = function (posX, posY) {
        this._positionX = +posX;
        this._positionY = +posY;
        this._zoomDirty = true;
    }

    this.positionX = function () {
        return +this._positionX;
    }

    this.positionY = function () {
        return this._positionY;
    }

    this.zoomBy = function (deltaX, deltaY) {
        this._scaleX += deltaX;
        this._scaleY += deltaY;
        this._zoomDirty = true;
    }
    this.getZoomLevel = function(){
      return this.currentZoomLevel;
    }
    this.translateBy = function (deltaX, deltaY) {
        this._positionX += deltaX;
        this._positionY += deltaY;
        this._zoomDirty = true;
    }

    this.absScale = function (newScale) {
        var scaleFactor = null;
        if (this._zoomDirty) {
            this._updateMatrix();
        }
        scaleFactor = newScale / this._atSCTransform.a;
        this._scaleX = scaleFactor;
        this._scaleY = scaleFactor;
        this._zoomDirty = true;
    }

    this.getScale = function () {
        return this._atSCTransform.a;
    }

    this.setScaleCenter = function (posX, posY) {
        this._scaleCenterX = posX;
        this._scaleCenterY = posY;
        this._zoomDirty = true;
    }

   
}

module.exports = Zoomer;