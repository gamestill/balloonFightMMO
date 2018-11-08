'use strict';

function QuadNode(bound, maxChildren, maxLevel, level, parent) {
    if (!level) level = 0;
    if (!parent) parent = null;
    var halfWidth = (bound.maxx - bound.minx) / 2;
    var halfHeight = (bound.maxy - bound.miny) / 2;
    
    this.level = level;
    this.parent = parent;
    this.bound = {
        minx: bound.minx, 
        miny: bound.miny,
        maxx: bound.maxx,
        maxy: bound.maxy,
        halfWidth: halfWidth,
        halfHeight: halfHeight,
        cx: bound.minx + halfWidth,
        cy: bound.miny + halfHeight
    };
    this.maxChildren = maxChildren;
    this.maxLevel = maxLevel;
    this.childNodes = null;
    this.items = [];
}

module.exports = QuadNode;

QuadNode.prototype.insert = function (item) {
 
    if (item._quadNode != null) {
        throw new TypeError("QuadNode.insert: cannot insert item which already belong to another QuadNode!");
    }
    if (this.childNodes !== null) {
        var quad = this.getQuad(item.bound);
        if (quad !== -1) {
            this.childNodes[quad].insert(item);
            return;
        }
    }
    this.items.push(item);
    item._quadNode = this;  // attached field, used for quick search quad node by item
    
    // check if rebalance needed
    if (this.childNodes !== null || this.level >= this.maxLevel || this.items.length < this.maxChildren)
        return;
    // split and rebalance current node
    var bound = this.bound;
    var b0 = { minx: bound.cx, miny: bound.miny, maxx: bound.maxx, maxy: bound.cy };
    var b1 = { minx: bound.minx, miny: bound.miny, maxx: bound.cx, maxy: bound.cy };
    var b2 = { minx: bound.minx, miny: bound.cy, maxx: bound.cx, maxy: bound.maxy };
    var b3 = { minx: bound.cx, miny: bound.cy, maxx: bound.maxx, maxy: bound.maxy };
    var qitem = null,quad = null;
    this.childNodes = [
        new QuadNode(b0, this.maxChildren, this.maxLevel, this.level + 1, this),
        new QuadNode(b1, this.maxChildren, this.maxLevel, this.level + 1, this),
        new QuadNode(b2, this.maxChildren, this.maxLevel, this.level + 1, this),
        new QuadNode(b3, this.maxChildren, this.maxLevel, this.level + 1, this)
    ];
    // rebalance
    for (var i = 0; i < this.items.length; ) {
         qitem = this.items[i];
         quad = this.getQuad(qitem.bound);
        if (quad !== -1) {
            this.items.splice(i, 1);
            qitem._quadNode = null;
            this.childNodes[quad].insert(qitem);
        }
        else i++;
    }
};

QuadNode.prototype.remove = function (item) {
    if (item._quadNode !== this) {
        item._quadNode.remove(item);
        return;
    }
    var index = this.items.indexOf(item);
    if (index < 0) {
        throw new TypeError("QuadNode.remove: item not found!");
    }
    this.items.splice(index, 1);
    item._quadNode = null;
    cleanup(this);
};

function cleanup (node) {
    if (node.parent==null || node.items.length > 0) return;
    if (node.childNodes !== null) {
        var child = null;
        for (var i = 0; i < node.childNodes.length; i++) {
            child = node.childNodes[i];
            if (child.childNodes !== null || child.items.length > 0)
                return;
        }
    }
    node.childNodes = null;
    cleanup(node.parent);
};

QuadNode.prototype.update = function (item) {
    var node = item._quadNode;
    if (node.parent == null || checkInsideBound(node.bound, item.bound)) {
        return;
    }
    node.remove(item);
    do {
        node = node.parent;
        if (checkInsideBound(node.bound, item.bound)) {
            break;
        }
    } while (node.parent != null);
    node.insert(item);
};

QuadNode.prototype.clear = function () {
    for (var i = 0; i < this.items.length; i++)
        this.items[i]._quadNode = null;
    this.items = [];
    if (this.childNodes != null) {
        for (var i = 0; i < this.childNodes.length; i++)
            this.childNodes[i].clear();
    }
    this.childNodes = null;
};

QuadNode.prototype.contains = function (item) {
    if (item._quadNode == null)
        return false;
    if (item._quadNode != this) {
        return item._quadNode.contains(item);
    }
    return this.items.indexOf(item) >= 0;
};

QuadNode.prototype.find = function (bound, callback) { 
    var item  = null;
    if (this.childNodes !== null) {
        var quad = this.getQuad(bound);
        if (quad !== -1) {
            this.childNodes[quad].find(bound, callback);
        } else {
            
            for (var i = 0; i < this.childNodes.length; i++) {
                var node = this.childNodes[i];
                if (!(bound.minx >= node.bound.maxx ||bound.maxx <= node.bound.minx ||bound.miny >= node.bound.maxy ||bound.maxy <= node.bound.miny))
                    node.find(bound, callback);
            }
        }
    }
    for (var i = 0; i < this.items.length; i++) {
        item = this.items[i];
        if (!(bound.minx >= item.bound.maxx ||bound.maxx <= item.bound.minx ||bound.miny >= item.bound.maxy ||bound.maxy <= item.bound.miny))
            callback(item);
    }
};

QuadNode.prototype.any = function (bound, predicate) {
    var item = null;
    if (this.childNodes !== null) {
        var quad = this.getQuad(bound);
        if (quad !== -1) {
            if (this.childNodes[quad].any(bound, predicate))
                return true;
        } else {
            for (var i = 0; i < this.childNodes.length; i++) {
                var node = this.childNodes[i];
                if (checkBoundIntersection(node.bound, bound))
                    if (node.any(bound, predicate))
                        return true;
            }
        }
    }
    for (var i = 0; i < this.items.length; i++) {
        item = this.items[i];
        if (checkBoundIntersection(item.bound, bound)) {
            if (predicate == null || predicate(item))
                return true;
        }
    }
    return false;
};

QuadNode.prototype.scanNodeCount = function () {
    var count = 0;
    if (this.childNodes !== null) {
        for (var i = 0; i < this.childNodes.length; i++) {
            count += this.childNodes[i].scanNodeCount();
        }
    }
    return 1 + count;
};

QuadNode.prototype.scanItemCount = function () {
    var count = 0;
    if (this.childNodes !== null) {
        for (var i = 0; i < this.childNodes.length; i++) {
            count += this.childNodes[i].scanItemCount();
        }
    }
    return this.items.length + count;
};

// Returns quadrant for the bound.
// Returns -1 if bound cannot completely fit within a child node
QuadNode.prototype.getQuad = function (bound) {
    var isTop = bound.miny < this.bound.cy && bound.maxy < this.bound.cy;
    var isLeft = bound.minx < this.bound.cx && bound.maxx < this.bound.cx;
    if (isLeft) {
        if (isTop) return 1;
        else if (bound.miny > this.bound.cy) return 2; // isBottom
    }
    else if (bound.minx > this.bound.cx) // isRight
    {
        if (isTop) return 0;
        else if (bound.miny > this.bound.cy) return 3; // isBottom
    }
    return -1;  // cannot fit (too large size)
};

function checkBoundIntersection(bound1, bound2) {
    return !(bound2.minx >= bound1.maxx ||bound2.maxx <= bound1.minx ||bound2.miny >= bound1.maxy ||bound2.maxy <= bound1.miny);
};

function checkInsideBound(outer, inner) {
    return inner.minx > outer.minx &&
        inner.miny > outer.miny &&
        inner.maxx < outer.maxx &&
        inner.maxy < outer.maxy;
};