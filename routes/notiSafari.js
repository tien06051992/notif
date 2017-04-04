var express = require('express');
var router = express.Router();
var cache = require('memory-cache');
var fs = require('fs');
var webpush = require('web-push');
var qs = require('querystring');
var redis = require("redis");

/* https://host/v1/pushPackages/[WebId]  */
router.get('/pushPackages/:WebId', function(req, res, next) {
    var path = __dirname + "/pushPackages.zip";
    
	if (fs.existsSync(path) == false) {
		res.writeHead(404);
		res.end();
		return;
	} 
	fs.readFile(path, function(error, data){
		res.writeHead(200, { 'Content-Type' : 'application/zip'});
		res.end(data);
	});
	return;
});

/* https://host/v1/log */
router.get('/log', function(req, res, next) {
  	console.log(req.headers);
	var body = '';
	req.on('data', function (data) {
		body += data;
	});
	req.on('end', function () {
		var POST = qs.parse(body);
		console.log(POST);

		res.writeHead(200);
		res.end();
	});
	return;	
});

/* https://host/v1/devices/[deviceToken]/registrations/[websitePushID] */
router.post('/devices/:deviceToken/registrations/:websitePushID', function(req, res, next) {
//router.get('/devices/registrations', function(req, res, next) {
	console.log(req);
   	var deviceToken = req.params.deviceToken;
	var webId = req.params.websitePushID;

	//add device into database				  	
  	var data = {
		tokens: [ deviceToken ],
		title: "Title",
		message: "Hello world",
		action: "View",
		"url-args": [""]
	};
	// var clientKey = 'USER_' + deviceToken;
	// var pushSubscription = cache.get(clientKey);
	

	// if (!pushSubscription) {
	//     res.json({ message: 'NO_ENDPOINT' })
	//     return;
	// }

	redisClient.publish("push", JSON.stringify(data));
	res.writeHead(200);
	res.end();
 	// var deviceToken = req.params.deviceToken || 'DEFAULT';
 	// res.json({ message: deviceToken });
	return;
});

module.exports = router;
