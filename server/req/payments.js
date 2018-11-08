var PAYMENT_SUCC = "/paymentsuccess";
var CommonDB = require('./commondb.js');
var karkio_xsolla_key = "r4GTl7ZfUZ2Bl3I4";
var DB_CONN = require('./../dbconnect.js');

module.exports = function(app) {

    function checkUserInDb(playerid, cb) {

        
        DB_CONN.DB_Connect(function(err, db) {
            if (err) {
                console.log('Unable to connect to server', err);
                return false;
            } else {
                console.log('connected to database');
                playerdataColl.findOne({
                    pid: {
                        $exists: true,
                        $eq: playerid
                    }
                }, function(err, result) {
                    if (err) {
                        datt = {
                            "success": false,
                            'message': '0'
                        };
                        return false;
                    } else {
                        var __data = result.pid || '';
                        if (__data !== '') {
                            cb(true);
                            return true;
                        } else {
                            return false;
                        }
                    }
                });
            }
        });
    }


    function paymentSucc(req, res, next, param) {
        var ind = 1 ? (param === true) : 0;
        var __header = req.headers;
        var expr = /^Signature ([0-9a-f]{40})$/g;
        var match = '';
        var clientStr = '';
        var servrStr = '';
        var shasum;
        var shastr = "";
        var bodyStr = JSON.stringify(req.body);
        if (req.body.notification_type === "user_validation") {
            if (ind > 0) {
                res.statusCode = 200;
                res.send({
                    "success": "user found"
                });
            } else {
                res.statusCode = 403;
                res.send({
                    "error": {
                        "code": "INVALID_USER",
                        "message": "user not found"
                    }
                });
            }
        } else if (req.body.notification_type === "payment") {
            auth = __header.authorization || '';
            match = expr.exec(auth);
            if (match.length >= 2) {
                clientStr = '' + match[1];
                shasum = crypto.createHash('sha1');
                shastr = "" + bodyStr + karkio_xsolla_key;
                serverStr = shasum.update(shastr).digest('hex');
                console.log('str' + serverStr);
            }
            if (auth !== '' && serverStr !== '' && serverStr === clientStr) {
                res.statusCode = 200;
                var cur_type = req.body.purchase.virtual_currency.name || '';
                var cur_amount = req.body.purchase.virtual_currency.quantity || '';
                var xsoll_curr = req.body.purchase.virtual_currency.total.currency || '';
                var xsoll_cost = req.body.purchase.virtual_currency.total.amount || '';
                var user_id = req.body.user.id || '';
                var trans_id = req.body.transaction.id || '';
                var trans_date = req.body.transaction.payment_date || '';
                var trans_method = req.body.transaction.payment_method || '';
                var user_curr = req.body.transaction.payment_details.currency || '';
                var user_curr = req.body.transaction.payment_details.amount || '';
                // INSERT THE PAYMENT INTO THE DATABASE....

                res.send();
            } else {
                res.statusCode = 403;
                res.send({
                    "error": {
                        "code": "INVALID_SIGNATURE"
                    }
                });
            }
        }
    }
    app.post(PAYMENT_SUCC, function(req, res, next) {
        var _data = req['query'] || '';
        if (_data !== '') {
            var _feedback = checkUserInDb(_data.id, paymentSucc.bind(this, req, res, next, param));
            if (feedback === false) {
                res.statusCode = 403;
                res.send({
                    "error": {
                        "code": "INVALID_USER",
                        "message": "user not found"
                    }
                });
            }
        } else {
            res.statusCode = 403;
            res.send({
                "error": {
                    "code": "INVALID_USER",
                    "message": "user not found"
                }
            });
        }
    });
    app.get('/thankyou', function(req, res, next) {
        //res.render('thankyou', { uid: req.user_id, status: req.status, invoiceid: req.invoiceid });
        res.statusCode = 200;
        var p1 = encodeURIComponent('331');
        var p2 = encodeURIComponent('222');
        var p3 = encodeURIComponent('boom');
        console.log('encoded:' + p1);
        return res.redirect(
            url.format({
                pathname: "/",
                query: {
                    "uid": p1,
                    "status": p2,
                    "invoiceid": p3
                }
            })
        );

    });


}