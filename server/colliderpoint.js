
var SAT = require('./sat.js');
var SV = SAT.Vector;
var SC = SAT.Circle;
var S_R = SAT.Response;
var SP = SAT.Polygon;
var CIC = SAT.testCircleCircle;
var PIC = SAT.pointInCircle;


var ColliderPoint = function(vec){
    this.vec = vec;
    this.collider =vec;
}

ColliderPoint.prototype = {
    update : function(x,y,){
        this.vec.x = x;
        this.vec.y = y;
        this.collider.pos = this.vec;
    },
    QTenclosed : function(xMin,yMin,xMax,yMax){


        // bool
    },
    
    QToverlaps : function(xMin,yMin,xMax,yMax){
    
    
        //bool
    },
    
    
    QTquadrantNode : function(root,x,y){
    
        // number
    },
    
    QTsetParent : function(parent){
    
    },
    QTgetParent : function(parent){
    
    }
    

};

module.exports = ColliderPoint;