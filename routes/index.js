var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');
var PythonShell = require('python-shell');
var username = 'syiqbal@zforce.com';
var password = 'syed0228HJWGjKjBAZdqM6OZqFgUIPvfN';
var express = require('express');
var json_input;
var fs = require('fs');

var conn = new jsforce.Connection({
  oauth2 : {
    clientId : '3MVG9A2kN3Bn17hsWsLDatw._IRRcBapWFgecAzRUqAny5.wuHmAMejzvV7ZhFlTg5ZPNdHBDjS18Zu0cvgeN',
    clientSecret : '3585278186716093184',
    redirectUri : 'http://localhost:3000/oauth/_callback'
  }
});

router.post('/node',function(req,res,next){
   var Attachment = req.body.requestparam;
   json_input = JSON.parse(Attachment);
   //router.set('json_input',json_input);
   global.query = req.body.requestparam;//set the app local variable
   res.redirect('/node/'+json_input.attachmentId);
});

/* GET home page. */
router.get('/node/:Attachmentid', function(req, res, next) {
  console.log('....'+req.params.Attachmentid);
  conn.login(username, password, function(err, userInfo) {
  	if (err) { return console.error(err); }
    var fileOut = fs.createWriteStream(req.params.Attachmentid + '.pdf');
		conn.sobject('Attachment').record(req.params.Attachmentid).blob('Body').pipe(fileOut)
		.on('finish',function(){
      console.log('Done downloading the file.');
      res.redirect('/PythonShell/'+req.params.Attachmentid);
    })
    .on('error', function(err){
			console.log('ERROR!!!');
    });
});	
});

module.exports = router;
