var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell');
var jsforce = require('jsforce');
var express = require('express');
var fs = require('fs');
var username = 'syiqbal@zforce.com';
var password = 'syed0228HJWGjKjBAZdqM6OZqFgUIPvfN';
var fileType = 'application/pdf';
var conn = new jsforce.Connection({
  oauth2 : {
    clientId : '3MVG9A2kN3Bn17hsWsLDatw._IRRcBapWFgecAzRUqAny5.wuHmAMejzvV7ZhFlTg5ZPNdHBDjS18Zu0cvgeN',
    clientSecret : '3585278186716093184',
    redirectUri : 'http://localhost:3000/oauth/_callback'
  }
});

var options = {
  mode: 'text',
  //pythonPath: 'path/to/python',
  pythonOptions: ['-u'],
  //scriptPath: 'path/to/my/scripts',
  args: ['SPIE.pdf']
};



/* GET users listing. */
router.get('/', function(req, res) {
  console.log('Inside Code');
  PythonShell.run('splitpython.py', options, function (err, results) {
    if (err) throw err;
   // results is an array consisting of messages collected during execution
     console.log('results: %j', results);
     }); 

  conn.login(username, password, function(err, userInfo) {
		  	if (err) { return console.error(err); }
			console.log(userInfo);
  
	fs.readdir('./', function(err, files) {
		if (err) return;
			files.forEach(function(f) {
        console.log(f);
	if(f.indexOf('.pdf')>=0)
	{
		var filename = f;
	fs.readFile(filename, function (err, filedata) {
	    if (err){
	        console.error(err);
	    }
	    else{
			console.log(filedata);
	        var base64data = new Buffer(filedata).toString('base64');
	        conn.sobject('Attachment').create({
	                ParentId: '0012800000sDDgP',
	                Name : filename,
	                Body: base64data,
	                ContentType : fileType,
	            },
	            function(err, uploadedAttachment) {
	                console.log(err,uploadedAttachment);
	        });
	}
	});
    fs.unlink(filename, function(err){
               if (err) throw err;
               console.log(filename + " deleted");
          });
  };
	});
	});
	});
  res.send('respond with a resource');
});

module.exports = router;
