var express = require('express');
var router = express.Router();
var jsforce = require('jsforce');
var PythonShell = require('python-shell');
var username = 'tesebastian@deloitte.com.zoetis';
var password = 'lilly_123%hItGS9lrM2U5BsQou0zFURIOR';
var express = require('express');
var fs = require('fs');
var fileType = 'application/pdf';
var conn = new jsforce.Connection({
  oauth2 : {
    loginUrl : 'https://login.salesforce.com',
    clientId : '3MVG9Y6d_Btp4xp5Hldq18v7NHdpuwcWnPyM7eYAbLoalL4bvRR3UlU18.U30QjX7SIWcjB_QE32F921uceZA',
    clientSecret : '5143407668392436662',
    redirectUri : 'http://localhost:3000/oauth/_callback'
  }
});

/* GET home page. */
router.post('/node', function(req, res, next) {
  console.log('....'+req.body.requestparam);
  var json_input = JSON.parse(req.body.requestparam); //parse json request coming from salesforce
  //console.log('...123...'+json_input.attachmentId)
  conn.login(username, password, function(err, userInfo) {//connect with salesforce
  	  if (err) { return console.error(err); }
      //create a new file with the name as Attachmentid.pdf where attachmentId is salesforce 18 digit id
      var fileOut = fs.createWriteStream(json_input.attachmentId + '.pdf');
		  conn.sobject('Attachment').record(json_input.attachmentId).blob('Body').pipe(fileOut)
		  .on('finish',function(){//upon write finish
          	//console.log('Done downloading the file.');
		    var options = {mode: 'text',pythonOptions: ['-u'],args: []};//set options argument for Python code
		  	options.args.push(req.body.requestparam);//Push jsonrequest to the python code
			PythonShell.run('splitpython.py', options, function (err, results) {
		    if (err) throw err;
				//console.log('End of Python split process...');
		   		callPythonShell(req.body.requestparam);
		  	});//End of python code 
          	
          	res.send('Process Complete');
      })
      .on('error', function(err){//upon write error
			    console.log('ERROR!!!');
         
      });
  });//end of connection	
});

function callPythonShell(jsonbody){
  	var json_input = JSON.parse(jsonbody); //parse json request coming from salesforce
  	var requiredsplits = json_input.pdftocreate;
	var parentdoc = json_input.parentdocid;
	//Make a call to python code
	conn.login(username, password, function(err, userInfo) {//Connect with salesforce to upload attachment
		if (err) { return console.error(err); }//throw error if login failed
		//console.log(userInfo);//log userInfo from salesfore
		
		//start reading root directory to check the file extensions
		fs.readdir('./', function(err, files) {
			if (err) return;//throw upon exception
			files.forEach(function(f) {
			//Start iteration over files in the root to check if the file is a split
				//console.log(f);
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
												var title = filename.substring(0,filename.indexOf('$'));
												var targetId = filename.substring(filename.indexOf('$')+1,filename.indexOf('%'));
												//console.log(filedata);//Upload attachment code
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
														if(uploadedAttachment!=null){
															console.log('parentdoc-->'+parentdoc+'*.REQ.*'+requiredsplits);
															requiredsplits--;
														}
														if(requiredsplits <= 0)
															conn.sobject("DTPC_Document__c").update({ //Update parent document
																Id : parentdoc,
																Fax_Status__c : 'Fax Split Complete'
															},function(err, ret) {
  															  	if (err || !ret.success) { return console.error(err, ret); }
																	console.log('Opertion is complete with update to parent doc- '+ ret.id);
 																   	// ...
															});
												});//End of creation of attachments in Salesforce.
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
}
module.exports = router;
