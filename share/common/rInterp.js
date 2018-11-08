var BR = require('./BinaryReader.js');
var BW = require('./BinaryWriter.js');
var FMATH = require('./../fastmath.js');
var fMath = new FMATH();
var PI = Math.PI;
var TWO_PI = Math.PI * 2;
var DEF_UP = 100;
var MAX_STICK_TIME = 350;

var Interpolator = function () {
    this.SnapPosition = 0;
    this.SnapVelocity = 0;
    this.AimPos = 0;
    this.LastPackPos = 0;
    this.SnapTime = 0;
    this.AimTime = 0;
    this.Latency = 0;
    this.lastPx = 0;
    this.UpdateTime = DEF_UP;
    this.LastPacketTime = 0;
};
module.exports = Interpolator;

Interpolator.prototype.reset = function (pt, ct, ang) {
    this.LastPacketTime = pt;
    this.LastPackPos = this.SnapPosition = ang;
    this.SnapTime = ct;
    this.lastPx = 0;
    this.UpdateTime = DEF_UP;
    this.Latency = this.UpdateTime;
    this.AimTime = ct + this.UpdateTime;
    this.AimPos = this.SnapPosition + this.SnapVelocity * this.UpdateTime;
}

Interpolator.prototype.shortest = function(end,start){
return ((((end - start) % 360) + 540) % 360) - 180;
}

Interpolator.prototype.addSample = function (packetTime, currTime, p) {
    var dt = 0,
        snapRead = [],
        packDel = 1.0 / (packetTime - this.LastPacketTime);
    var px = p;
    if (Math.abs(packetTime - this.LastPacketTime) < 0.0001) {
        return null;
    }
    if (!this.Smooth(packetTime, currTime)) {
        return null;
    }
    this.LastPackPos = px;
    this.LastPacketTime = packetTime;
    snapRead = this.getAngle(currTime);
    this.SnapPosition = snapRead;
    this.AimTime = currTime + this.UpdateTime;
    this.SnapTime = currTime;
    this.AimPos = px;
    if ((Math.abs(this.AimTime - this.SnapTime) >= 0.0001)) {
        dt = 1 / (this.AimTime - this.SnapTime);
        this.SnapVelocity = (this.shortest(this.AimPos,this.SnapPosition)) * dt;
    } else {
        this.SnapVelocity = 0;
    }
}

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
}

Interpolator.prototype.getAngle = function (forTime) {
    var maxRange = this.AimTime + this.UpdateTime;
    forTime < this.SnapTime && (forTime = this.SnapTime);
    forTime > maxRange && (forTime = maxRange);
    var max = forTime - this.SnapTime;
    if(max>150){
        max = 0;
    }
    return this.SnapPosition + this.SnapVelocity * max;
}; 