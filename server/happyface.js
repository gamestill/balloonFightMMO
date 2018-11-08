var Conf = require('./gameConf.js');
var HAPPY_RADIUS = 16;
var maxFaces = 20;
var ATTACK_SPEED = 400;
var BASE_SPEED = 320;
var SAT = require('./sat.js');
var CIC = SAT.testCircleCircle;
var PIC = SAT.pointInCircle;
var SV = SAT.Vector;
var SC = SAT.Circle;
var S_R = SAT.Response;
var FMath = require('./fastmath.js');
var fMath = new FMath();
var Face_States = {
    'sticky': 1,
    'attack': 2,
    'mom': 3
}
var HappyFace = function (pid, id, px, py) {
    HappyFace.prototype.MAX_COORD = Conf.WORLD_SIZE;
    this.pos = [px, py];
    this.radius = HAPPY_RADIUS;
    this.faceid = id;
    this.speed = BASE_SPEED;
    this.attackSpeed = ATTACK_SPEED;
    this.attackang = 1;
    this.state = Face_States.sticky;
    this.pid = pid;
    this.ballTime = BALL_TIME_PENETRATION;
    this.collideWithGod = true;
    this.canbeEaten = false;
    this.vel = [0, 0];
    this.node = null;
    this.collider = new SC(new SV(px, py), HAPPY_RADIUS);
    this.collidingWithPl = false;
};

HappyFace.prototype.collisionWithFace = function (face) {
    var dx = face.pos[0] - this.pos[0];
    var dy = face.pos[1] - this.pos[1];
    var dotPro = (face.vel[0] - this.vel[0]) * (dx) + (face.vel[1] - this.vel[1]) * (dy);
    if (dotPro <= 0) {
        var ang = fMath.ninjaAtan2(this.pos[1] - face.pos[1], this.pos[0] - face.pos[0]);
        this.pos[0] = Math.floor(face.pos[0] + (face.radius + HAPPY_RADIUS) * fMath.cos(ang));
        this.pos[1] = Math.floor(face.pos[1] + (face.radius + HAPPY_RADIUS) * fMath.sin(ang));
    }
};
HappyFace.prototype.longBound = function () {
    var pos = this.pos;
    var r = this.radius + 250;
    var bound = {
        minx: pos[0] - r,
        miny: pos[1] - r,
        maxx: pos[0] + r,
        maxy: pos[1] + r
    };
    return bound;
};


HappyFace.prototype.attack = function () {

};

HappyFace.prototype.collision = function (coll, pl) {
    // this.speed  = Math.min(FACE_MAX_SPEED, this.speed+ FACE_SPEED_INC_PER_COLL );
    //   this.ballTime  =  Math.min(BALL_TIME_PENETRATION, this.ballTime+0.1);
    //     var dotPro = (pl.vel[0] - this.vel[0])*(pl.position[0] - this.pos[0]) + ( pl.vel[1] - this.vel[1])*(pl.position[1] - this.pos[1]);
    //     if(dotPro<0){
    //         var ang = fMath.ninjaAtan2(this.pos[1] - pl.position[1], this.pos[0] - pl.position[0]);
    //         this.pos[0] = Math.floor(pl.position[0] + (pl.radius + HAPPY_RADIUS ) * fMath.cos(ang));
    //         this.pos[1] = Math.floor(pl.position[1] + (pl.radius + HAPPY_RADIUS ) * fMath.sin(ang));    
    //     }

}

HappyFace.prototype.changeDir = function (vx, vy, plpos) {
    this.attackang = fMath.ninjaAtan2(vy - plpos[1] + this.pos[1], vx + plpos[0] - this.pos[0]);
};

HappyFace.prototype.changeStateToMom = function (plpos) {
    this.state = Face_States.mom;
}
HappyFace.prototype.changeStateToSticky = function () {
    this.state = Face_States.sticky;

};
HappyFace.prototype.changeStateToAttack = function (vx, vy, plpos) {
    this.attackang = fMath.ninjaAtan2(vy - plpos[1] + this.pos[1], vx + plpos[0] - this.pos[0]);
    this.state = Face_States.attack;

};
HappyFace.prototype.moveAround = function (dt, speed, vx, vy, plpos) {
    this.speed = speed * 0.8;
    var ang = fMath.ninjaAtan2(vy - plpos[1] + this.pos[1], vx + plpos[0] - this.pos[0]);
    this.vel[0] = Math.floor(this.speed * Math.cos(ang));
    this.vel[1] = Math.floor(this.speed * Math.sin(-ang));
    this.pos[0] = this.pos[0] + this.vel[0] * dt;
    this.pos[1] = this.pos[1] + this.vel[1] * dt;
    return 0;
}

HappyFace.prototype.moveToMom = function (dt, speed, vx, vy, plpos) {
    this.speed = speed * 2;
    var ang = fMath.ninjaAtan2(-plpos[1] + this.pos[1], plpos[0] - this.pos[0]);
    this.vel[0] = Math.floor(this.speed * Math.cos(ang));
    this.vel[1] = Math.floor(this.speed * Math.sin(-ang));
    this.pos[0] = this.pos[0] + this.vel[0] * dt;
    this.pos[1] = this.pos[1] + this.vel[1] * dt;
    var d = (plpos[0] - this.pos[0]) * (plpos[0] - this.pos[0]) + (plpos[1] - this.pos[1]) * (plpos[1] - this.pos[1]);

    if (d < 10000) {
        this.changeStateToSticky();
        return [1, 0];
    }
    return [0, 0];
};
HappyFace.prototype.attackStateAction = function (dt, speed, vx, vy, plpos) {
    this.speed = this.attackSpeed;
    var ang = fMath.ninjaAtan2(vy - plpos[1] + this.pos[1], vx + plpos[0] - this.pos[0]);
    this.vel[0] = Math.floor(this.speed * Math.cos( ang));
    this.vel[1] = Math.floor(this.speed * Math.sin(- ang));
    this.pos[0] = this.pos[0] + this.vel[0] * dt;
    this.pos[1] = this.pos[1] + this.vel[1] * dt;
    return 1;
}

HappyFace.prototype.update = function (dt, vx, vy, speed, plpos) {
    var ret = [1, 0, 0];
    var r2 = [0, 0];
    if (this.ballTime > 0) {
        ret[0] = 0;
    }
    if (this.state === Face_States.sticky) {
        this.ballTime = Math.min(BALL_TIME_PENETRATION, this.ballTime + dt / 2);
        r2[1] = this.moveAround(dt, speed, vx, vy, plpos);
    } else if (this.state === Face_States.attack) {
        this.ballTime -= dt * 8;
        r2[1] = this.attackStateAction(dt, speed, vx, vy, plpos);
    } else {
        this.ballTime = Math.min(BALL_TIME_PENETRATION, this.ballTime + dt / 2);
        r2 = this.moveToMom(dt, speed, vx, vy, plpos)
    }
    return [ret[0], r2[0], r2[1]];
};

HappyFace.prototype.limit = function () {
    this.pos[0] = Math.max(0, Math.min(this.MAX_COORD, this.pos[0]));
    this.pos[1] = Math.max(0, Math.min(this.MAX_COORD, this.pos[1]));
    this.collider.pos.x = this.pos[0];
    this.collider.pos.y = this.pos[1];
};
var HappyFaceManager = function (radius,pid,pos) {
    this.fid = 1;
    this.faces = null;
    this.pid = pid;
    this.mouseCalled = false;
    this.toRemove = [];
    this.removeTime = 0;
    this.init = function () {

    };
    this.init();
};



HappyFaceManager.prototype.slowLoop = function (plpos,zw,zh) {
    var pos = null;
    if (this.faces) {
        pos = this.faces.pos;
        var qq = (plpos[0] - pos[0])*((plpos[0] - pos[0]))> (zw/2 *zw/2) || (plpos[1] - pos[1])*((plpos[1] - pos[1]))> (zh/2 *zh/2);
        if (qq || this.toRemove.length > 0) {
            this.faces = null;
            this.toRemove = [];
            this.removeTime = Date.now();
        }
    }

}
HappyFaceManager.prototype.collisionWithOtherPlayer = function (pl, id) {
    var face = this.faces;
    var coll = null;
    if (face) {
        if (face.state === Face_States.attack) {
            var coll = CIC(pl.collider, face.collider);
            coll && face.collision(coll, pl);
        }
    }
};
HappyFaceManager.prototype.getFace = function (oid, opid, id, pid) {
    if (this.faces && this.faces.id == id) {
        if (pid === opid && id === oid)
            return null;
        return this.faces;
    }
    return null;
};
HappyFaceManager.prototype.rightClick = function(){
   if(!this.faces){
       return true;
   }

    return true;
};
HappyFaceManager.prototype.rightClick_Up = function(){
    if(!this.faces){
        return;
    }
    this.faces.attackSpeed = ATTACK_SPEED;
};

HappyFaceManager.prototype.mouseUp = function (inp, plpos) {
    this.mouseCalled = false;
    if (!this.faces) {
        return;
    }
    var pos = this.faces.pos;
    var d = (plpos[0] - pos[0]) * (plpos[0] - pos[0]) + (plpos[1] - pos[1]) * (plpos[1] - pos[1]);
    if (d > 30000) {
        this.faces.changeStateToAttack(inp[1], inp[2], plpos);
        return false;
    }
    //else{
    //     this.faces.changeStateToSticky();   
    //     return true;   
    // }
};
HappyFaceManager.prototype.mouseDown = function (plpos) {
    if (!this.faces || this.faces.state === Face_States.sticky) {
        return;
    }

    !this.mouseCalled && this.faces.changeStateToMom(plpos);
    this.mouseCalled = true;

};
HappyFaceManager.prototype.addFace = function (pid, pos, inp) {
    if (!this.faces) {
        var can = true;
        if(this.removeTime>0){
            can = false;
            var now = Date.now() - this.removeTime;
            if(now>(Conf.TIME_GAP_BETWEEN_COMP*1000)){
                can = true;
            }
        }
        if(can){
            this.fid++;
            this.faces = new HappyFace(pid, this.fid, pos[0], pos[1]);    
        }
    } else {
         if (this.faces.state === Face_States.attack) {
            this.faces.changeDir(inp[1], inp[2], pos);
         }
        if (this.faces.state === Face_States.sticky) {
            this.faces.changeStateToAttack(inp[1], inp[2], pos);

        }
    }

    return null;
};

HappyFaceManager.prototype.updateNode = function (qt) {
    var face = this.faces;
    var pos = [];
    if (face && face.state === Face_States.attack) {
        pos = face.pos;
        if (face.node) {
            qt.remove(face.node);
        }
        face.node = {
            bound: {
                minx: pos[0] - face.radius,
                miny: pos[1] - face.radius,
                maxx: pos[0] + face.radius,
                maxy: pos[1] + face.radius
            },
            id: face.faceid,
            pid: face.pid,
            type: Conf.ITEM_TYPES.FACE
        };
        qt.insert(face.node);
        return;
    }
   else if(face && face.state!== Face_States.attack){
        face.node = null;
    }

};

HappyFaceManager.prototype.update = function (dt, vx, vy, speed, plpos) {
    if (this.faces) {
        var ret = this.faces.update(dt, vx, vy, speed, plpos);
        if(ret[0]){
            this.toRemove.push(this.faces.id);
        } 
        this.faces.limit();
        return [ret[1], ret[2]];
    }
    return [0, 0];
};

module.exports = HappyFaceManager;