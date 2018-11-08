  var express = require('express');
  var Conf = require('../server/gameConf.js');
  
  var bodyParser = require('body-parser');
  var request = require('request');
  var urlencodedParser = bodyParser.urlencoded({ extended: false });
  var pass = Conf.MongoConf.pass;
  var mongourl = Conf.MongoConf.mongourl;
  var __type = process.env.NODE_ENV || 'development';
  var _head_origin = Conf.MongoConf.res_header;
 



  module.exports = router;