var request = require('request');

// var jsonfile = require('jsonfile');
// var file = './mydetails.json';

var myOwnIpCached = '';
function clientDisc(data) {
    // var _reg = "",
    //     _serv = "";
    // if (myOwnIpCached === '') {
    //     var myipaddress = "";
    //     jsonfile.readFile(file, function (err, obj) {
    //         if (err) {

    //         } else {
    //             var data = obj;
    //             myipaddress = data['ip'];
    //             myOwnIpCached = myipaddress;
    //             request({
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                     },
    //                     uri: 'http://m.kark.io/info/disc',
    //                     body: JSON.stringify({
    //                         'ip': myipaddress

    //                     }),
    //                     method: 'POST'
    //                 },
    //                 function (err, res, body) {
    //                     if (res !== null && res !== undefined) {
    //                         if (res.statusCode == 200) {
    //                             console.log('cool disc');
    //                         }
    //                     }
    //                 });

    //         }

    //     });
    // }
    // //cached
    // else {
    //     request({
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             uri: 'http://kark.io/info/disc',
    //             body: JSON.stringify({
    //                 'ip': myOwnIpCached

    //             }),
    //             method: 'POST'
    //         },
    //         function (err, res, body) {
    //             if (res !== null && res !== undefined) {
    //                 if (res.statusCode == 200) {
    //                     console.log('cool disc');
    //                 }
    //             }
    //         });
    // }


}


module.exports = clientDisc;