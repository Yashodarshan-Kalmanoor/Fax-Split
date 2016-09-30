var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');
var PythonShell = require('python-shell');
var username = 'mmunavarali@gso3.lly.deldev3';
var password = 'Ammijaan_5254';
var express = require('express');
var fs = require('fs');

var conn = new jsforce.Connection({
  oauth2 : {
    loginUrl : 'https://test.salesforce.com',
    clientId : '3MVG9AJuBE3rTYDhCDyqgMYgs4y.Yn8Q12_Q3qYBvnkKp0cBUKNQE7sR7YbdLu.8Y2G4iyIeERU9OUUgdZKKu',
    clientSecret : '8144004444641098751',
    redirectUri : 'http://localhost:3000/oauth/_callback'
  }
});

router.post('/node',function(req,res,next){
   //router.set('json_input',json_input);
   res.redirect('/node/'+req.body.requestparam);
});

/* GET home page. */
router.get('/node/:jsonAttachment', function(req, res, next) {
  console.log('....'+req.params.jsonAttachment);
  json_input = JSON.parse(req.params.jsonAttachment); 
  console.log('...123...'+json_input.attachmentId)
  conn.login(username, password, function(err, userInfo) {
  	if (err) { return console.error(err); }
    var fileOut = fs.createWriteStream(json_input.attachmentId + '.pdf');
		conn.sobject('Attachment').record(json_input.attachmentId).blob('Body').pipe(fileOut)
		.on('finish',function(){
      console.log('Done downloading the file.');
      res.redirect('/PythonShell/'+req.params.jsonAttachment);
    })
    .on('error', function(err){
			console.log('ERROR!!!');
    });
});	
});

module.exports = router;
