var Box = function () {
    this.x = x;
    this.y = y;
    this.node = null;
};

Box.prototype.setNode = function (node) {
  this.node = node;
    
};
module.exports = Box;