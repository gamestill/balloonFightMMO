var BR = require('./BinaryReader.js');
var BW = require('./BinaryWriter.js');
var FMATH = require('./../fastmath.js');
var fMath = new FMATH();
var PI = Math.PI;
var TWO_PI = Math.PI * 2;
var DEF_UP = 100;
var MAX_STICK_TIME = 350; // 
var Vec2D = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
}
var Interpolator = function (id) {
    this.id = id;
    this.SnapPosition = new Vec2D(0, 0);
    this.SnapVelocity = new Vec2D(0, 0);
    this.AimPos = new Vec2D(0, 0);
    this.LastPackPos = new Vec2D(0, 0);
    this.SnapTime = 0;
    this.AimTime = 0;
    this.Latency = 0;
    this.UpdateTime = DEF_UP;
    this.LastPacketTime = 0;
};

module.exports = Interpolator;

Interpolator.prototype.reset = function (pt, ct, pos) {
    this.LastPacketTime = pt;
    this.LastPackPos.x = this.SnapPosition.x = pos.x;
    this.LastPackPos.y = this.SnapPosition.y = pos.y;
    this.SnapTime = ct;
    this.UpdateTime = DEF_UP;
    this.Latency = this.UpdateTime;
    this.AimTime = ct + this.UpdateTime;

    this.AimPos.x = this.SnapPosition.x + this.SnapVelocity.x * this.UpdateTime;
    this.AimPos.y = this.SnapPosition.y + this.SnapVelocity.y * this.UpdateTime;
}

Interpolator.prototype.addSample = function (packetTime, currTime, px,py) {
    var dt = 0,
        snapRead = [],
        packDel = 1.0 / (packetTime - this.LastPacketTime);
        var MA = Math.abs;
    if (MA(packetTime - this.LastPacketTime) < 0.0001 || !this.Smooth(packetTime, currTime)) {
        return null; // neglect this sample
    }
    var _a = MA(px - this.LastPackPos.x);
    var _b = MA(py - this.LastPackPos.y);
    if(_a>300 || _b>300){
        this.SnapPosition.x = px;
        this.SnapPosition.y = py;
    }
    this.LastPackPos.x = px;
    this.LastPackPos.y = py;
    this.LastPacketTime = packetTime;
    snapRead = this.getPosition(currTime);
    this.SnapPosition.x = snapRead[0];
    this.SnapPosition.y = snapRead[1];
    this.AimTime = currTime + this.UpdateTime;
    this.SnapTime = currTime;
    this.AimPos.x = px;
    this.AimPos.y = py;
    if ((MA(this.AimTime - this.SnapTime) >= 0.0001)) {
        dt = 1 / (this.AimTime - this.SnapTime);
        this.SnapVelocity.x = (this.AimPos.x - this.SnapPosition.x) * dt;
        this.SnapVelocity.y = (this.AimPos.y - this.SnapPosition.y) * dt;
     }else{
        this.SnapVelocity.x =0;
        this.SnapVelocity.y = 0;
    }
 //   if(this.id>1){
   //     console.log('ass: up:' +  this.UpdateTime + ",  pt: " +  packetTime +", ct:" + currTime + ", ("+ this.SnapVelocity.x +"," + this.SnapVelocity.y +"), st: " + this.SnapTime +", at; " + this.AimTime +",(" + this.SnapPosition.x +"," + this.SnapPosition.y +")")
   // }
};

Interpolator.prototype.Smooth = function (packtime, currtime) {
    if (packtime <= this.LastPacketTime) {
        return false;
    }
    var lat = currtime - packtime;
    var tick = packtime - this.LastPacketTime;
    if(tick>MAX_STICK_TIME){
        this.LastPacketTime = packtime - 30;
        tick = 50;
    }
    lat < 0 && (lat = 0);
    this.Latency = (lat > this.Latency) ? ((this.Latency + lat) * 0.5) : ((this.Latency * 7 + lat) * 0.125);
    this.UpdateTime = (tick > this.UpdateTime) ? ((this.UpdateTime + tick) * 0.5) : ((this.UpdateTime * 7 + tick) * 0.125);
    return true;
};
Interpolator.prototype.phide = function(){
    // this.SnapVelocity.x = 0;
    //  this.SnapVelocity.y = 0;
    //  this.SnapPosition.x = this.SnapPosition.y = 0;
    //    this.AimPos.x = this.AimPos.y = 0;
    //    this.LastPackPos.x = this.LastPackPos.y = 0;
    //  this.SnapTime = 0;
    //  this.AimTime = 0;
    //  this.Latency = 0;
    //  this.UpdateTime = 0;
    //  this.LastPacketTime = 0;

};

Interpolator.prototype.getPosition = function (forTime,id) {
    var maxRange = this.AimTime + this.UpdateTime;
    forTime < this.SnapTime && (forTime = this.SnapTime);
    forTime > maxRange && (forTime = maxRange);
    var max = forTime - this.SnapTime;
    var getPos = [this.SnapPosition.x + this.SnapVelocity.x * max, this.SnapPosition.y + this.SnapVelocity.y * max];
    return getPos;
};