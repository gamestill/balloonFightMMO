var Conf = require('./gameConf.js');
var request = require('request');
var mode = require('./../debugmode.js').mode;
var dbServer = '192.168.1.1';
var url = '';

var headSucc = {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*'
};
var headFail = {
    "Content-type": "application/json"
};

var port = require('./../debugmode.js').port;
if (mode == 'local') {
    url = 'http://localhost' + ':' + port + '/';
} else {
    url = 'http://' + dbServer + '/';
}

var REQ_TYPE = {
    'GET': 'GET',
    'POST': 'POST'
};

function sendRequest(type, urlpath, data, cb) {
    var options = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        url: urlpath,
        body: JSON.stringify(data),
        method: type
    };

    request(options, function (err, res, body) {
        var r = 3;
        if (res !== null && res !== undefined) {
            cb(res, body);
        } else if (err !== null || err !== undefined) {
            cb(null);
        }
    });
}

function userCheck(data) {
    data = data || '';
    if (data === '' || data.userid.length <= 1 || data.sid.length <= 1) {
        return [false, {
            "success": false
        }, 406, {
            "Content-type": "application/json"
        }];
    } else {
        var uid = data.sid,
            username = ('' + data.userid).substr(0, Math.min(35, data.userid.length));
        username = username.replace(/\s/g, '_');
        var playerid = '' + username.toLowerCase() + uid.substr(Math.max(0, uid.length - 4), Math.min(uid.length, 4));
        return [true, playerid];
    }
}
module.exports = function (app) {
    app.get('/ugingame',function(req,res){
        var path = url + 'ugingame_d',
        data = req['query'],
        playerid = '';
    var ret = userCheck(data);
    if (ret[0] === false) {
        res.writeHead(ret[2], ret[3]);
        res.end(JSON.stringify(ret[1]));
        return;
    }
    playerid = ret[1];
    var reqData = {
        'userid': data.userid,
        'sid': data.sid,
        'item':data.item
    };
    sendRequest(REQ_TYPE.POST, path, reqData, function (response) {
        response = response.body || '';
        if(response===''){
            var rr = {};
            res.writeHead(200,headSucc);
            res.end(JSON.stringify(rr));
            return;
        }

        if(response == 'Bad Request'){
            var rr = {};
            res.writeHead(200,headSucc);
            res.end(JSON.stringify(rr));
            return;
        }
        response = JSON.parse(response);
       if(response.success){
           res.writeHead(200, headSucc);            
       }
       else{
           res.writeHead(200,headSucc);
       }

       res.end(JSON.stringify(response) );


    });
    });

    app.get('/buyingame',function(req,res){
        var path = url + 'buyingame_d',
        data = req['query'],
        playerid = '';
    var ret = userCheck(data);
    if (ret[0] === false) {
        res.writeHead(ret[2], ret[3]);
        res.end(JSON.stringify(ret[1]));
        return;
    }
    playerid = ret[1];
    var reqData = {
        'userid': data.userid,
        'sid': data.sid,
        'item':data.item
    };
    sendRequest(REQ_TYPE.POST, path, reqData, function (response) {
        response = response.body || '';
        if(response===''){
            var rr = {};
            res.writeHead(200,headSucc);
            res.end(JSON.stringify(rr));
            return;
        }

        if(response == 'Bad Request'){
            var rr = {};
            res.writeHead(200,headSucc);
            res.end(JSON.stringify(rr));
            return;
        }
        response = JSON.parse(response);
       if(response.success){
           res.writeHead(200, headSucc);            
       }
       else{
           res.writeHead(200,headSucc);
       }

       res.end(JSON.stringify(response) );


    });
    });

    app.get('/reward', function (req, res) {
        var path = url + 'reward_d',
            data = req['query'],
            playerid = '';
        var ret = userCheck(data);
        if (ret[0] === false) {
            res.writeHead(ret[2], ret[3]);
            res.end(JSON.stringify(ret[1]));
            return;
        }
        playerid = ret[1];
        var reqData = {
            'userid': data.userid,
            'sid': data.sid
        };
        sendRequest(REQ_TYPE.POST, path, reqData, function (response) {
            response = response.body;
            if(response == 'Bad Request'){
                res.writeHead(400,headFail);
                res.end();
                return;
            }
            response = JSON.parse(response);
           if(response.success){
               res.writeHead(200, headSucc);            
           }
           else{
               res.writeHead(400,headFail);
               res.end();
           }

           res.end(JSON.stringify(response) );


        });
    });
    app.get('/login', function (req, res) {

        console.log('login req');
        res.writeHead(400,headFail);
        res.end();
        return;
        var path = url + 'login_d',
            data = req['query'],
            playerid = '';
        var ret = userCheck(data);
        if (ret[0] === false) {
            res.writeHead(ret[2], ret[3]);
            res.end(JSON.stringify(ret[1]));
            return;
        }
        playerid = ret[1];
        var reqData = {
            'userid': data.userid,
            'sid': data.sid,
            'tags':data.tags
        };
        sendRequest(REQ_TYPE.POST, path, reqData, function (response) {
         response = response.body;
         response = JSON.parse(response);
        if(response.success){
            res.writeHead(200, headSucc);            
            
        }
        else{
            res.writeHead(400,headFail);
            res.end();
        }
     
        res.end(JSON.stringify(response) );
        });
    });

    app.get('/addtag', function (req, res) {
        var path = url + 'addtag_d',
            data = req['query'],
            playerid = '';
        var ret = userCheck(data);
        if (ret[0] === false) {
            res.writeHead(ret[2], ret[3]);
            res.end(JSON.stringify(ret[1]));
            return;
        }
        playerid = ret[1];
        var reqData = {
            'userid': data.userid,
            'sid':data.sid,
            'tags':data.tags
        };
        sendRequest(REQ_TYPE.POST, path, reqData, function (res) {});
    });

    app.get('/deltag', function (req, res) {
        var path = url + 'deltag_d',
            data = req['query'],
            playerid = '';
        var ret = userCheck(data);
        if (ret[0] === false) {
            res.writeHead(ret[2], ret[3]);
            res.end(JSON.stringify(ret[1]));
            return;
        }
        playerid = ret[1];
        var reqData = {
            'pid': playerid
        };
        sendRequest(REQ_TYPE.POST, path, reqData, function (response) {
            response = response.body;
            response = JSON.parse(response);
            res.writeHead(200, headSucc);   
          
        
           res.end(JSON.stringify(response) );
        });
    });

    app.get('/tagsync', function (req, res) {
        var path = url + 'tagsync_d',
            data = req['query'],
            playerid = '';
        var ret = userCheck(data);
        if (ret[0] === false) {
            res.writeHead(ret[2], ret[3]);
            res.end(JSON.stringify(ret[1]));
            return;
        }
        playerid = ret[1];
        var reqData = {
            'userid': data.userid,
            'sid':data.sid,
            'tags':data.tags
        };
        sendRequest(REQ_TYPE.POST, path, reqData, function (response) {

            response = response.body;
            response = JSON.parse(response);
            res.writeHead(200, headSucc);   
          
        
           res.end(JSON.stringify(response) );

        });
    });

};