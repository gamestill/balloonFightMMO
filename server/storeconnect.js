var request = require('request');
function storeCurr(socket) {
    request({
            headers: {
                'User-Agent': 'xsolla-api-client/1.0',
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Host": "api.xsolla.com",
                "Authorization": "Basic " + btoa("31088" + ":" + "3doQmdgFnXNMhCne")
            },
            uri: 'https://api.xsolla.com/merchant/projects/21662/virtual_currency',
            method: 'GET'
        },
        function (err, res, body) {
            if (res !== null && res !== undefined) {
                if (res.statusCode == 200) {
                    console.log('sending packet PK_CURR');
                    socket.send(CODES.S_PK_CURR, JSON.parse(body));
                } else if (res.statusCode == 401) {
                    //unauthorized
                } else if (res.statusCode == 402) {
                    //req failed
                } else if (res.statusCode == 403) {
                    // forbidden not enuough permissions
                } else if (res.statusCode == 404) {
                    //not found - req item not found
                } else if (res.statusCode == 409 || res.statusCode == 422) {
                    //parameters not valid
                } else if (res.statusCode == 412) {
                    //precondition failed proj not activated
                } else if (res.statusCode == 415) {
                    //unsupported media type
                }
            } else if (err !== null || err !== undefined) {
                if (socket !== null || socket !== undefined)
                    socket.emit("storeconnerror", null);
            }
        });

}


function storeConnect(socket, userid) {
    request({
            headers: {
                'User-Agent': 'xsolla-api-client/1.0',
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Host": "api.xsolla.com",
                "Authorization": "Basic " + btoa("31088" + ":" + "3doQmdgFnXNMhCne")
            },
            uri: 'https://api.xsolla.com/merchant/merchants/31088/token',
            body: JSON.stringify({
                "user": {
                    "id": {
                        "value": "" + userid,
                        "hidden": true
                    }
                },
                "settings": {
                    "project_id": 21662,
                    "currency": "USD",
                    "mode": "sandbox"
                }
            }),
            method: 'POST'
        },
        function (err, res, body) {
            if (res !== null && res !== undefined) {
                if (res.statusCode == 200) {
                    console.log('sending packet PK_STR');
                    socket.send(CODES.S_PK_STR, JSON.parse(body));
                    storeCurr(socket);
                } else if (res.statusCode == 401) {
                    //unauthorized
                } else if (res.statusCode == 402) {
                    //req failed
                } else if (res.statusCode == 403) {
                    // forbidden not enuough permissions
                } else if (res.statusCode == 404) {
                    //not found - req item not found
                } else if (res.statusCode == 409 || res.statusCode == 422) {
                    //parameters not valid
                } else if (res.statusCode == 412) {
                    //precondition failed proj not activated
                } else if (res.statusCode == 415) {
                    //unsupported media type
                }
            } else if (err !== null || err !== undefined) {
                if (socket !== null || socket !== undefined)
                    socket.emit("storeconnerror", null);
            }
        });
}


module.exports = {
    storeConn: storeConnect
}