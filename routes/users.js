var express = require('express');
var router = express.Router();
var PythonShell = require('python-shell');
var jsforce = require('jsforce');
var express = require('express');
var fs = require('fs');
var username = 'mmunavarali@gso3.lly.deldev3';
var password = 'Ammijaan_5254';
var fileType = 'application/pdf';
var conn = new jsforce.Connection({
  oauth2 : {
		loginUrl : 'https://test.salesforce.com',
    clientId : '3MVG9AJuBE3rTYDhCDyqgMYgs4y.Yn8Q12_Q3qYBvnkKp0cBUKNQE7sR7YbdLu.8Y2G4iyIeERU9OUUgdZKKu',
    clientSecret : '8144004444641098751',
    redirectUri : 'http://localhost:3000/oauth/_callback'
  }
});
/* GET users listing. */
router.get('/PythonShell/:jsonpythonAttachment', function(req, res) {
	var options = {mode: 'text',pythonOptions: ['-u'],args: []};
	//var input_param = JSON.parse(req.query);
	options.args.push(req.params.jsonpythonAttachment);
	console.log('Inside Code'+options);
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
	if(f.indexOf('split.pdf')>=0)
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
	                ParentId: 'a1n4C000000Gmu8',
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
