var Rect = function (x,y,w,h) {
    this.x = x - w/2;
    this.y = y - h/2;
    this.w = w;
    this.h = h;
};

//non rotated rect
Rect.prototype.coll_RR = function (rect) {

}

Rect.prototype.updateRect = function(x,y,w,h){
    this.x = x - w/2;
    this.y = y - h/2;
    this.w = w;
    this.h = h;
}

// non rotated rect
Rect.prototype.coll_RP = function (point) {
    var px = point[0];
    var py = point[1];
    var sx = this.x-this.w/2;
    var sy = this.y - this.h/2;
    //coll    
    if ((px >= sx && px < (sx + this.w)) && (py >= sy && py < (sy + this.h))) {
        return true;
    }
    return false;
}


module.exports = Rect;