var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');
var PythonShell = require('python-shell');
var username = 'syiqbal@zforce.com';
var password = 'syed0228HJWGjKjBAZdqM6OZqFgUIPvfN';
var express = require('express');
var fs = require('fs');
var fileOut = fs.createWriteStream('SPIE.pdf') 
var conn = new jsforce.Connection({
  oauth2 : {
    clientId : '3MVG9A2kN3Bn17hsWsLDatw._IRRcBapWFgecAzRUqAny5.wuHmAMejzvV7ZhFlTg5ZPNdHBDjS18Zu0cvgeN',
    clientSecret : '3585278186716093184',
    redirectUri : 'http://localhost:3000/oauth/_callback'
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Syed' });
  conn.login(username, password, function(err, userInfo) {
  	if (err) { return console.error(err); }
		conn.sobject('Attachment').record('00P2800000CigFQ').blob('Body').pipe(fileOut)
		.on('finish',function(){
      console.log('Done downloading the file.');
      res.redirect('/PythonShell');
    })
    .on('error', function(err){
			console.log('ERROR!!!');
    });
});	
});

module.exports = router;
