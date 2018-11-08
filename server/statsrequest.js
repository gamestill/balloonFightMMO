



var Conf = require('./gameConf.js');
var _head_origin = {
    "Content-type": "application/json"
};
var _head_local = {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
};

module.exports = function(app,redisHandler,STATUS){

    app.get('/info/stats', function (req, res, next) {
        if (redisHandler) {        
            redisHandler.getAllStatus(function(stats){
            if(stats){
                var datt = {
                    'data':stats
                };
                res.writeHead(200, _head_origin);
                res.end(JSON.stringify(datt)); 
                return;
            }else{
                res.sendStatus(400);
                return;
            } 
           });    
          
        }
        else{
            res.sendStatus(400);
            return;
        } 
    });
    
};