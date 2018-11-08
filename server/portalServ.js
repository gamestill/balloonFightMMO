var PortalServ = function(pos, width, height, heal) {
    this.width = width;
    this.height = height;
    this.x = pos.x || 0;
    this.y = pos.y || 0;
    var maxHealth = 3;
    var level = 1;
    var health = maxHealth;
};


module.exports = PortalServ;