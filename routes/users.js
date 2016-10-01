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
	var options = {mode: 'text',pythonOptions: ['-u'],args: []};//set options argument for Python code
	var input_param = JSON.parse(req.params.jsonpythonAttachment);
	options.args.push(req.params.jsonpythonAttachment);//Push jsonrequest to the python code
	console.log('Inside Code'+options);
  //Make a call to python code
	PythonShell.run('splitpython.py', options, function (err, results) {
    if (err) throw err;
   // results is an array consisting of messages collected during execution
     console.log('results: %j', results);
  });//End of python code 

  conn.login(username, password, function(err, userInfo) {//Connect with salesforce to upload attachment
		if (err) { return console.error(err); }//throw error if login failed
		console.log(userInfo);//log userInfo from salesfore
		
		//start reading root directory to check the file extensions
		fs.readdir('./', function(err, files) {
			if (err) return;//throw upon exception
			files.forEach(function(f) {
			//Start iteration over files in the root to check if the file is a split
				console.log(f);
				if(f.indexOf('split.pdf')>=0)
				{
					//conn.sobject('DTPC_Document__c').create({ RecordTypeId: '012600000001FNTAA2' }, function(err, ret) {
						//Callback to create document record in salesforce org
						//if (err || !ret.success) { return console.error(err, ret); }
						//console log document id upon creation
						//console.log("Created record id : " + ret.id);
						var filename = f;
						fs.readFile(filename, function (err, filedata) {
						//Start of split file read and attachment upload
									if (err){
												console.error(err);
									}
									else{
												var title = filename.substring(0,filename.indexOf('_'));
												var targetId = filename.substring(filename.indexOf('_')+1,filename.indexOf('-'));
												console.log(filedata);//Upload attachment code
												var base64data = new Buffer(filedata).toString('base64');
												conn.sobject('Attachment').create({
													ParentId: targetId,
													Name : title,
													Body: base64data,
													ContentType : fileType,
												},
												//Throw an exception in case exception fails
												function(err, uploadedAttachment) {
														console.log(err,uploadedAttachment);
												});
									}
							//End of split file read and attachment upload
						});
						//Delete the split file from the root directory
						fs.unlink(filename, function(err){
							if (err) throw err;
							console.log(filename + " deleted.");
						});//End of Delete of splits
					//});//End of Document creation in salesforce
				};//End of condition on 'split.pdf'
			});//End of file forEach iteration
		});//End of readdir
	});//end of connection with salesforce
  res.send('respond with a resource');
});//end of route

module.exports = router;
