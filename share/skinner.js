var Conf = require('./gameConf.js');

var Skinner = function() {

    this.primus = null;
    this.unlockSkin = function(name) {
        if (this.primus) {
            this.primus.send("c.sk.p", name);
        }
    };

    this.init = function(primus) {
        this.primus = primus;
    };



};


module.exports = Skinner;