var os = require('os');


var Gameload = function(){
    this.getLoad = function(){
       return os.loadavg();
    };
};

module.exports = Gameload;