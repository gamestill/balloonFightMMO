var Conf = require('./gameConf.js');
var SAT = require('./sat.js');
var SV = SAT.Vector;
var SC = SAT.Circle;
var S_R = SAT.Response;
var SP = SAT.Polygon;
var CIC = SAT.testCircleCircle;
var PIC = SAT.pointInCircle;


var ColliderBox = function(x,y,COLL_RAD,type,pid,id){
    this.vec = new SV(0,0);
    this.collider = new SC(this.vec, COLL_RAD);
    this.type = type;
    this.pid = pid;
    this.id = id;
}

ColliderBox.prototype = {
    update : function(x,y){
        this.vec.x = x;
        this.vec.y = y;
        this.collider.pos = this.vec;
    },
    update_3:function(x,y,last){
        this.vec.x = x;
        this.vec.y = y;
        this.type = last ? Conf.ITEM_TYPES.WING_MAIN : Conf.ITEM_TYPES.WING_EXT;
    },
    updateNode_last: function(qt,last){
      
    },
    updateNode: function(qt){
        // qt.removeChild()

    },
    QTenclosed : function(xMin,yMin,xMax,yMax){
        var circle= this.collider;
        var x0 = circle.pos.x-circle.r, x1 = circle.pos.x+circle.r;
        var y0 = circle.pos.y-circle.r, y1 = circle.pos.y+circle.r;
        return x0 >= xMin && x1 <= xMax && y0 >= yMin && y1 <= yMax;
    },
    
    QToverlaps : function(xMin,yMin,xMax,yMax){
        var circle= this.collider;
        var x0 = circle.pos.x-circle.r, x1 = circle.pos.x+circle.r;
        var y0 = circle.pos.y-circle.r, y1 = circle.pos.y+circle.r;
		return !(x1 < xMin || x0 > xMax || y1 < yMin || y0 > yMax);
    },
    
    
    QTquadrantNode : function(node,x,y){
        var circle= this.collider;
        var x0 = circle.pos.x-circle.r, x1 = circle.pos.x+circle.r;
			if (x0 > x) {
                var y0 = circle.pos.y-circle.r, y1 = circle.pos.y+circle.r;
				if (y0 > y) {
					return node.q1;
				} else if (y1 < y) {
					return node.q4;
				} else {
					return null;
				}
			} else if (x1 < x) {
                var y0 = circle.pos.y-circle.r, y1 = circle.pos.y+circle.r;
				if (y0 > y) {
					return node.q2;
				} else if (y1 < y) {
					return node.q3;
				} else {
					return null;
				}
			} else {
				return null;
			}
    },
    
    QTsetParent : function(parent){
        this.QTparent = parent;
    },
    QTgetParent : function(parent){
       
    	return this.QTparent;
        var q = null;
    }
    

};

module.exports = ColliderBox;