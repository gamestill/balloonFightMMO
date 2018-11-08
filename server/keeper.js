var apiSecret ="kXoBe3s2s2JhLUv4CptWdbNiojFo8hlN";
var http = require('http');
var crypto = require('crypto');


function handleRequest(request,response){
	var nonce = request.url.substring(1);
	var processed = crypto.createHMAC('SHA256',apiSecret).update(nonce).digest('base64');
	response.end(processed);
	console.log("vvvvv:" +processed);
}